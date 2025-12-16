'use client';

import { createClient } from '@/lib/supabase/client';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Box, Typography } from '@mui/material';

export default function LoginPage() {
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        // Usa replace para não adicionar a página de login ao histórico do navegador
        router.replace('/'); 
      }
    });

    // Garante que, se o usuário já tiver uma sessão ao carregar a página,
    // ele seja redirecionado imediatamente.
    const checkSession = async () => {
        const { data } = await supabase.auth.getSession();
        if (data.session) {
            router.replace('/');
        }
    };
    checkSession();

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, router]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: 2,
      }}
    >
      <Box sx={{ width: '100%', maxWidth: '400px' }}>
        <Typography variant="h4" component="h1" gutterBottom textAlign="center">
          Jemyk
        </Typography>
        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          providers={[]}
          localization={{
            variables: {
              sign_in: {
                email_label: 'Seu e-mail',
                password_label: 'Sua senha',
                email_input_placeholder: 'seu@email.com',
                password_input_placeholder: '••••••••',
                button_label: 'Entrar',
                social_provider_text: 'Entrar com {{provider}}',
                link_text: 'Já tem uma conta? Entre',
              },
              sign_up: {
                email_label: 'Seu e-mail',
                password_label: 'Crie uma senha',
                email_input_placeholder: 'seu@email.com',
                password_input_placeholder: '••••••••',
                button_label: 'Cadastrar',
                social_provider_text: 'Cadastrar com {{provider}}',
                link_text: 'Não tem uma conta? Cadastre-se',
                user_label: 'This is a user label',
                },
               forgotten_password: {
                email_label: 'Seu e-mail',
                email_input_placeholder: 'seu@email.com',
                button_label: 'Enviar instruções',
                link_text: 'Esqueceu sua senha?',
              },
              update_password: {
                password_label: 'Nova senha',
                password_input_placeholder: '••••••••',
                button_label: 'Atualizar senha',
              }
            },
          }}
        />
      </Box>
    </Box>
  );
}
