import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { 
  Container, 
  Box, 
  Typography, 
  Button,
  AppBar,
  Toolbar 
} from '@mui/material';

export default async function Home() {
  const supabase = createClient();

  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    redirect('/login');
  }

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
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Jemyk
          </Typography>
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
          <Typography paragraph>
            Em breve aqui você verá seu resumo financeiro. O próximo passo é construir o formulário para adicionar transações.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}
