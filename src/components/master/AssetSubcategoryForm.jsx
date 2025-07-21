import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Typography,
  CircularProgress,
  Box,
} from "@mui/material";
import { useSnackbar } from "notistack";
import api from "../../api/axios";

// Validation Schema
const schema = yup.object().shape({
  categoryId: yup.string().required("Category is required"),
  name: yup.string().required("Name is required"),
  description: yup.string(),
  status: yup.boolean(),
});

export default function AssetSubcategoryForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      categoryId: "",
      name: "",
      description: "",
      status: true,
    },
  });

  const status = watch("status");

  useEffect(() => {
    // Load categories
    api.get("/asset-categories").then((res) => {
      setCategories(res.data);
    });

    // If editing, load subcategory
    if (id) {
      setLoading(true);
      api.get(`/asset-subcategories/${id}`)
        .then((res) => {
          const { categoryId, name, description, status } = res.data;
          setValue("categoryId", categoryId._id);
          setValue("name", name);
          setValue("description", description);
          setValue("status", status);
        })
        .catch(() => {
          enqueueSnackbar("Failed to load data", { variant: "error" });
        })
        .finally(() => setLoading(false));
    }
  }, [id, setValue, enqueueSnackbar]);

  const onSubmit = async (data) => {
    try {
      if (id) {
        await api.put(`/asset-subcategories/${id}`, data);
        enqueueSnackbar("Subcategory updated successfully!", { variant: "success" });
      } else {
        await api.post("/asset-subcategories", data);
        enqueueSnackbar("Subcategory created successfully!", { variant: "success" });
      }
      navigate("/asset-subcategories");
    } catch (err) {
      enqueueSnackbar("Something went wrong!", { variant: "error" });
    }
  };

  return (
    <Box sx={{ maxWidth: 500, mx: "auto", mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        {id ? "Edit" : "Create"} Asset Subcategory
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : (
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl fullWidth margin="normal">
            <InputLabel>Category</InputLabel>
            <Select
              {...register("categoryId")}
              value={watch("categoryId")}
              onChange={(e) => setValue("categoryId", e.target.value)}
              error={!!errors.categoryId}
            >
              {categories.map((cat) => (
                <MenuItem key={cat._id} value={cat._id}>
                  {cat.name}
                </MenuItem>
              ))}
            </Select>
            <Typography variant="caption" color="error">
              {errors.categoryId?.message}
            </Typography>
          </FormControl>

          <TextField
            label="Name"
            fullWidth
            margin="normal"
            {...register("name")}
            error={!!errors.name}
            helperText={errors.name?.message}
          />

          <TextField
            label="Description"
            fullWidth
            margin="normal"
            {...register("description")}
          />

          <FormControlLabel
            control={<Switch checked={status}
      onChange={(e) => setValue("status", e.target.checked)} />}
            label="Active"
          />

          <Box sx={{ mt: 2 }}>
            <Button type="submit" variant="contained" color="primary">
              {id ? "Update" : "Create"}
            </Button>
            <Button
              sx={{ ml: 2 }}
              variant="outlined"
              onClick={() => navigate("/asset-subcategories")}
            >
              Cancel
            </Button>
          </Box>
        </form>
      )}
    </Box>
  );
}
