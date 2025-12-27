import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import {
  Container,
  Box,
  Typography,
  Button,
  AppBar,
  Toolbar,
  List,
  ListItem,
  ListItemText,
  IconButton,
  TextField,
  Stack,
  Paper,
} from '@mui/material';
import Link from 'next/link';
import { addCategory, deleteCategory } from '@/app/actions';
import DeleteIcon from '@mui/icons-material/Delete';

export default async function CategoriesPage() {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: categories } = await supabase.from('categories').select('id, name, description');

  const signOut = async () => {
    'use server';
    const supabase = createClient();
    await supabase.auth.signOut();
    return redirect('/login');
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" sx={{ zIndex: 1201 }}>
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
          mt: ['48px', '56px', '64px'],
        }}
      >
        <Container>
          <Typography variant="h5" gutterBottom>
            Gerenciar Categorias
          </Typography>

          <Stack direction={{ xs: 'column', md: 'row' }} spacing={4}>
            <Paper sx={{ p: 2, flex: 1 }}>
              <Typography variant="h6" gutterBottom>
                Adicionar Nova Categoria
              </Typography>
              <form action={addCategory}>
                <Stack spacing={2}>
                  <TextField label="Nome da Categoria" name="name" required />
                  <TextField label="Descrição (Opcional)" name="description" />
                  <Button type="submit" variant="contained">
                    Adicionar
                  </Button>
                </Stack>
              </form>
            </Paper>

            <Paper sx={{ p: 2, flex: 1 }}>
              <Typography variant="h6" gutterBottom>
                Categorias Existentes
              </Typography>
              <List>
                {categories?.map((category) => (
                  <ListItem
                    key={category.id}
                    secondaryAction={
                      <form action={deleteCategory}>
                        <input type="hidden" name="id" value={category.id} />
                        <IconButton edge="end" aria-label="delete" type="submit">
                          <DeleteIcon />
                        </IconButton>
                      </form>
                    }
                  >
                    <ListItemText
                      primary={category.name}
                      secondary={category.description}
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}
