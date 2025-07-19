import { useEffect, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  MenuItem,
  IconButton,
  Button,
  Toolbar,
  Typography,
  InputAdornment
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { useWatch, useFormContext } from 'react-hook-form';

const LineItemTable = ({ control, fields, append, remove, register, errors, subcategories }) => {
  const watchedLineItems = useWatch({ control, name: 'lineItems' });
  const lineItems = useMemo(() => watchedLineItems || [], [watchedLineItems]);
  const { watch, setValue } = useFormContext();

  useEffect(() => {
    lineItems.forEach((item, index) => {
      const qty = parseFloat(item.quantity || 0);
      const price = parseFloat(item.unitPrice || 0);
      const tax = parseFloat(item.tax || 0);

      const taxableValue = qty * price;
      const taxAmount = (taxableValue * tax) / 100;
      const totalAmount = taxableValue + taxAmount;

      if (item.taxableValue !== taxableValue) {
        setValue(`lineItems.${index}.taxableValue`, taxableValue);
      }
      if (item.totalAmount !== totalAmount) {
        setValue(`lineItems.${index}.totalAmount`, totalAmount);
      }
    });
  }, [lineItems, setValue]);

  return (
    <TableContainer component={Paper} sx={{ mt: 2 }}>
      <Toolbar sx={{ pl: 0, pr: 0 }}>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Line Items
        </Typography>
        <Button
          startIcon={<AddIcon />}
          onClick={() =>
            append({
              subcategoryId: '',
              itemDescription: '',
              quantity: '',
              unitPrice: '',
              tax: '',
              taxableValue: 0,
              totalAmount: 0
            })
          }
          variant="outlined"
        >
          Add Row
        </Button>
      </Toolbar>

      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>#</TableCell>
            <TableCell>Subcategory</TableCell>
            <TableCell>Item Description</TableCell>
            <TableCell align="right">Qty</TableCell>
            <TableCell align="right">Unit Price</TableCell>
            <TableCell align="right">Tax %</TableCell>
            <TableCell align="right">Taxable Value</TableCell>
            <TableCell align="right">Total Amount</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {fields.map((item, index) => {
            const qty = parseFloat(lineItems?.[index]?.quantity || 0);
            const price = parseFloat(lineItems?.[index]?.unitPrice || 0);
            const tax = parseFloat(lineItems?.[index]?.tax || 0);

            const taxableValue = qty * price;
            const taxAmount = (taxableValue * tax) / 100;
            const totalAmount = taxableValue + taxAmount;

            return (
              <TableRow key={item.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>
                  <TextField
                    select
                    fullWidth
                    size="small"
                    variant="standard"
                    {...register(`lineItems.${index}.subcategoryId`)}
                    error={Boolean(errors.lineItems?.[index]?.subcategoryId)}
                    helperText={errors.lineItems?.[index]?.subcategoryId?.message}
                    value={watch(`lineItems.${index}.subcategoryId`) || ''}
                  >
                    {subcategories.map(sub => (
                      <MenuItem key={sub._id} value={sub._id}>
                        {sub.name}
                      </MenuItem>
                    ))}
                  </TextField>
                </TableCell>
                <TableCell>
                  <TextField
                    fullWidth
                    size="small"
                    variant="standard"
                    {...register(`lineItems.${index}.itemDescription`)}
                    error={Boolean(errors.lineItems?.[index]?.itemDescription)}
                    helperText={errors.lineItems?.[index]?.itemDescription?.message}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    fullWidth
                    size="small"
                    variant="standard"
                    type="number"
                    {...register(`lineItems.${index}.quantity`)}
                    error={Boolean(errors.lineItems?.[index]?.quantity)}
                    helperText={errors.lineItems?.[index]?.quantity?.message}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    fullWidth
                    size="small"
                    variant="standard"
                    type="number"
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                    {...register(`lineItems.${index}.unitPrice`)}
                    error={Boolean(errors.lineItems?.[index]?.unitPrice)}
                    helperText={errors.lineItems?.[index]?.unitPrice?.message}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    fullWidth
                    size="small"
                    variant="standard"
                    type="number"
                    InputProps={{
                      endAdornment: <InputAdornment position="end">%</InputAdornment>,
                    }}
                    inputProps={{ min: 0, max: 100 }}
                    {...register(`lineItems.${index}.tax`)}
                    error={Boolean(errors.lineItems?.[index]?.tax)}
                    helperText={errors.lineItems?.[index]?.tax?.message}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    fullWidth
                    size="small"
                    variant="standard"
                    value={taxableValue.toFixed(2)}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                      readOnly: true,
                    }}
                    {...register(`lineItems.${index}.taxableValue`)}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    fullWidth
                    size="small"
                    variant="standard"
                    value={totalAmount.toFixed(2)}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                      readOnly: true,
                    }}
                    {...register(`lineItems.${index}.totalAmount`)}
                  />
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => remove(index)} color="error" size="small">
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default LineItemTable;