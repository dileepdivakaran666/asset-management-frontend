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
} from '@mui/material';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';

export default function Branches() {
  const [branches, setBranches] = useState([]);
  const navigate = useNavigate();
  const [deleteId, setDeleteId] = useState(null);
  const [openConfirm, setOpenConfirm] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const fetchData = async () => {
    const res = await api.get('/branches');
    setBranches(res.data);
  };

  const confirmDelete = (id) => {
    setDeleteId(id);
    setOpenConfirm(true);
  };

  //   const handleDelete = async (id) => {
  //     try{
  //         await api.delete(`/branches/${id}`);
  //     enqueueSnackbar("Branch Deleted successfully!", { variant: "success" });
  //     fetchData();
  //     }catch (error) {
  //       enqueueSnackbar("Failed to delete branch", { variant: "error" });
  //     }
  //   };

  const handleDeleteConfirmed = async () => {
    try {
      await api.delete(`/branches/${deleteId}`);
      enqueueSnackbar('Branch Deleted successfully!', { variant: 'info' });
      fetchData();
    } catch (err) {
      enqueueSnackbar('Failed to delete branch', { variant: 'error' });
    }
    setOpenConfirm(false);
    setDeleteId(null);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <h2>Branches</h2>
      <Button variant="contained" onClick={() => navigate('/branches/create')}>
        + Add Branch
      </Button>
      <TableContainer component={Paper} sx={{ mt: 3 }}>
        <Table>
          <TableHead style={{ backgroundColor: '#c5cae9' }}>
            <TableRow>
              <TableCell>
                <b>Name</b>
              </TableCell>
              <TableCell>
                <b>Location</b>
              </TableCell>
              <TableCell>
                <b>Code</b>
              </TableCell>
              <TableCell>
                <b>Status</b>
              </TableCell>
              <TableCell>
                <b>Actions</b>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {branches.map((branch) => (
              <TableRow key={branch._id}>
                <TableCell>{branch.name}</TableCell>
                <TableCell>{branch.location}</TableCell>
                <TableCell>{branch.code}</TableCell>
                <TableCell>{branch.status ? 'Active' : 'Inactive'}</TableCell>
                <TableCell>
                  <Button onClick={() => navigate(`/branches/edit/${branch._id}`)}>Edit</Button>
                  <Button color="error" onClick={() => confirmDelete(branch._id)}>
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
            Are you sure you want to delete this Branch? This action cannot be undone.
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
