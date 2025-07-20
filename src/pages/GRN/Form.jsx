import React, { useEffect, useState, useRef } from 'react';
import { useForm,FormProvider, useFieldArray} from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import api from '../../api/axios';
import { useNavigate } from 'react-router-dom';
import HeaderForm from '../../components/GRN/HeaderForm';
import LineItemTable from '../../components/GRN/LineItemTable';
import TotalsPanel from '../../components/GRN/TotalsPanel';
import { 
  Box, 
  Button, 
  Typography,
  Snackbar,
  Alert,
  CircularProgress
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
      })
    )
    .min(1, 'At least one line item is required'),
});

const GRNForm = () => {
  const navigate = useNavigate();
  const [vendors, setVendors] = useState([]);
  const [branches, setBranches] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const fileInputRef = useRef(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [snackbar, setSnackbar] = useState({ 
    open: false, 
    message: '', 
    severity: 'success' 
  });

  const methods = useForm({
  defaultValues: {
    grnDate: '',
    invoiceNumber: '',
    vendorId: '',
    branchId: '',
    lineItems: [],
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

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'lineItems',
  });

   const lineItems = watch('lineItems') || [];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [vendorsRes, branchesRes, subcategoriesRes] = await Promise.all([
          api.get('/vendors'),
          api.get('/branches'),
          api.get('/asset-subcategories')
        ]);
        setVendors(vendorsRes.data);
        setBranches(branchesRes.data);
        setSubcategories(subcategoriesRes.data);
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
  }, []);

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

  setIsProcessing(true);
  try {
    const data = await importExcelData(file);
    
    // Set header fields
    if (data.header) {
      if (data.header.grnNumber) setValue('grnNumber', data.header.grnNumber);
      if (data.header.grnDate) setValue('grnDate', data.header.grnDate);
      if (data.header.invoiceNumber) setValue('invoiceNumber', data.header.invoiceNumber);
      
      // Find vendor by name
      if (data.header.vendor) {
        const vendor = vendors.find(v => v.name === data.header.vendor);
        if (vendor) setValue('vendorId', vendor._id);
      }
      
      // Find branch by name
      if (data.header.branch) {
        const branch = branches.find(b => b.name === data.header.branch);
        if (branch) setValue('branchId', branch._id);
      }
    }

    // Set line items
    if (data.lineItems && data.lineItems.length > 0) {
      const mappedItems = data.lineItems.map(item => ({
        subcategoryId: subcategories.find(s => s.name === item.subcategory)?._id || '',
        itemDescription: item.description || '',
        quantity: item.quantity || 0,
        unitPrice: item.price || 0,
        tax: item.tax || 0,
        taxableValue: (item.quantity || 0) * (item.price || 0),
        totalAmount: ((item.quantity || 0) * (item.price || 0)) * (1 + (item.tax || 0)/100)
      }));
      setValue('lineItems', mappedItems);
    }

    setSnackbar({ 
      open: true, 
      message: 'GRN data imported successfully!', 
      severity: 'success' 
    });
  } catch (error) {
    setSnackbar({ 
      open: true, 
      message: 'Import failed: ' + error.message, 
      severity: 'error' 
    });
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
          status: data.status
        },
        lineItems: data.lineItems,
      };

      const url = data.status === 'draft' ? '/grns?status=draft' : '/grns';
      await api.post(url, payload);
      setSnackbar({
        open: true,
        message: `GRN ${data.status === 'draft' ? 'saved as draft' : 'submitted successfully'}!`,
        severity: 'success'
      });
      setTimeout(() => {
        navigate('/');
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
      <Typography variant="h5" gutterBottom>Create GRN</Typography>
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
                variant="outlined"
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
          vendors={vendors} 
          branches={branches} 
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
        <Box mt={4} display="flex" justifyContent="space-between">
          <Button variant="outlined" onClick={() =>{setValue('status', 'draft')
             handleSubmit(onSubmit)()}}>
            Save as Draft
          </Button>
          <Button variant="contained"  onClick={() => {
            setValue('status', 'submitted'); 
            handleSubmit(onSubmit)();
          }}>
            Submit
          </Button>
          <Button variant="text" onClick={() => reset()}>
            Reset
          </Button>
          <Button variant="text" onClick={() => navigate('/')}>
            cancel
          </Button>
        </Box>
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

    </Box>
  );
};

export default GRNForm;