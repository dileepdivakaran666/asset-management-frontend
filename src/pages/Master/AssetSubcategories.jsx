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
import { useNavigate } from "react-router-dom";

export default function AssetSubcategories() {
  const [subcategories, setSubcategories] = useState([]);
  const navigate = useNavigate();

  const fetchData = async () => {
    const res = await api.get("/asset-subcategories");
    setSubcategories(res.data);
  };

  const handleDelete = async (id) => {
    await api.delete(`/asset-subcategories/${id}`);
    fetchData();
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <h2>Asset Subcategories</h2>
      <Button variant="contained" onClick={() => navigate("/asset-subcategories/create")}>
        + Add Subcategory
      </Button>
      <TableContainer
        component={Paper}
        sx={{ mt: 3, border: "1px solid", borderColor: "divider" }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell style={{ fontWeight: "bold" }}>Category</TableCell>
              <TableCell style={{ fontWeight: "bold" }}>Name</TableCell>
              <TableCell style={{ fontWeight: "bold" }}>Description</TableCell>
              <TableCell style={{ fontWeight: "bold" }}>Status</TableCell>
              <TableCell style={{ fontWeight: "bold" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {subcategories.map((sub) => (
              <TableRow key={sub._id}>
                <TableCell>{sub.categoryId?.name || sub.category_id}</TableCell>
                <TableCell>{sub.name}</TableCell>
                <TableCell>{sub.description}</TableCell>
                <TableCell>{sub.status ? "Active" : "Inactive"}</TableCell>
                <TableCell>
                  <Button onClick={() => navigate(`/asset-subcategories/edit/${sub._id}`)}>Edit</Button>
                  <Button color="error" onClick={() => handleDelete(sub._id)}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
