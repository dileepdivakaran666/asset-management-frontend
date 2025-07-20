import { useEffect, useState } from "react";
import api from "../../api/axios.js";
import { Button, Table, TableHead, TableRow, TableCell, TableBody, TableContainer,
  Paper, } from "@mui/material";
import AssetCategoryForm from "../../components/master/AssetCategoryForm.jsx";
import { useNavigate } from "react-router-dom";

export default function AssetCategories() {
  const [categories, setCategories] = useState([]);
  const [editData, setEditData] = useState(null);

  const navigate = useNavigate();
  

  const fetchData = async () => {
    const res = await api.get("/asset-categories");
    setCategories(res.data);
  };

  const handleSubmit = async (data) => {
    if (editData) {
      await api.put(`/asset-categories/${editData.id}`, data);
    } else {
      await api.post("/asset-categories", data);
    }
    setEditData(null);
    fetchData();
  };

  const handleDelete = async (id) => {
    await api.delete(`/asset-categories/${id}`);
    fetchData();
  };

  useEffect(() => { fetchData(); }, []);

  return (
    <>
      <h2>Asset Categories</h2>
      <AssetCategoryForm onSubmit={handleSubmit} defaultValues={editData} />
      <TableContainer component={Paper} sx={{ mt: 3, border: '1px solid', borderColor: 'divider' }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell style={{ fontWeight: 'bold' }}>Name</TableCell>
            <TableCell style={{ fontWeight: 'bold' }}>Description</TableCell>
            <TableCell style={{ fontWeight: 'bold' }}>Status</TableCell>
            <TableCell style={{ fontWeight: 'bold' }}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {categories.map((cat) => (
            <TableRow key={cat.id}>
              <TableCell>{cat.name}</TableCell>
              <TableCell>{cat.description}</TableCell>
              <TableCell>{cat.status ? "Active" : "Inactive"}</TableCell>
              <TableCell>
                <Button onClick={() => navigate(`/asset-categories/edit/${cat._id}`)}>Edit</Button>
                <Button color="error" onClick={() => handleDelete(cat._id)}>Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      </TableContainer>
    </>
  );
}
