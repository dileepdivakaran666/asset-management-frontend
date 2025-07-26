import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

// Download Excel Template
export const downloadExcelTemplate = () => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('GRN Data');

  // Header Section
  worksheet.addRow(['GRN HEADER INFORMATION']);
  worksheet.addRow(['GRN Number', 'GRN Date', 'Invoice Number', 'Vendor', 'Branch']);
  worksheet.addRow(['', new Date().toISOString().split('T')[0], '', '', '']);

  /// Line Items Section
  worksheet.addRow([]); // Empty row
  worksheet.addRow(['LINE ITEMS']);
  worksheet.addRow(['Subcategory', 'Item Description', 'Quantity', 'Unit Price', 'Tax %']);

  // Set data validation for numeric fields
  const quantityCol = worksheet.getColumn(3);

  quantityCol.eachCell((cell) => {
    cell.dataValidation = {
      type: 'decimal',
      operator: 'greaterThan',
      formulae: [0],
    };
  });

  // Generate and download
  workbook.xlsx.writeBuffer().then((buffer) => {
    saveAs(new Blob([buffer]), 'GRN_Template.xlsx');
  });
};

// Export GRN Data to Excel
export const exportGRNToExcel = (grnData) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('GRN');

  // Add Header
  worksheet.addRow(['GRN Report']).font = { bold: true, size: 16 };
  worksheet.mergeCells('A1:H1');

  // Add Metadata
  worksheet.addRow(['GRN Number:', grnData.grnNumber]);
  worksheet.addRow(['Date:', grnData.grnDate]);
  worksheet.addRow(['Vendor:', grnData.vendorName]);

  // Add Line Items Header
  worksheet.addRow([
    '#',
    'Subcategory',
    'Item Description',
    'Qty',
    'Unit Price',
    'Tax %',
    'Taxable Value',
    'Total Amount',
  ]).font = { bold: true };

  // Add Line Items
  grnData.lineItems.forEach((item, index) => {
    worksheet.addRow([
      index + 1,
      item.subcategoryName,
      item.itemDescription,
      item.quantity,
      item.unitPrice,
      item.tax,
      item.taxableValue,
      item.totalAmount,
    ]);
  });

  // Add Summary
  worksheet.addRow(['', '', '', '', '', 'Subtotal:', grnData.subtotal]).font = { bold: true };
  worksheet.addRow(['', '', '', '', '', 'Total Tax:', grnData.totalTax]).font = { bold: true };
  worksheet.addRow(['', '', '', '', '', 'Grand Total:', grnData.grandTotal]).font = {
    bold: true,
    color: { argb: 'FF0000' },
  };

  // Style columns
  [3, 4, 5, 6, 7].forEach((col) => {
    worksheet.getColumn(col).numFmt = '#,##0.00';
  });

  // Generate and download
  workbook.xlsx.writeBuffer().then((buffer) => {
    saveAs(new Blob([buffer]), `GRN_${grnData.grnNumber}.xlsx`);
  });
};

// Import Excel Data
export const importExcelData = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });

        // Find header row (row with 'GRN HEADER INFORMATION')
        const headerRowIndex = jsonData.findIndex((row) => row[0] === 'GRN HEADER INFORMATION');

        const result = {
          header: {},
          lineItems: [],
        };

        // Extract header data (2 rows below header title)
        if (headerRowIndex >= 0 && jsonData[headerRowIndex + 2]) {
          const headerRow = jsonData[headerRowIndex + 2];
          result.header = {
            grnNumber: headerRow[0],
            grnDate: headerRow[1],
            invoiceNumber: headerRow[2],
            vendor: headerRow[3],
            branch: headerRow[4],
          };
        }

        // Find line items section (row with 'LINE ITEMS')
        const itemsRowIndex = jsonData.findIndex((row) => row[0] === 'LINE ITEMS');

        // Extract line items (2 rows below items title)
        if (itemsRowIndex >= 0) {
          for (let i = itemsRowIndex + 2; i < jsonData.length; i++) {
            const row = jsonData[i];
            if (row && row[0]) {
              // Check if row has data
              result.lineItems.push({
                subcategory: row[0],
                description: row[1],
                quantity: row[2],
                price: row[3],
                tax: row[4],
              });
            }
          }
        }

        resolve(result);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
};
