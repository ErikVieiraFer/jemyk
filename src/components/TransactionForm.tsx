'use client';

import { addTransaction, updateTransaction } from '@/app/actions';
import {
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormLabel,
  Box,
  Stack,
  Typography,
} from '@mui/material';
import { useRef, useEffect } from 'react';

interface Category {
  id: string;
  name: string;
}

interface Transaction {
  id: number;
  description: string;
  amount: number;
  type: string;
  category_id: string;
  transaction_date: string;
}

interface TransactionFormProps {
  categories: Category[];
  transaction?: Transaction | null;
}

export default function TransactionForm({ categories, transaction }: TransactionFormProps) {
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (transaction && formRef.current) {
      formRef.current.description.value = transaction.description;
      formRef.current.amount.value = transaction.amount.toString();
      formRef.current.type.value = transaction.type;
      formRef.current.category_id.value = transaction.category_id;
      formRef.current.transaction_date.value = new Date(transaction.transaction_date).toISOString().split('T')[0];
    }
  }, [transaction]);

  const handleSubmit = async (formData: FormData) => {
    if (transaction) {
      await updateTransaction(formData);
    } else {
      await addTransaction(formData);
    }
    formRef.current?.reset();
  };

  return (
    <form ref={formRef} action={handleSubmit}>
      <Stack spacing={2} sx={{ maxWidth: '500px', mt: 4 }}>
        <Typography variant="h6">{transaction ? 'Editar Transação' : 'Adicionar Nova Transação'}</Typography>
        
        {transaction && <input type="hidden" name="id" value={transaction.id} />}

        <TextField
          label="Descrição"
          name="description"
          variant="outlined"
          required
        />
        
        <TextField
          label="Valor"
          name="amount"
          type="number"
          variant="outlined"
          required
          inputProps={{ step: '0.01' }}
        />

        <TextField
          label="Data da Transação"
          name="transaction_date"
          type="date"
          defaultValue={new Date().toISOString().split('T')[0]}
          InputLabelProps={{
            shrink: true,
          }}
          required
        />

        <FormControl component="fieldset">
          <FormLabel component="legend">Tipo</FormLabel>
          <RadioGroup row name="type" defaultValue={transaction?.type || "expense"}>
            <FormControlLabel value="expense" control={<Radio />} label="Despesa" />
            <FormControlLabel value="income" control={<Radio />} label="Receita" />
          </RadioGroup>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel id="category-select-label">Categoria</InputLabel>
          <Select
            labelId="category-select-label"
            id="category-select"
            name="category_id"
            label="Categoria"
            defaultValue={transaction?.category_id || ""}
            required
          >
            {categories.map((category) => (
              <MenuItem key={category.id} value={category.id}>
                {category.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button type="submit" variant="contained" color="primary" sx={{ minHeight: '44px' }}>
          {transaction ? 'Salvar Alterações' : 'Adicionar'}
        </Button>      </Stack>
    </form>
  );
}
