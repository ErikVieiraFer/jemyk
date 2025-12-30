'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function addTransaction(formData: FormData) {
  const supabase = createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error('User not found');
  }

  const transactionData = {
    description: formData.get('description') as string,
    amount: parseFloat(formData.get('amount') as string),
    type: formData.get('type') as string,
    category_id: formData.get('category_id') as string,
    transaction_date: formData.get('transaction_date') as string,
    user_id: user.id,
  };

  const { error } = await supabase.from('transactions').insert([transactionData]);

  if (error) {
    console.error('Error inserting transaction:', error);
    throw new Error('Failed to add transaction');
  }

  // Limpa o cache da página do dashboard para que ela seja recarregada com a nova transação
  revalidatePath('/');
}

export async function addCategory(formData: FormData) {
  const supabase = createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error('User not found');
  }

  const categoryData = {
    name: formData.get('name') as string,
    description: formData.get('description') as string,
    user_id: user.id,
  };

  const { error } = await supabase.from('categories').insert([categoryData]);

  if (error) {
    console.error('Error inserting category:', error);
    throw new Error('Failed to add category');
  }

  revalidatePath('/categories');
  revalidatePath('/');
}

export async function deleteCategory(formData: FormData) {
  const supabase = createClient();
  const categoryId = formData.get('id') as string;

  const { error } = await supabase.from('categories').delete().match({ id: categoryId });

  if (error) {
    console.error('Error deleting category:', error);
    throw new Error('Failed to delete category');
  }

  revalidatePath('/categories');
  revalidatePath('/');
}
