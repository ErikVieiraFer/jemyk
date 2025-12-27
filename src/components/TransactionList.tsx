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
} from '@mui/material';

// Tipagem para as transações que virão como propriedade
interface Transaction {
  id: number;
  created_at: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  categories: {
    name: string;
  } | null;
}

interface TransactionListProps {
  transactions: Transaction[];
}

export default function TransactionList({ transactions }: TransactionListProps) {
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
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Data</TableCell>
              <TableCell>Descrição</TableCell>
              <TableCell>Categoria</TableCell>
              <TableCell align="right">Valor</TableCell>
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
                  {formatDate(transaction.created_at)}
                </TableCell>
                <TableCell>{transaction.description}</TableCell>
                <TableCell>{transaction.categories?.name ?? 'Sem categoria'}</TableCell>
                <TableCell align="right" sx={{ color: transaction.type === 'income' ? 'green' : 'red' }}>
                  {transaction.type === 'income' ? '+' : '-'} {formatCurrency(Math.abs(transaction.amount))}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
