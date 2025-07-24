import React, { useEffect, useState } from 'react';
import {
  Table, TableHead, TableRow, TableCell, TableBody, Paper,
  TableContainer, Typography, Button, Box, useTheme
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import api from '../../api/axios';

const GRNList = () => {
  const [grns, setGrns] = useState([]);
  const theme = useTheme();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const getStatusColor = (status) => {
    switch(status) {
      case 'submitted': return theme.palette.success.main;
      case 'draft': return theme.palette.warning.main;
      default: return theme.palette.text.secondary;
    }
  };

  useEffect(() => {
    api.get('/grns').then(res => setGrns(res.data));
  }, []);

  const handleDelete = async (id) => {
  try {
    await api.delete(`/grns/${id}`);
    enqueueSnackbar("GRN deleted successfully", { variant: "success" });
    setGrns((prev) => prev.filter((g) => g._id !== id));
  } catch (error) {
    enqueueSnackbar("Failed to delete GRN", { variant: "error" });
  }
};

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>GRN List</Typography>
      <Box sx={{ 
        display: 'flex',
        justifyContent: 'flex-end',
        mb: 3, // margin bottom
        pr: 2, // padding right
      }}>
        <Button 
          size="small"
          variant="contained" 
          color="primary"
          onClick={() => navigate('/grn/new')}
          sx={{
            textTransform: 'none', // prevents uppercase transformation
            ml: 2, // margin left if needed
          }}
        >
          Create New GRN
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
            <TableRow>
              <TableCell style={{ fontWeight: 'bold' }}>GRN No.</TableCell>
              <TableCell style={{ fontWeight: 'bold' }}>Invoice</TableCell>
              <TableCell style={{ fontWeight: 'bold' }}>Vendor</TableCell>
              <TableCell style={{ fontWeight: 'bold' }}>Branch</TableCell>
              <TableCell style={{ fontWeight: 'bold' }}>Date</TableCell>
              <TableCell style={{ fontWeight: 'bold' }}>Status</TableCell>
              <TableCell style={{ fontWeight: 'bold' }}>Total</TableCell>
              <TableCell style={{ fontWeight: 'bold' }} align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {grns.map(grn => (
              <TableRow key={grn._id}>
                <TableCell>{grn.grnNumber}</TableCell>
                <TableCell>{grn.invoiceNumber}</TableCell>
                <TableCell>{grn.vendorId?.name}</TableCell>
                <TableCell>{grn.branchId?.name}</TableCell>
                <TableCell>{new Date(grn.grnDate).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center">
                                          <Box 
                                            sx={{
                                              width: 10,
                                              height: 10,
                                              borderRadius: '50%',
                                              bgcolor: getStatusColor(grn.status),
                                              mr: 1
                                            }} 
                                          />
                                          <Typography 
                                            variant="body2"
                                            sx={{ 
                                              textTransform: 'capitalize',
                                              color: getStatusColor(grn.status)
                                            }}
                                          >
                                            {grn.status}
                                          </Typography>
                                        </Box>
                </TableCell>
                <TableCell>
                  ₹ {grn.grandTotal?.toFixed(2) ?? 'N/A'}
                </TableCell>
                <TableCell align="center">
                  <Button size="small" variant="outlined" color="primary" onClick={() => navigate(`/grn/view/${grn._id}`)}>View</Button>{' '}
                  <Button size="small" variant="outlined" color="secondary" onClick={() => navigate(`/grn/edit/${grn._id}`)}>Edit</Button>{' '}
                  <Button size="small" variant="outlined" color="error" onClick={() => handleDelete(grn._id)}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
            {grns.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} align="center">No GRNs found.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default GRNList;
