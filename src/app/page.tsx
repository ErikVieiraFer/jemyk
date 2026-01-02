import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { 
  Container, 
  Box, 
  Typography, 
  Paper,
  Stack
} from '@mui/material';
import TransactionForm from '@/components/TransactionForm';
import TransactionList from '@/components/TransactionList';
import DonutChart from '@/components/charts/DonutChart';
import SimpleBarChart from '@/components/charts/BarChart';
import ResponsiveAppBar from '@/components/ResponsiveAppBar';

export default async function Home() {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch data in parallel
  const categoriesPromise = supabase.from('categories').select('id, name');
  const transactionsPromise = supabase
    .from('transactions')
    .select(`
      id,
      created_at,
      description,
      amount,
      type,
      category_id,
      transaction_date,
      categories ( id, name )
    `)
    .order('created_at', { ascending: false });

  const [{ data: categories }, { data: transactions }] = await Promise.all([
    categoriesPromise,
    transactionsPromise,
  ]);

  const signOut = async () => {
    'use server';
    
    const supabase = createClient();
    await supabase.auth.signOut();
    return redirect('/login');
  };

  // Process data for charts
  const now = new Date();
  const currentMonthTransactions = transactions?.filter(t => {
    const transactionDate = new Date(t.created_at);
    return transactionDate.getMonth() === now.getMonth() && transactionDate.getFullYear() === now.getFullYear();
  }) ?? [];

  const donutChartData = currentMonthTransactions
    .filter(t => t.type === 'expense')
    .reduce((acc, transaction) => {
      const categoryName = transaction.categories?.name ?? 'Sem categoria';
      const existingCategory = acc.find(item => item.name === categoryName);
      if (existingCategory) {
        existingCategory.value += transaction.amount;
      } else {
        acc.push({ name: categoryName, value: transaction.amount });
      }
      return acc;
    }, [] as { name: string; value: number }[]);

  const barChartData = currentMonthTransactions.reduce((acc, transaction) => {
    if (transaction.type === 'income') {
      acc[0].entradas += transaction.amount;
    } else {
      acc[0].saidas += transaction.amount;
    }
    return acc;
  }, [{ name: 'Mês Atual', entradas: 0, saidas: 0 }]);

  return (
    <Box sx={{ display: 'flex' }}>
      <ResponsiveAppBar signOutAction={signOut} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3 },
          // Adiciona um espaçamento no topo igual à altura do AppBar
          mt: ['48px', '56px', '64px'], 
        }}
      >
        <Container>
          <Typography variant="h5" gutterBottom>Dashboard</Typography>
          <Typography paragraph>
            Bem-vindo(a), {user.email}!
          </Typography>

          <Stack direction={{ xs: 'column', md: 'row' }} spacing={4} sx={{ mb: 4 }}>
            <Paper sx={{ p: 2, flex: 1 }}>
              <Typography variant="h6">Gastos por Categoria</Typography>
              <DonutChart data={donutChartData} />
            </Paper>
            <Paper sx={{ p: 2, flex: 1 }}>
              <Typography variant="h6">Entradas vs. Saídas</Typography>
              <SimpleBarChart data={barChartData} />
            </Paper>
          </Stack>
          
          <Stack direction={{ xs: 'column', lg: 'row' }} spacing={4} sx={{ justifyContent: 'center' }}>
            <Paper sx={{ p: 2, flex: '0 1 400px' }}>
              <TransactionForm categories={categories ?? []} />
            </Paper>
            <Paper sx={{ p: 2 }}>
              <TransactionList transactions={transactions ?? []} categories={categories ?? []} />
            </Paper>
          </Stack>

        </Container>
      </Box>
    </Box>
  );
}
