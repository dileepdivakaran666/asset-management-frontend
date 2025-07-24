import { useEffect } from 'react';
import {
  Grid,
  TextField,
} from '@mui/material';
// import { useFormContext } from 'react-hook-form';
import { useMasterData } from '../../contexts/MasterDataContext';
import AutoCompleteSelect from '../common/AutoCompleteSelect';

const HeaderForm = ({ register, control, errors, setValue }) => {
  const { branches, vendors, loading } = useMasterData();
  // const { watch } = useFormContext();

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
      {/* GRN Number */}
      <Grid item xs={12} sm={6}>
        <TextField
          label="GRN Number"
          fullWidth
          InputProps={{ readOnly: true }}
          {...register('grnNumber')}
        />
      </Grid>

      {/* GRN Date */}
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

      {/* Invoice Number */}
      <Grid item xs={12} sm={6}>
        <TextField
          label="Invoice Number"
          fullWidth
          {...register('invoiceNumber', { required: 'Invoice Number is required' })}
          error={Boolean(errors.invoiceNumber)}
          helperText={errors.invoiceNumber?.message}
        />
      </Grid>

      {/* Vendor (AutoCompleteSelect) */}
      <Grid item xs={12} sm={6}>
        <AutoCompleteSelect
          name="vendorId"
          label="Vendor"
          control={control}
          options={vendors}
          loading={loading}
          getOptionLabel={(option) => option.name}
          isOptionEqualToValue={(option, value) => option._id === value?._id}
          rules={{ required: 'Vendor is required' }}
          error={errors.vendorId}
          helperText={errors.vendorId?.message}
        />
      </Grid>

      {/* Branch (Dropdown) */}
      <Grid item xs={12} sm={6}>
        <AutoCompleteSelect
          name="branchId"
          label="Branch"
          control={control}
          options={branches}
          loading={loading}
          getOptionLabel={(option) => option.name}
          isOptionEqualToValue={(option, value) => option._id === value?._id}
          rules={{ required: 'Branch is required' }}
          error={errors.branchId}
          helperText={errors.branchId?.message}
        />
        {/* <TextField
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
            <MenuItem key={b._id} value={b._id}>
              {b.name}
            </MenuItem>
          ))}
        </TextField> */}
      </Grid>
    </Grid>
  );
};

export default HeaderForm;
