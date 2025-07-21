import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  TextField,
  Button,
  Typography,
  CircularProgress,
  Box,
} from "@mui/material";
import { useSnackbar } from "notistack";
import api from "../../api/axios";

const schema = yup.object().shape({
  name: yup.string().required("Name is required"),
  description: yup.string(),
});

export default function ManufacturerForm() {
  const { id } = useParams();
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
    },
  });

  useEffect(() => {
    if (id) {
      setLoading(true);
      api
        .get(`/manufacturers/${id}`)
        .then((res) => {
          setValue("name", res.data.name);
          setValue("description", res.data.description);
        })
        .catch(() => {
          enqueueSnackbar("Failed to load manufacturer", { variant: "error" });
        })
        .finally(() => setLoading(false));
    }
  }, [id, setValue, enqueueSnackbar]);

  const onSubmit = async (data) => {
    try {
      if (id) {
        await api.put(`/manufacturers/${id}`, data);
        enqueueSnackbar("Manufacturer updated successfully!", { variant: "success" });
      } else {
        await api.post("/manufacturers", data);
        enqueueSnackbar("Manufacturer created successfully!", { variant: "success" });
      }
      navigate("/manufacturers");
    } catch (err) {
      enqueueSnackbar("Something went wrong!", { variant: "error" });
    }
  };

  return (
    <Box sx={{ maxWidth: 500, mx: "auto", mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        {id ? "Edit" : "Create"} Manufacturer
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

          <Box sx={{ mt: 2 }}>
            <Button type="submit" variant="contained" color="primary">
              {id ? "Update" : "Create"}
            </Button>
            <Button
              sx={{ ml: 2 }}
              variant="outlined"
              onClick={() => navigate("/manufacturers")}
            >
              Cancel
            </Button>
          </Box>
        </form>
      )}
    </Box>
  );
}
