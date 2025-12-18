'use client';
import * as React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';

// Este componente envolve a aplicação, fornecendo o tema visual do Material-UI.
export default function ThemeRegistry({ children }: { children: React.ReactNode }) {
  const theme = React.useMemo(() => createTheme({
    palette: {
      mode: 'dark', // O aplicativo iniciará com um tema escuro.
    },
  }), []);

  return (
    <AppRouterCacheProvider options={{ key: 'mui' }}>
      <ThemeProvider theme={theme}>
        {/* CssBaseline reinicia o CSS para um padrão consistente entre navegadores. */}
        <CssBaseline />
        {children}
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}
