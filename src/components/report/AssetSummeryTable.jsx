import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  CircularProgress,
} from "@mui/material";
import { Download as DownloadIcon } from "@mui/icons-material";

const AssetSummaryTable = () => {
  const [summaryData, setSummaryData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch summary data
  const fetchAssetSummary = async () => {
    try {
      setLoading(true);
      const res = await api.get("/asset-summary");
      setSummaryData(res.data);
    } catch (error) {
      console.error("Error fetching asset summary", error);
    } finally {
      setLoading(false);
    }
  };

  // Download Excel
  const downloadExcel = async () => {
    try {
      const res = await api.get("/asset-summary/export", {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "asset_summary.xlsx");
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error("Download failed", error);
    }
  };

  useEffect(() => {
    fetchAssetSummary();
  }, []);

  return (
    <Box p={4}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4">Asset Summary Report</Typography>
        <Button
          variant="contained"
          startIcon={<DownloadIcon />}
          onClick={downloadExcel}
        >
          Export to Excel
        </Button>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Category Name</TableCell>
                <TableCell>Branch Name</TableCell>
                <TableCell>Asset Count</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {summaryData.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{row.categoryName}</TableCell>
                  <TableCell>{row.branchName}</TableCell>
                  <TableCell>{row.assetCount}</TableCell>
                </TableRow>
              ))}
              {summaryData.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} align="center">
                    No data available
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default AssetSummaryTable;
