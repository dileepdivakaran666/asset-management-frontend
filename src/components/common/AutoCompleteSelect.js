import React from 'react';
import { Controller } from 'react-hook-form';
import { Autocomplete, TextField, CircularProgress, MenuItem } from '@mui/material';

const AutoCompleteSelect = ({
  name,
  label,
  control,
  options,
  getOptionLabel,
  isOptionEqualToValue,
  rules = {},
  error,
  helperText,
  loading = false,
}) => {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field: { onChange, value } }) => (
        <Autocomplete
          options={options}
          loading={loading}
          getOptionLabel={getOptionLabel}
          isOptionEqualToValue={isOptionEqualToValue}
          onChange={(_, data) => onChange(data?._id || '')}
          value={options.find(opt => opt._id === value) || null}
          renderInput={(params) => (
            <TextField
            sx={{ minWidth: { xs: '100%', sm: 200 }, }}
              {...params}
              label={label}
              fullWidth
              error={!!error}
              helperText={helperText}
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {loading && <CircularProgress size={20} />}
                    {params.InputProps.endAdornment}
                  </>
                ),
              }}
            />
          )}
          renderOption={(props, option) => (
            <MenuItem {...props} key={option._id}>
              {option.name}
            </MenuItem>
          )}
        />
      )}
    />
  );
};

export default AutoCompleteSelect;
