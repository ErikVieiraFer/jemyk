'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  Button,
  Modal,
  Card,
  CardContent,
  CardActions,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useState } from 'react';
import TransactionForm from './TransactionForm';

// Tipagem para as transações que virão como propriedade
interface Transaction {
  id: number;
  created_at: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category_id: string;
  transaction_date: string;
  categories: {
    id: string;
    name: string;
  }[] | null;
}

interface Category {
  id: string;
  name: string;
}

interface TransactionListProps {
  transactions: Transaction[];
  categories: Category[];
}

export default function TransactionList({ transactions, categories }: TransactionListProps) {
  const [open, setOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleOpen = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedTransaction(null);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        Transações Recentes
      </Typography>
      {isMobile ? (
        <Box>
          {transactions.map((transaction) => (
            <Card 
              key={transaction.id} 
              sx={{ 
                mb: 2,
                backgroundColor: transaction.type === 'income' ? 'rgba(0, 255, 0, 0.05)' : 'rgba(255, 0, 0, 0.05)',
              }}
            >
              <CardContent>
                <Typography variant="body1">{transaction.description}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {formatDate(transaction.transaction_date)} - {transaction.categories?.[0]?.name ?? 'Sem categoria'}
                </Typography>
                <Typography 
                  variant="h6" 
                  sx={{ color: transaction.type === 'income' ? 'green' : 'red', mt: 1 }}
                >
                  {transaction.type === 'income' ? '+' : '-'} {formatCurrency(Math.abs(transaction.amount))}
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: 'flex-end' }}>
                <Button 
                  onClick={() => handleOpen(transaction)}
                  sx={{ minWidth: '44px', minHeight: '44px' }}
                >
                  Editar
                </Button>
              </CardActions>
            </Card>
          ))}
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Data</TableCell>
                <TableCell>Descrição</TableCell>
                <TableCell>Categoria</TableCell>
                <TableCell align="right">Valor</TableCell>
                <TableCell align="center">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow
                  key={transaction.id}
                  sx={{ 
                    '&:last-child td, &:last-child th': { border: 0 },
                    backgroundColor: transaction.type === 'income' ? 'rgba(0, 255, 0, 0.05)' : 'rgba(255, 0, 0, 0.05)',
                  }}
                >
                  <TableCell component="th" scope="row">
                    {formatDate(transaction.transaction_date)}
                  </TableCell>
                  <TableCell>{transaction.description}</TableCell>
                  <TableCell>{transaction.categories?.[0]?.name ?? 'Sem categoria'}</TableCell>
                  <TableCell align="right" sx={{ color: transaction.type === 'income' ? 'green' : 'red' }}>
                    {transaction.type === 'income' ? '+' : '-'} {formatCurrency(Math.abs(transaction.amount))}
                  </TableCell>
                  <TableCell align="center">
                    <Button 
                      onClick={() => handleOpen(transaction)}
                      sx={{ minWidth: '44px', minHeight: '44px' }}
                    >
                      Editar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '90%', sm: 400 },
          bgcolor: 'background.paper',
          border: '2px solid #000',
          boxShadow: 24,
          p: 4,
        }}>
          <TransactionForm categories={categories} transaction={selectedTransaction} />
        </Box>
      </Modal>
    </Box>
  );
}
