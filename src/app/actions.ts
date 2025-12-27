'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function addTransaction(formData: FormData) {
  const supabase = createClient();

  // Pega o user_id da sessão atual
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error('User not found');
  }

  const transactionData = {
    description: formData.get('description') as string,
    amount: parseFloat(formData.get('amount') as string),
    type: formData.get('type') as string,
    category_id: formData.get('category_id') as string,
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
