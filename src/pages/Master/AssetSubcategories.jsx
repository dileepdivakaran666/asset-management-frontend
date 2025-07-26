import { useEffect, useState } from 'react';
import api from '../../api/axios';
import {
  Button,
  Table,
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
  Typography,
} from '@mui/material';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';

export default function AssetSubcategories() {
  const [deleteId, setDeleteId] = useState(null);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [subcategories, setSubcategories] = useState([]);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const fetchData = async () => {
    const res = await api.get('/asset-subcategories');
    setSubcategories(res.data);
  };

  const confirmDelete = (id) => {
    setDeleteId(id);
    setOpenConfirm(true);
  };

  const handleDeleteConfirmed = async () => {
    try {
      await api.delete(`/asset-subcategories/${deleteId}`);
      enqueueSnackbar('Subcategory deleted successfully!', { variant: 'info' });
      fetchData();
    } catch (err) {
      enqueueSnackbar('Delete failed!', { variant: 'error' });
    }
    setOpenConfirm(false);
    setDeleteId(null);
  };

  //   const handleDelete = async (id) => {
  //     await api.delete(`/asset-subcategories/${id}`);
  //     fetchData();
  //   };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <Typography variant="h4" gutterBottom>
        Asset Subcategories
      </Typography>
      <Button variant="contained" onClick={() => navigate('/asset-subcategories/create')}>
        + Add Subcategory
      </Button>
      <TableContainer component={Paper} sx={{ mt: 3, border: '1px solid', borderColor: 'divider' }}>
        <Table>
          <TableHead style={{ backgroundColor: '#c5cae9' }}>
            <TableRow>
              <TableCell style={{ fontWeight: 'bold' }}>Category</TableCell>
              <TableCell style={{ fontWeight: 'bold' }}>Name</TableCell>
              <TableCell style={{ fontWeight: 'bold' }}>Description</TableCell>
              <TableCell style={{ fontWeight: 'bold' }}>Status</TableCell>
              <TableCell style={{ fontWeight: 'bold' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {subcategories.map((sub) => (
              <TableRow key={sub._id}>
                <TableCell>{sub.categoryId?.name || sub.category_id}</TableCell>
                <TableCell>{sub.name}</TableCell>
                <TableCell>{sub.description}</TableCell>
                <TableCell>{sub.status ? 'Active' : 'Inactive'}</TableCell>
                <TableCell>
                  <Button onClick={() => navigate(`/asset-subcategories/edit/${sub._id}`)}>
                    Edit
                  </Button>
                  <Button color="error" onClick={() => confirmDelete(sub._id)}>
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
            Are you sure you want to delete this Sub Category? This action cannot be undone.
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
