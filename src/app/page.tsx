import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { 
  Container, 
  Box, 
  Typography, 
  Button,
  AppBar,
  Toolbar 
} from '@mui/material';
import Link from 'next/link';
import TransactionForm from '@/components/TransactionForm';

export default async function Home() {
  const supabase = createClient();

  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    redirect('/login');
  }

  // Fetch categories for the form
  const { data: categories } = await supabase.from('categories').select('id, name');

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
            Jemyk
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
          <Typography variant="h5">Dashboard</Typography>
          <Typography paragraph>
            Bem-vindo(a), {data.user.email}!
          </Typography>
          
          <TransactionForm categories={categories ?? []} />

        </Container>
      </Box>
    </Box>
  );
}
