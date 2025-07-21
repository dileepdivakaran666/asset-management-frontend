import React, { useEffect, useState } from "react";
import { Box, Typography, Divider,TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper, CircularProgress } from "@mui/material";
import { useParams } from "react-router-dom";
import api from "../../api/axios";

const GRNView = () => {
  const { id } = useParams();
  const [grn, setGrn] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/grns/${id}`)
      .then(res => setGrn(res.data))
      .catch(() => setGrn(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <CircularProgress sx={{ mt: 4 }} />;

  if (!grn) return <Typography mt={4}>GRN not found</Typography>;

  const { grnNumber, invoiceNumber, grnDate, vendorId, branchId, status, grandTotal, lineItems = [] } = grn;

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>View GRN</Typography>
      <Box mb={2}>
        <Typography variant="subtitle1"><strong>GRN Number:</strong> {grnNumber}</Typography>
        <Typography variant="subtitle1"><strong>Invoice Number:</strong> {invoiceNumber}</Typography>
        <Typography variant="subtitle1"><strong>Date:</strong> {new Date(grnDate).toLocaleDateString()}</Typography>
        <Typography variant="subtitle1"><strong>Vendor:</strong> {vendorId?.name}</Typography>
        <Typography variant="subtitle1"><strong>Branch:</strong> {branchId?.name}</Typography>
        <Typography variant="subtitle1"><strong>Status:</strong> {status}</Typography>
        <Typography variant="subtitle1"><strong>Total Amount:</strong> ₹{grandTotal?.toFixed(2)}</Typography>
      </Box>

      <Divider sx={{ my: 2 }} />

      <Typography variant="h6" gutterBottom>Line Items</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Subcategory</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Qty</TableCell>
              <TableCell>Unit Price</TableCell>
              <TableCell>Tax %</TableCell>
              <TableCell>Taxable Value</TableCell>
              <TableCell>Total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {lineItems.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{item.subcategoryId?.name}</TableCell>
                <TableCell>{item.itemDescription}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>₹{item.unitPrice}</TableCell>
                <TableCell>{item.taxPercent}%</TableCell>
                <TableCell>₹{(item.quantity * item.unitPrice).toFixed(2)}</TableCell>
                <TableCell>
                  ₹{((item.quantity * item.unitPrice) * (1 + item.taxPercent / 100)).toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default GRNView;
