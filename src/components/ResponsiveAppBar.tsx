'use client';

import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  useMediaQuery,
  useTheme,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Link from 'next/link';
import { useState } from 'react';

interface ResponsiveAppBarProps {
  signOutAction: () => Promise<never>;
}

export default function ResponsiveAppBar({ signOutAction }: ResponsiveAppBarProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
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
        {isMobile ? (
          <>
            <IconButton
              color="inherit"
              aria-label="menu"
              onClick={handleMenu}
              sx={{ minWidth: '44px', minHeight: '44px' }}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={open}
              onClose={handleClose}
            >
              <MenuItem onClick={handleClose} component={Link} href="/categories">Categorias</MenuItem>
              <form action={signOutAction}>
                <MenuItem onClick={handleClose} component="button" type="submit" sx={{ width: '100%' }}>Sair</MenuItem>
              </form>
            </Menu>
          </>
        ) : (
          <>
            <Button color="inherit" component={Link} href="/categories" sx={{ minHeight: '44px' }}>
              Categorias
            </Button>
            <form action={signOutAction}>
              <Button color="inherit" type="submit" sx={{ minHeight: '44px' }}>
                Sair
              </Button>
            </form>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}
