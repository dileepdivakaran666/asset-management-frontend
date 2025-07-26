import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Typography,
  CircularProgress,
  Box,
} from '@mui/material';
import { useSnackbar } from 'notistack';
import api from '../../api/axios';

const schema = yup.object().shape({
  name: yup.string().required('Branch name is required'),
  location: yup.string(),
  code: yup.string().required('Branch code is required'),
  status: yup.boolean(),
});

export default function BranchForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      location: '',
      code: '',
      status: true,
    },
  });

  useEffect(() => {
    if (id) {
      setLoading(true);
      api
        .get(`/branches/${id}`)
        .then((res) => {
          const { name, location, code, status } = res.data;
          setValue('name', name);
          setValue('location', location);
          setValue('code', code);
          setValue('status', status);
        })
        .catch(() => {
          enqueueSnackbar('Failed to load branch', { variant: 'error' });
        })
        .finally(() => setLoading(false));
    }
  }, [id, setValue, enqueueSnackbar]);

  const onSubmit = async (data) => {
    try {
      if (id) {
        await api.put(`/branches/${id}`, data);
        enqueueSnackbar('Branch updated successfully!', { variant: 'success' });
      } else {
        await api.post('/branches', data);
        enqueueSnackbar('Branch created successfully!', { variant: 'success' });
      }
      navigate('/branches');
    } catch (err) {
      enqueueSnackbar('Something went wrong!', { variant: 'error' });
    }
  };

  return (
    <Box sx={{ maxWidth: 500, mx: 'auto', mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        {id ? 'Edit' : 'Create'} Branch
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : (
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            label="Branch Name"
            fullWidth
            margin="normal"
            {...register('name')}
            error={!!errors.name}
            helperText={errors.name?.message}
          />
          <TextField label="Location" fullWidth margin="normal" {...register('location')} />
          <TextField
            label="Branch Code"
            fullWidth
            margin="normal"
            {...register('code')}
            error={!!errors.code}
            helperText={errors.code?.message}
          />
          <FormControlLabel
            control={
              <Controller
                name="status"
                control={control}
                defaultValue={true}
                render={({ field }) => (
                  <Switch
                    {...field}
                    checked={field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                  />
                )}
              />
            }
            label="Active"
          />

          <Box sx={{ mt: 2 }}>
            <Button type="submit" variant="contained" color="primary">
              {id ? 'Update' : 'Create'}
            </Button>
            <Button sx={{ ml: 2 }} variant="outlined" onClick={() => navigate('/branches')}>
              Cancel
            </Button>
          </Box>
        </form>
      )}
    </Box>
  );
}
