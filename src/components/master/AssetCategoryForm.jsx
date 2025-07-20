import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Typography,
  CircularProgress,
  Box,
} from "@mui/material";
import { useSnackbar } from "notistack";
import api from "../../api/axios";

// ✅ Yup validation schema
const schema = yup.object().shape({
  name: yup.string().required("Name is required"),
  description: yup.string(),
  status: yup.boolean(),
});

export default function AssetCategoryForm() {
  const { id } = useParams(); // if editing
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
      description: "",
      status: true,
    },
  });

  // ✅ Fetch category data for edit
  useEffect(() => {
    if (id) {
      setLoading(true);
      api.get(`/asset-categories/${id}`)
        .then((res) => {
          const { name, description, status } = res.data;
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
        await api.put(`/asset-categories/${id}`, data);
        enqueueSnackbar("Category updated successfully!", { variant: "success" });
      } else {
        await api.post("/asset-categories", data);
        enqueueSnackbar("Category created successfully!", { variant: "success" });
      }
      navigate("/asset-categories");
    } catch (err) {
      enqueueSnackbar("Something went wrong!", { variant: "error" });
    }
  };

  return (
    <Box sx={{ maxWidth: 500, mx: "auto", mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        {id ? "Edit" : "Create"} Asset Category
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : (
        <form onSubmit={handleSubmit(onSubmit)}>
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
            control={<Switch {...register("status")} />}
            label="Active"
          />

          <Box sx={{ mt: 2 }}>
            <Button type="submit" variant="contained" color="primary">
              {id ? "Update" : "Create"}
            </Button>
            <Button
              sx={{ ml: 2 }}
              variant="outlined"
              onClick={() => navigate("/asset-categories")}
            >
              Cancel
            </Button>
          </Box>
        </form>
      )}
    </Box>
  );
}
