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
  name: yup.string().required("Vendor name is required"),
  contactPerson: yup.string(),
  email: yup.string().email("Invalid email"),
  phone: yup.string(),
  address: yup.string(),
  gstNumber: yup.string(),
});

export default function VendorForm() {
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
      contactPerson: "",
      email: "",
      phone: "",
      address: "",
      gstNumber: "",
    },
  });

  useEffect(() => {
    if (id) {
      setLoading(true);
      api.get(`/vendors/${id}`)
        .then((res) => {
          const data = res.data;
          for (let key in data) {
            if (key in data) setValue(key, data[key]);
          }
        })
        .catch(() => {
          enqueueSnackbar("Failed to load vendor", { variant: "error" });
        })
        .finally(() => setLoading(false));
    }
  }, [id, setValue, enqueueSnackbar]);

  const onSubmit = async (data) => {
    try {
      if (id) {
        await api.put(`/vendors/${id}`, data);
        enqueueSnackbar("Vendor updated successfully!", { variant: "success" });
      } else {
        await api.post("/vendors", data);
        enqueueSnackbar("Vendor created successfully!", { variant: "success" });
      }
      navigate("/vendors");
    } catch (err) {
      enqueueSnackbar("Something went wrong!", { variant: "error" });
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        {id ? "Edit" : "Create"} Vendor
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : (
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField label="Name" fullWidth margin="normal" {...register("name")} error={!!errors.name} helperText={errors.name?.message} />
          <TextField label="Contact Person" fullWidth margin="normal" {...register("contactPerson")} />
          <TextField label="Email" fullWidth margin="normal" {...register("email")} error={!!errors.email} helperText={errors.email?.message} />
          <TextField label="Phone" fullWidth margin="normal" {...register("phone")} />
          <TextField label="Address" fullWidth margin="normal" {...register("address")} />
          <TextField label="GST Number" fullWidth margin="normal" {...register("gstNumber")} />
          <Box sx={{ mt: 2 }}>
            <Button type="submit" variant="contained" color="primary">{id ? "Update" : "Create"}</Button>
            <Button sx={{ ml: 2 }} variant="outlined" onClick={() => navigate("/vendors")}>Cancel</Button>
          </Box>
        </form>
      )}
    </Box>
  );
}
