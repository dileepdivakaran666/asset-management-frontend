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

export default function Manufacturers() {
  const [manufacturers, setManufacturers] = useState([]);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();  

  const fetchData = async () => {
    const res = await api.get("/manufacturers");
    setManufacturers(res.data);
  };

  const handleDelete = async (id) => {
    try{
        await api.delete(`/manufacturers/${id}`);
        enqueueSnackbar("Manufacturer Deleted successfully!", { variant: "success" });
        fetchData();
    } catch (error) {
      enqueueSnackbar("Failed to delete manufacturer", { variant: "error" });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <h2>Manufacturers</h2>
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
                  <Button color="error" onClick={() => handleDelete(mfr._id)}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
