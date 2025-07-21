import { useEffect, useState } from "react";
import api from "../../api/axios";
import {
  Button,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle
} from "@mui/material";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";

export default function Manufacturers() {
  const [manufacturers, setManufacturers] = useState([]);
  const [deleteId, setDeleteId] = useState(null);
const [openConfirm, setOpenConfirm] = useState(false);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();  

  const fetchData = async () => {
    const res = await api.get("/manufacturers");
    setManufacturers(res.data);
  };

  const confirmDelete = (id) => {
  setDeleteId(id);
  setOpenConfirm(true);
};

//   const handleDelete = async (id) => {
//     try{
//         await api.delete(`/manufacturers/${id}`);
//         enqueueSnackbar("Manufacturer Deleted successfully!", { variant: "success" });
//         fetchData();
//     } catch (error) {
//       enqueueSnackbar("Failed to delete manufacturer", { variant: "error" });
//     }
//   };

  const handleDeleteConfirmed = async () => {
  try {
    await api.delete(`/manufacturers/${deleteId}`);
    enqueueSnackbar("Manufacturer Deleted successfully!", { variant: "info" });
    fetchData();
  } catch (err) {
    enqueueSnackbar("Failed to delete manufacturer", { variant: "error" });
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
      Manufacturers
    </Typography>
      <Button variant="contained" onClick={() => navigate("/manufacturers/create")}>
        + Add Manufacturer
      </Button>
      <TableContainer component={Paper} sx={{ mt: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><b>Name</b></TableCell>
              <TableCell><b>Description</b></TableCell>
              <TableCell><b>Actions</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {manufacturers.map((mfr) => (
              <TableRow key={mfr.id}>
                <TableCell>{mfr.name}</TableCell>
                <TableCell>{mfr.description}</TableCell>
                <TableCell>
                  <Button onClick={() => navigate(`/manufacturers/edit/${mfr._id}`)}>Edit</Button>
                  <Button color="error" onClick={() => confirmDelete(mfr._id)}>Delete</Button>
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
      Are you sure you want to delete this Manufacturer? This action cannot be undone.
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
