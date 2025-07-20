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
import {useSnackbar} from 'notistack'
import { useNavigate } from "react-router-dom";

export default function Vendors() {
  const [vendors, setVendors] = useState([]);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const fetchData = async () => {
    const res = await api.get("/vendors");
    setVendors(res.data);
  };

  const handleDelete = async (id) => {
    try{
    await api.delete(`/vendors/${id}`);
    enqueueSnackbar('Vendor Deleted Succesfully', {variant: "success"})
    fetchData();
    }
    catch(err){

    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <h2>Vendors</h2>
      <Button variant="contained" onClick={() => navigate("/vendors/create")}>
        + Add Vendor
      </Button>
      <TableContainer component={Paper} sx={{ mt: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><b>Name</b></TableCell>
              <TableCell><b>Contact</b></TableCell>
              <TableCell><b>Email</b></TableCell>
              <TableCell><b>Phone</b></TableCell>
              <TableCell><b>Actions</b></TableCell>
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
                  <Button color="error" onClick={() => handleDelete(vendor._id)}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
