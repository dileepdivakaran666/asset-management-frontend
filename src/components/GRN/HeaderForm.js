import { useEffect } from 'react';
import { Autocomplete, Grid, TextField, MenuItem } from '@mui/material';
import { Controller } from 'react-hook-form';
import { useFormContext } from 'react-hook-form';

const HeaderForm = ({ register, control, errors, vendors, branches, setValue }) => {
  const { watch } = useFormContext();
  useEffect(() => {
    const generateGRNNumber = () => {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const randomSerial = String(Math.floor(100 + Math.random() * 900));
      return `GRN-${year}${month}-${randomSerial}`;
    };

    const grnNumber = generateGRNNumber();
    setValue('grnNumber', grnNumber);
  }, [setValue]);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6}>
        <TextField
          label="GRN Number"
          fullWidth
          InputProps={{ readOnly: true }}
          {...register('grnNumber')}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          label="GRN Date"
          type="date"
          fullWidth
          {...register('grnDate', { required: 'GRN Date is required' })}
          InputLabelProps={{ shrink: true }}
          error={Boolean(errors.grnDate)}
          helperText={errors.grnDate?.message}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          label="Invoice Number"
          fullWidth
          {...register('invoiceNumber', { required: 'Invoice Number is required' })}
          error={Boolean(errors.invoiceNumber)}
          helperText={errors.invoiceNumber?.message}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <Controller
          name="vendorId"
          control={control}
          rules={{ required: 'Vendor is required' }}
          render={({ field: { onChange, value, ...field } }) => (
            <Autocomplete
              options={vendors}
              getOptionLabel={(option) => option.name}
              isOptionEqualToValue={(option, value) => option._id === value?._id}
              onChange={(_, data) => onChange(data?._id || '')}
              value={vendors.find(v => v._id === value) || null}
              renderInput={(params) => (
                <TextField
                sx={{ minWidth: 200 }}
                  {...params}
                  {...field}
                  label="Vendor"
                  fullWidth
                  error={Boolean(errors.vendorId)}
                  helperText={errors.vendorId?.message}
                />
              )}
              filterOptions={(options, { inputValue }) =>
                options.filter(option =>
                  option.name.toLowerCase().includes(inputValue.toLowerCase())
                )
              }
              noOptionsText="No vendors found"
              componentsProps={{
                paper: {
                  sx: {
                    minHeight: 200,
                    maxHeight: 400
                  }
                }
              }}
              renderOption={(props, option) => (
                <MenuItem {...props} key={option._id}>
                  {option.name}
                </MenuItem>
              )}
            />
          )}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <TextField
        sx={{ minWidth: 200 }}
          label="Branch"
          select
          fullWidth
          defaultValue="" 
          {...register('branchId', { required: 'Branch is required' })}
          value={watch('branchId') || ''}
          error={Boolean(errors.branchId)}
          helperText={errors.branchId?.message}
        >
          {branches.map(b => (
            <MenuItem key={b._id} value={b._id}>{b.name}</MenuItem>
          ))}
        </TextField>
      </Grid>

    </Grid>
  );
};

export default HeaderForm;