import React from 'react';
import { Box, Typography, Divider, Paper } from '@mui/material';
import { useWatch } from 'react-hook-form';

const TotalsPanel = ({ control }) => {
  const lineItems = useWatch({ control, name: 'lineItems' }) || [];

  const subtotal = lineItems.reduce((sum, item) => {
    const qty = parseFloat(item.quantity || 0);
    const price = parseFloat(item.unitPrice || 0);
    return sum + qty * price;
  }, 0);

  const totalTax = lineItems.reduce((sum, item) => {
    const qty = parseFloat(item.quantity || 0);
    const price = parseFloat(item.unitPrice || 0);
    const tax = parseFloat(item.taxPercent || 0);
    return sum + (qty * price * tax) / 100;
  }, 0);

  const grandTotal = subtotal + totalTax;

  return (
    <Paper
      elevation={2}
      sx={{
        p: 2,
        mt: 2,
        width: { xs: '100%', lg: 300 },
        ml: 'auto',
        textAlign: { xs: 'left', lg: 'right' },
      }}
    >
      <Typography variant="subtitle1" gutterBottom>
        Totals & Summary
      </Typography>
      <Divider sx={{ my: 1 }} />

      <Box display="flex" justifyContent="space-between">
        <Typography>Subtotal:</Typography>
        <Typography>₹{subtotal.toFixed(2)}</Typography>
      </Box>

      <Box display="flex" justifyContent="space-between" mt={1}>
        <Typography>Total Tax:</Typography>
        <Typography>₹{totalTax.toFixed(2)}</Typography>
      </Box>

      <Divider sx={{ my: 2 }} />

      <Box display="flex" justifyContent="space-between">
        <Typography variant="subtitle1">Grand Total:</Typography>
        <Typography variant="subtitle1">₹{grandTotal.toFixed(2)}</Typography>
      </Box>
    </Paper>
  );
};

export default TotalsPanel;
