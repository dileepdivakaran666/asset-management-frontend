import { useEffect, useState } from 'react';
import api from '../../api/axios';
import {
  Button,
  Table,
  Typography,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';

export default function Vendors() {
  const [vendors, setVendors] = useState([]);
  const [deleteId, setDeleteId] = useState(null);
  const [openConfirm, setOpenConfirm] = useState(false);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const fetchData = async () => {
    const res = await api.get('/vendors');
    setVendors(res.data);
  };

  const confirmDelete = (id) => {
    setDeleteId(id);
    setOpenConfirm(true);
  };

  //   const handleDelete = async (id) => {
  //     try{
  //     await api.delete(`/vendors/${id}`);
  //     enqueueSnackbar('Vendor Deleted Succesfully', {variant: "success"})
  //     fetchData();
  //     }
  //     catch(err){

  //     }
  //   };

  const handleDeleteConfirmed = async () => {
    try {
      await api.delete(`/vendors/${deleteId}`);
      enqueueSnackbar('Vendor deleted successfully!', { variant: 'info' });
      fetchData();
    } catch (err) {
      enqueueSnackbar('Vendor Delete failed!', { variant: 'error' });
    }
    setOpenConfirm(false);
    setDeleteId(null);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <Typography variant="h4" gutterBottom>
        Vendors
      </Typography>
      <Button variant="contained" onClick={() => navigate('/vendors/create')}>
        + Add Vendor
      </Button>
      <TableContainer component={Paper} sx={{ mt: 3 }}>
        <Table>
          <TableHead style={{ backgroundColor: '#c5cae9' }}>
            <TableRow>
              <TableCell>
                <b>Name</b>
              </TableCell>
              <TableCell>
                <b>Contact</b>
              </TableCell>
              <TableCell>
                <b>Email</b>
              </TableCell>
              <TableCell>
                <b>Phone</b>
              </TableCell>
              <TableCell>
                <b>Actions</b>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {vendors.map((vendor) => (
              <TableRow key={vendor.id}>
                <TableCell>{vendor.name}</TableCell>
                <TableCell>{vendor.contact_person}</TableCell>
                <TableCell>{vendor.email}</TableCell>
                <TableCell>{vendor.phone}</TableCell>
                <TableCell>
                  <Button onClick={() => navigate(`/vendors/edit/${vendor._id}`)}>Edit</Button>
                  <Button color="error" onClick={() => confirmDelete(vendor._id)}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this Vendor? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirm(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirmed} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
