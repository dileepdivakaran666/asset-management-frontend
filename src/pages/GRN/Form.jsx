import React, { useEffect, useState, useRef, useMemo } from 'react';
import { useForm,FormProvider, useFieldArray, useWatch} from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import api from '../../api/axios';
import { useNavigate, useParams } from 'react-router-dom';
import HeaderForm from '../../components/GRN/HeaderForm';
import LineItemTable from '../../components/GRN/LineItemTable';
import TotalsPanel from '../../components/GRN/TotalsPanel';
import {useMasterData} from '../../contexts/MasterDataContext';

import { 
  Box, 
  Button, 
  Typography,
  Snackbar,
  Alert,
  CircularProgress,
  Dialog, DialogTitle, DialogContent, DialogActions 
} from '@mui/material';
import { downloadExcelTemplate, exportGRNToExcel, importExcelData } from '../../utils/excelService';
import { Download, Upload } from '@mui/icons-material';


const grnSchema = yup.object().shape({
  grnDate: yup.string().required('GRN Date is required'),
  invoiceNumber: yup.string().required('Invoice Number is required'),
  vendorId: yup.string().required('Vendor is required'),
  branchId: yup.string().required('Branch is required'),
  lineItems: yup
    .array()
    .of(
      yup.object().shape({
        subcategoryId: yup.string().required('Subcategory is required'),
        itemDescription: yup.string().required('Item Description is required'),
        quantity: yup
          .number()
          .typeError('Quantity must be a number')
          .positive('Quantity must be greater than 0')
          .required('Quantity is required'),
        unitPrice: yup
          .number()
          .typeError('Unit Price must be a number')
          .positive('Unit Price must be greater than 0')
          .required('Unit Price is required'),
        taxPercent: yup
          .number()
          .typeError('Tax must be a number')
          .min(0, 'Tax cannot be negative')
          .max(100, 'Tax cannot exceed 100%')
          .required('Tax is required'), 
      })
    )
    .min(1, 'At least one line item is required'),
});

const GRNForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [subcategories, setSubcategories] = useState([]);
  const fileInputRef = useRef(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { vendors, branches } = useMasterData();
  const [snackbar, setSnackbar] = useState({ 
    open: false, 
    message: '', 
    severity: 'success' 
  });
  const [confirmCancelOpen, setConfirmCancelOpen] = useState(false);
  const today = new Date().toISOString().split('T')[0]; // Format YYYY-MM-DD

  const methods = useForm({
  defaultValues: {
    grnDate: today,
    invoiceNumber: '',
    vendorId: '',
    branchId: '',
    lineItems: [],
    grandTotal: 0
  },
  resolver: yupResolver(grnSchema),
});

const {
  register,
  control,
  handleSubmit,
  reset,
  setValue,
  watch,
  formState: { errors },
} = methods;

const { isDirty } = methods.formState;

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'lineItems',
  });

  const rawLineItems = useWatch({ control, name: 'lineItems' });
  const lineItems = useMemo(() => rawLineItems || [], [rawLineItems]);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const subcategoriesRes = await api.get('/asset-subcategories');
        setSubcategories(subcategoriesRes.data);

        if (id) {
        const response = await api.get(`/grns/${id}`);
        const grn = response.data;

        reset({
          grnNumber: grn.grnNumber,
          grnDate: grn.grnDate?.split('T')[0], // Ensure date is in YYYY-MM-DD format
          invoiceNumber: grn.invoiceNumber,
          vendorId: grn.vendorId?._id || '',
          branchId: grn.branchId?._id || '',
          status: grn.status || '',
          lineItems: (grn.lineItems || []).map(item => ({
            subcategoryId: item.subcategoryId?._id || '',
            itemDescription: item.itemDescription,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            tax: item.tax || 0,
            taxableValue: item.taxableValue || 0,
            totalAmount: item.totalAmount || 0
          }))
        });
      }
      } catch (err) {
        console.error('Error fetching data:', err);
        setSnackbar({
          open: true,
          message: 'Failed to load required data',
          severity: 'error'
        });
      }
    };
    fetchData();
  }, [id, reset]);

  useEffect(() => {
  const subtotal = lineItems.reduce((sum, item) => {
    const qty = parseFloat(item.quantity || 0);
    const price = parseFloat(item.unitPrice || 0);
    return sum + qty * price;
  }, 0);

  const totalTax = lineItems.reduce((sum, item) => {
    const qty = parseFloat(item.quantity || 0);
    const price = parseFloat(item.unitPrice || 0);
    const tax = parseFloat(item.taxPercent || 0);
    return sum + (qty * price * tax) / 100;
  }, 0);

  const grandTotal = subtotal + totalTax;
  setValue('grandTotal', grandTotal);
}, [lineItems, setValue]);


   // Excel Export Handler
  const handleExport = async () => {
    setIsProcessing(true);
    try {
      const formData = watch();
      const grnData = {
        grnNumber: formData.grnNumber || 'DRAFT',
        grnDate: formData.grnDate,
        invoiceNumber: formData.invoiceNumber,
        vendorName: vendors.find(v => v._id === formData.vendorId)?.name || 'N/A',
        branchName: branches.find(b => b._id === formData.branchId)?.name || 'N/A',
        lineItems: lineItems.map(item => ({
          ...item,
          subcategoryName: subcategories.find(s => s._id === item.subcategoryId)?.name || 'N/A'
        })),
        subtotal: lineItems.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0),
        totalTax: lineItems.reduce((sum, item) => sum + (item.quantity * item.unitPrice * (item.tax || 0)/100), 0),
        grandTotal: lineItems.reduce((sum, item) => sum + (item.totalAmount || 0), 0)
      };
      await exportGRNToExcel(grnData);
      setSnackbar({ 
        open: true, 
        message: 'Excel exported successfully!', 
        severity: 'success' 
      });
    } catch (error) {
      setSnackbar({ 
        open: true, 
        message: 'Export failed: ' + error.message, 
        severity: 'error' 
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Excel Import Handler
const handleImport = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  // ✅ Step 1: File type validation
  const allowedTypes = [
    'application/vnd.ms-excel',                   // .xls
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' // .xlsx
  ];
  if (!allowedTypes.includes(file.type)) {
    setSnackbar({
      open: true,
      message: 'Only Excel files (.xls, .xlsx) are allowed.',
      severity: 'error'
    });
    return;
  }

  setIsProcessing(true);
  try {
    const data = await importExcelData(file);

    // ✅ Step 2: Validate required header fields
    if (!data.header || !data.lineItems) {
      throw new Error('Missing header or line items section in Excel.');
    }

    const requiredHeaderFields = ['grnNumber', 'grnDate', 'invoiceNumber', 'vendor', 'branch'];
    for (const field of requiredHeaderFields) {
      if (!data.header[field]) {
        throw new Error(`Missing required field in header: ${field}`);
      }
    }

    // ✅ Step 3: Validate each line item
    for (const [index, item] of data.lineItems.entries()) {
      if (!item.subcategory || !item.description || item.quantity == null || item.price == null || item.tax == null) {
        throw new Error(`Missing required data in line item ${index + 1}`);
      }

      if (isNaN(item.quantity) || isNaN(item.price) || isNaN(item.tax)) {
        throw new Error(`Invalid numeric values in line item ${index + 1}`);
      }
    }

    // ✅ Step 4: Set header values
    if (data.header.grnNumber) setValue('grnNumber', data.header.grnNumber);
    if (data.header.grnDate) setValue('grnDate', data.header.grnDate);
    if (data.header.invoiceNumber) setValue('invoiceNumber', data.header.invoiceNumber);
    
    const vendor = vendors.find(v => v.name === data.header.vendor);
    if (vendor) setValue('vendorId', vendor._id);

    const branch = branches.find(b => b.name === data.header.branch);
    if (branch) setValue('branchId', branch._id);

    // ✅ Step 5: Set line items
    const mappedItems = data.lineItems.map(item => ({
      subcategoryId: subcategories.find(s => s.name === item.subcategory)?._id || '',
      itemDescription: item.description || '',
      quantity: +item.quantity,
      unitPrice: +item.price,
      tax: +item.tax,
      taxableValue: +(item.quantity * item.price).toFixed(2),
      totalAmount: +((item.quantity * item.price) * (1 + item.tax / 100)).toFixed(2)
    }));
    setValue('lineItems', mappedItems);

    setSnackbar({ open: true, message: 'GRN data imported successfully!', severity: 'success' });

  } catch (error) {
    setSnackbar({ open: true, message: 'Import failed: ' + error.message, severity: 'error' });
  } finally {
    setIsProcessing(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }
};


  const onSubmit = async (data) => {
    setIsProcessing(true);
    try {
      const payload = {
        grnData: {
          grnNumber: data.grnNumber,  
          grnDate: data.grnDate,
          invoiceNumber: data.invoiceNumber,
          vendorId: data.vendorId,
          branchId: data.branchId,
          status: data.status,
          grandTotal: parseFloat(data.grandTotal || 0)
        },
        lineItems: data.lineItems,
      };

      const url = id 
      ? `/grns/${id}` 
      : data.status === 'draft' 
        ? '/grns?status=draft' 
        : '/grns';

    const method = id ? 'put' : 'post';

    await api[method](url, payload);

    setSnackbar({
      open: true,
      message: `GRN ${id ? 'updated' : data.status === 'draft' ? 'saved as draft' : 'submitted'} successfully!`,
      severity: 'success'
    });
      setTimeout(() => {
        navigate('/grn/list');
      }, 2000);
      
    } catch (err) {
      setSnackbar({
        open: true,
        message: 'Error: ' + (err.response?.data?.message || err.message),
        severity: 'error'
      });
    } finally {
      setIsProcessing(false);
    }
    }
  

  return (
    <Box p={3}>
      <Typography
        variant="h3"
        gutterBottom
        sx={{
          fontWeight: 800,
          background: (theme) => theme.palette.mode === 'dark' 
            ? 'linear-gradient(90deg, #4facfe 0%, #00f2fe 100%)' 
            : 'linear-gradient(90deg, #1a237e 0%, #3949ab 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textTransform: 'none',
          letterSpacing: '0.02em',
        }}
      >
  {id ? 'Edit GRN' : 'Create GRN'}
</Typography>
      <FormProvider {...methods}>
      <form noValidate>
        <input type="hidden" {...register('status')} />

        {/* Excel Action Buttons */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            mb: 3,
            gap: 2,
            flexWrap: 'wrap'
          }}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="outlined"
                startIcon={<Download />}
                onClick={downloadExcelTemplate}
                disabled={isProcessing}
              >
                Download Template
              </Button>
              
              <Button
                variant="contained"
                color='success'
                component="label"
                startIcon={<Upload />}
                disabled={isProcessing}
              >
                Upload Excel
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImport}
                  accept=".xlsx,.xls"
                  hidden
                />
              </Button>
            </Box>

            <Button
              variant="contained"
              color='success'
              startIcon={isProcessing ? <CircularProgress size={20} /> : <Download />}
              onClick={handleExport}
              disabled={isProcessing || lineItems.length === 0}
            >
              Export to Excel
            </Button>
          </Box>

        <HeaderForm 
          register={register} 
          control={control} 
          errors={errors} 
          setValue={setValue}
        />
        <LineItemTable
          control={control}
          fields={fields}
          append={append}
          remove={remove}
          register={register}
          errors={errors}
          subcategories={subcategories}
        />
        <TotalsPanel control={control} />
        <>
          {id ? (
            <Box mt={4} display="flex" justifyContent="center">
              <Button variant="contained" onClick={() => handleSubmit(onSubmit)()}>
                Update
              </Button>
            </Box>
          ) : (
            <Box mt={4} sx={{ display: 'flex', justifyContent: 'center', flexDirection:{xs:'column', sm:'row'}, gap: 2 }}>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => {
                  setValue('status', 'draft');
                  handleSubmit(onSubmit)();
                }}
              >
                Save as Draft
              </Button>
              <Button
                variant="contained"
                onClick={() => {
                  setValue('status', 'submitted');
                  handleSubmit(onSubmit)();
                }}
              >
                Submit
              </Button>
              <Button variant="contained" color="warning" onClick={() => reset()}>
                Reset
              </Button>
              <Button variant="contained" color="error" onClick={() => {
                if (isDirty) {
                  setConfirmCancelOpen(true);
                } else {
                  navigate('/grn/list'); // or wherever Cancel should go
                }
              }}>
                Cancel
              </Button>
            </Box>
          )}
        </>
   
      </form>
      </FormProvider>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({...snackbar, open: false})}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
      <Dialog open={confirmCancelOpen} onClose={() => setConfirmCancelOpen(false)}>
  <DialogTitle>Discard changes?</DialogTitle>
  <DialogContent>
    You have unsaved changes. Are you sure you want to cancel?
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setConfirmCancelOpen(false)} color="primary">
      Stay
    </Button>
    <Button
      onClick={() => {
        setConfirmCancelOpen(false);
        navigate('/grn/list');
      }}
      color="error"
    >
      Leave Anyway
    </Button>
  </DialogActions>
</Dialog>


    </Box>
  );
};

export default GRNForm;