import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
  Grid,
} from '@mui/material';
import { Download } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { useSnackbar } from 'notistack';
import api from '../../api/axios';

const GRNReport = () => {
  const [grns, setGrns] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [branches, setBranches] = useState([]);
  const { enqueueSnackbar } = useSnackbar();

  const [filters, setFilters] = useState({
    from: null,
    to: null,
    vendor: '',
    branch: '',
  });

  const fetchFilters = async () => {
    const [vendorRes, branchRes] = await Promise.all([api.get('/vendors'), api.get('/branches')]);
    setVendors(vendorRes.data);
    setBranches(branchRes.data);
  };

  const fetchGRNs = async () => {
    const params = {};
    if (filters.from) params.from = filters.from.toISOString();
    if (filters.to) params.to = filters.to.toISOString();
    if (filters.vendor) params.vendor = filters.vendor;
    if (filters.branch) params.branch = filters.branch;

    const res = await api.get('/grn-reports/report', { params });

    setGrns(res.data);
  };

  const handleExport = async () => {
    try {
      const params = {};
      if (filters.from) params.from = filters.from.toISOString();
      if (filters.to) params.to = filters.to.toISOString();
      if (filters.vendor) params.vendor = filters.vendor;
      if (filters.branch) params.branch = filters.branch;

      const response = await api.get(`/grn-reports/export`, {
        params,
        responseType: 'blob', // important!
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'GRN_Report.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Export error:', error);
      enqueueSnackbar('Export failed', { variant: 'error' });
    }
  };

  useEffect(() => {
    fetchFilters();
    fetchGRNs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        GRN Register Report
      </Typography>

      {/* Filters */}
      <Grid container spacing={2} alignItems="center" mb={3}>
        <Grid item xs={12} md={3}>
          <DatePicker
            label="From Date"
            value={filters.from}
            onChange={(date) => setFilters((f) => ({ ...f, from: date }))}
            slotProps={{ textField: { fullWidth: true } }}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <DatePicker
            label="To Date"
            value={filters.to}
            onChange={(date) => setFilters((f) => ({ ...f, to: date }))}
            slotProps={{ textField: { fullWidth: true } }}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <TextField
            sx={{ minWidth: 200 }}
            select
            label="Vendor"
            fullWidth
            value={filters.vendor}
            onChange={(e) => setFilters((f) => ({ ...f, vendor: e.target.value }))}
          >
            <MenuItem value="">All</MenuItem>
            {vendors.map((v) => (
              <MenuItem key={v._id} value={v._id}>
                {v.name}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} md={3}>
          <TextField
            sx={{ minWidth: 200 }}
            select
            label="Branch"
            fullWidth
            value={filters.branch}
            onChange={(e) => setFilters((f) => ({ ...f, branch: e.target.value }))}
          >
            <MenuItem value="">All</MenuItem>
            {branches.map((b) => (
              <MenuItem key={b._id} value={b._id}>
                {b.name}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid item xs={12} md={6}>
          <Button variant="contained" color="primary" onClick={fetchGRNs}>
            Apply Filters
          </Button>
          <Button
            variant="contained"
            color="success"
            startIcon={<Download />}
            sx={{ ml: 2 }}
            onClick={handleExport}
          >
            Export Excel
          </Button>
        </Grid>
      </Grid>

      {/* Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: '#c5cae9' }}>
            <TableRow>
              <TableCell style={{ fontWeight: 'bold' }}>GRN No.</TableCell>
              <TableCell style={{ fontWeight: 'bold' }}>Date</TableCell>
              <TableCell style={{ fontWeight: 'bold' }}>Invoice</TableCell>
              <TableCell style={{ fontWeight: 'bold' }}>Vendor</TableCell>
              <TableCell style={{ fontWeight: 'bold' }}>Branch</TableCell>
              <TableCell style={{ fontWeight: 'bold' }}>Total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {grns.map((grn) => (
              <TableRow key={grn._id}>
                <TableCell>{grn.grnNumber}</TableCell>
                <TableCell>{dayjs(grn.grnDate).format('DD-MM-YYYY')}</TableCell>
                <TableCell>{grn.invoiceNumber}</TableCell>
                <TableCell>{grn.vendorId?.name}</TableCell>
                <TableCell>{grn.branchId?.name}</TableCell>
                <TableCell>₹{grn.grandTotal?.toFixed(2)}</TableCell>
              </TableRow>
            ))}
            {grns.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No records found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default GRNReport;
