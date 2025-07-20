import { useEffect, useState } from "react";
import api from "../../api/axios";
import {
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
} from "@mui/material";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";

export default function Branches() {
  const [branches, setBranches] = useState([]);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const fetchData = async () => {
    const res = await api.get("/branches");
    setBranches(res.data);
  };

  const handleDelete = async (id) => {
    try{
        await api.delete(`/branches/${id}`);
    enqueueSnackbar("Branch Deleted successfully!", { variant: "success" });
    fetchData();
    }catch (error) {
      enqueueSnackbar("Failed to delete branch", { variant: "error" });
    }
    
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <h2>Branches</h2>
      <Button variant="contained" onClick={() => navigate("/branches/create")}>
        + Add Branch
      </Button>
      <TableContainer component={Paper} sx={{ mt: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><b>Name</b></TableCell>
              <TableCell><b>Location</b></TableCell>
              <TableCell><b>Code</b></TableCell>
              <TableCell><b>Status</b></TableCell>
              <TableCell><b>Actions</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {branches.map((branch) => (
              <TableRow key={branch._id}>
                <TableCell>{branch.name}</TableCell>
                <TableCell>{branch.location}</TableCell>
                <TableCell>{branch.code}</TableCell>
                <TableCell>{branch.status ? "Active" : "Inactive"}</TableCell>
                <TableCell>
                  <Button onClick={() => navigate(`/branches/edit/${branch._id}`)}>Edit</Button>
                  <Button color="error" onClick={() => handleDelete(branch._id)}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
