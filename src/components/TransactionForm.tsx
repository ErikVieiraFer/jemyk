'use client';

import { addTransaction } from '@/app/actions';
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
} from '@mui/material';
import { useRef } from 'react';

// Tipagem para as categorias que virão como propriedade
interface Category {
  id: string;
  name: string;
}

interface TransactionFormProps {
  categories: Category[];
}

export default function TransactionForm({ categories }: TransactionFormProps) {
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (formData: FormData) => {
    await addTransaction(formData);
    // Limpa o formulário após o envio
    formRef.current?.reset();
  };

  return (
    <form ref={formRef} action={handleSubmit}>
      <Stack spacing={2} sx={{ maxWidth: '500px', mt: 4 }}>
        <Typography variant="h6">Adicionar Nova Transação</Typography>
        
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
          inputProps={{ step: '0.01' }} // para permitir centavos
        />

        <FormControl component="fieldset">
          <FormLabel component="legend">Tipo</FormLabel>
          <RadioGroup row name="type" defaultValue="expense">
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
            defaultValue=""
            required
          >
            {categories.map((category) => (
              <MenuItem key={category.id} value={category.id}>
                {category.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button type="submit" variant="contained" color="primary">
          Adicionar
        </Button>
      </Stack>
    </form>
  );
}

// Adicionando Typography que pode ter faltado no import
import { Typography } from '@mui/material';
