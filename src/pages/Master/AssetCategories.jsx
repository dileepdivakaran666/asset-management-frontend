import { useEffect, useState } from "react";
import api from "../../api/axios.js";
import {
  Button, Table, TableHead, TableRow, TableCell,
  TableBody, TableContainer, Paper, Box, Typography, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle
} from "@mui/material";
import * as XLSX from "xlsx";
import { useSnackbar } from "notistack";
import { Upload, Download } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

export default function AssetCategories() {
  const [categories, setCategories] = useState([]);
  const [deleteId, setDeleteId] = useState(null);
const [openConfirm, setOpenConfirm] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const fetchData = async () => {
    const res = await api.get("/asset-categories");
    setCategories(res.data);
  };

  const confirmDelete = (id) => {
  setDeleteId(id);
  setOpenConfirm(true);
};

  const handleDeleteConfirmed = async () => {
  try {
    await api.delete(`/asset-categories/${deleteId}`);
    enqueueSnackbar("Category deleted successfully!", { variant: "info" });
    fetchData();
  } catch (err) {
    enqueueSnackbar("Delete failed!", { variant: "error" });
  }
  setOpenConfirm(false);
  setDeleteId(null);
};

  useEffect(() => { fetchData(); }, []);

  // ✅ Excel Download
  const handleDownloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(categories.map(cat => ({
      Name: cat.name,
      Description: cat.description,
      Status: cat.status ? "Active" : "Inactive",
    })));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Asset Categories");
    XLSX.writeFile(workbook, "AssetCategories.xlsx");
  };

  // ✅ Excel Upload
const handleUploadExcel = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  // ✅ Validate file type
  const allowedTypes = [
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ];
  if (!allowedTypes.includes(file.type)) {
    enqueueSnackbar('Only Excel files (.xls, .xlsx) are allowed.', { variant: 'error' });
    return;
  }

  const reader = new FileReader();
  reader.onload = async (evt) => {
    try {
      const data = new Uint8Array(evt.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json(sheet);

      // ✅ Validate sheet structure
      if (!json.length) throw new Error('Excel sheet is empty');

      const requiredFields = ['Name', 'Description', 'Status'];

      for (let i = 0; i < json.length; i++) {
        const row = json[i];

        for (const field of requiredFields) {
          if (!row[field]) {
            throw new Error(`Missing "${field}" in row ${i + 2}`);
          }
        }

        if (!['Active', 'Inactive'].includes(row.Status)) {
          throw new Error(`Invalid status "${row.Status}" in row ${i + 2}. Use "Active" or "Inactive"`);
        }
      }

      // ✅ Mapping to API format
      const mapped = json.map((row) => ({
        name: row.Name.trim(),
        description: row.Description.trim(),
        status: row.Status === 'Active'
      }));

      // ✅ Post to API
      for (const entry of mapped) {
        await api.post('/asset-categories', entry);
      }

      fetchData();
      enqueueSnackbar('Excel uploaded successfully!', { variant: 'success' });

    } catch (err) {
      enqueueSnackbar('Upload failed: ' + err.message, { variant: 'error' });
    }
  };

  reader.readAsArrayBuffer(file);
};


  return (
    <>
      <Box display="flex" justifyContent="space-between" alignItems="center" mt={3} mb={2}>
        <Typography variant="h4">Asset Categories</Typography>
        <Box>
          <input
            accept=".xlsx, .xls"
            type="file"
            id="upload-excel"
            style={{ display: "none" }} 
            onChange={handleUploadExcel}
          />
          <Button  variant="outlined" startIcon={<Upload />} color="success" onClick={() => document.getElementById("upload-excel").click()}>
            Upload Excel
          </Button>
          <Button variant="contained" startIcon={<Download />} color="success" sx={{ ml: 2 }} onClick={handleDownloadExcel}>
            Download Excel
          </Button>
          <Button variant="contained" color="primary" sx={{ ml: 2 }} onClick={() => navigate("/asset-categories/create")}>
            + Add Category
          </Button>
        </Box>
      </Box>

      <TableContainer component={Paper} sx={{ border: '1px solid', borderColor: 'divider' }}>
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
                  <Button color="error" onClick={() => confirmDelete(cat._id)}>Delete</Button>
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
            Are you sure you want to delete this category? This action cannot be undone.
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
