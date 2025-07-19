import React, { useEffect, useState } from 'react';
import {
  Table, TableHead, TableRow, TableCell, TableBody, Paper,
  TableContainer, Typography, Button, Box
} from '@mui/material';
import api from '../../api/axios';

const DraftGRNList = () => {
  const [grns, setGrns] = useState([]);

  useEffect(() => {
    api.get('/grns').then(res => {
      const draftsOnly = res.data.filter(grn => grn.status === 'draft');
      setGrns(draftsOnly);
    });
  }, []);

  return (
    <Box p={3}>
      <Typography variant="h5" gutterBottom>GRN Drafts</Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
            <TableRow>
              <TableCell>GRN No.</TableCell>
              <TableCell>Invoice</TableCell>
              <TableCell>Vendor</TableCell>
              <TableCell>Branch</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {grns.map(grn => (
              <TableRow key={grn._id}>
                <TableCell>{grn.grnNumber}</TableCell>
                <TableCell>{grn.invoiceNumber}</TableCell>
                <TableCell>{grn.vendor?.name}</TableCell>
                <TableCell>{grn.branch?.name}</TableCell>
                <TableCell>{new Date(grn.grnDate).toLocaleDateString()}</TableCell>
                <TableCell>
                  <strong style={{ color: '#f57c00' }}>Draft</strong>
                </TableCell>
                <TableCell align="center">
                  <Button variant="outlined" size="small">Edit</Button>{' '}
                  <Button variant="outlined" size="small" color="error">Delete</Button>
                </TableCell>
              </TableRow>
            ))}
            {grns.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center">No Draft GRNs Found</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default DraftGRNList;
