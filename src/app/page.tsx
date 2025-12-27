import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { 
  Container, 
  Box, 
  Typography, 
  Button,
  AppBar,
  Toolbar,
  Paper,
  Stack
} from '@mui/material';
import Link from 'next/link';
import TransactionForm from '@/components/TransactionForm';
import TransactionList from '@/components/TransactionList';

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
      categories ( name )
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

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar 
        position="fixed"
        sx={{ zIndex: 1201 }}
      >
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
              Jemyk
            </Link>
          </Typography>
          <Button color="inherit" component={Link} href="/categories">
            Categorias
          </Button>
          <form action={signOut}>
            <Button color="inherit" type="submit">
              Sair
            </Button>
          </form>
        </Toolbar>
      </AppBar>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          // Adiciona um espaçamento no topo igual à altura do AppBar
          mt: ['48px', '56px', '64px'], 
        }}
      >
        <Container>
          <Typography variant="h5" gutterBottom>Dashboard</Typography>
          <Typography paragraph>
            Bem-vindo(a), {user.email}!
          </Typography>
          
          <Stack direction={{ xs: 'column', lg: 'row' }} spacing={4} sx={{ justifyContent: 'center' }}>
            <Paper sx={{ p: 2, flex: '0 1 400px' }}>
              <TransactionForm categories={categories ?? []} />
            </Paper>
            <Paper sx={{ p: 2 }}>
              <TransactionList transactions={transactions ?? []} />
            </Paper>
          </Stack>

        </Container>
      </Box>
    </Box>
  );
}
