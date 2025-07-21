import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Grid, 
  Card, 
  CardContent, 
  Typography, 
  LinearProgress,
  Avatar,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TablePagination,
  IconButton,
  useTheme,
  Box,
  Divider
} from '@mui/material';
import { 
  Receipt, 
  Category, 
  Store, 
  People,
  TrendingUp,
  PieChart as PieChartIcon,
  ListAlt,
  MoreVert,
  ArrowUpward,
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28DFF', '#FF6B6B'];

const Dashboard = () => {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Dummy data - replace with real API calls
  const stats = {
    totalGrns: 142,
    assetCategories: 12,
    branches: 8,
    vendors: 24,
    grnIncrease: 12.5,
    assetIncrease: 8.3
  };

  const recentGrns = [
    { 
      id: 1, 
      grn_number: 'GRN-202306-101', 
      grn_date: '2023-06-15', 
      vendor_name: 'Tech Solutions Inc.', 
      branch_name: 'Headquarters', 
      total_amount: 2450.00,
      status: 'completed'
    },
    { 
      id: 2, 
      grn_number: 'GRN-202306-100', 
      grn_date: '2023-06-14', 
      vendor_name: 'Office Supplies Co.', 
      branch_name: 'East Branch', 
      total_amount: 1230.50,
      status: 'completed'
    },
    { 
      id: 3, 
      grn_number: 'GRN-202306-099', 
      grn_date: '2023-06-12', 
      vendor_name: 'Computer World', 
      branch_name: 'North Branch', 
      total_amount: 3780.00,
      status: 'pending'
    },
    { 
      id: 4, 
      grn_number: 'GRN-202306-098', 
      grn_date: '2023-06-10', 
      vendor_name: 'Furniture Plus', 
      branch_name: 'West Branch', 
      total_amount: 4560.00,
      status: 'completed'
    },
    { 
      id: 5, 
      grn_number: 'GRN-202306-097', 
      grn_date: '2023-06-08', 
      vendor_name: 'Software Experts', 
      branch_name: 'Headquarters', 
      total_amount: 1890.00,
      status: 'rejected'
    }
  ];

  useEffect(() => {
    // Simulate API loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'completed': return theme.palette.success.main;
      case 'pending': return theme.palette.warning.main;
      case 'rejected': return theme.palette.error.main;
      default: return theme.palette.text.secondary;
    }
  };

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '80vh' 
      }}>
        <LinearProgress sx={{ width: '100%' }} />
      </Container>
    );
  }

  return (
    <Container sx={{ py: 4 }}>
      {/* Summary Cards */}
      <Grid container  spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            height: '100%',
            borderLeft: `4px solid ${theme.palette.primary.main}`,
            boxShadow: theme.shadows[6]
          }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between">
                <div>
                  <Typography variant="subtitle2" color="textSecondary">
                    TOTAL GRNs
                  </Typography>
                  <Typography variant="h4" sx={{ mt: 1 }}>
                    {stats.totalGrns}
                  </Typography>
                  <Box display="flex" alignItems="center" sx={{ mt: 1 }}>
                    <ArrowUpward fontSize="small" color="success" />
                    <Typography variant="body2" color="success.main" sx={{ ml: 0.5 }}>
                      {stats.grnIncrease}%
                    </Typography>
                    <Typography variant="body2" color="textSecondary" sx={{ ml: 1 }}>
                      vs last month
                    </Typography>
                  </Box>
                </div>
                <Avatar sx={{ 
                  bgcolor: theme.palette.primary.light,
                  color: theme.palette.primary.main,
                  width: 56, 
                  height: 56 
                }}>
                  <Receipt fontSize="large" />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            height: '100%',
            borderLeft: `4px solid ${theme.palette.success.main}`,
            boxShadow: theme.shadows[4]
          }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between">
                <div>
                  <Typography variant="subtitle2" color="textSecondary">
                    ASSET CATEGORIES
                  </Typography>
                  <Typography variant="h4" sx={{ mt: 1 }}>
                    {stats.assetCategories}
                  </Typography>
                  <Box display="flex" alignItems="center" sx={{ mt: 1 }}>
                    <ArrowUpward fontSize="small" color="success" />
                    <Typography variant="body2" color="success.main" sx={{ ml: 0.5 }}>
                      {stats.assetIncrease}%
                    </Typography>
                    <Typography variant="body2" color="textSecondary" sx={{ ml: 1 }}>
                      vs last quarter
                    </Typography>
                  </Box>
                </div>
                <Avatar sx={{ 
                  bgcolor: theme.palette.success.light,
                  color: theme.palette.success.main,
                  width: 56, 
                  height: 56 
                }}>
                  <Category fontSize="large" />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            height: '100%',
            borderLeft: `4px solid ${theme.palette.warning.main}`,
            boxShadow: theme.shadows[4]
          }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between">
                <div>
                  <Typography variant="subtitle2" color="textSecondary">
                    BRANCHES
                  </Typography>
                  <Typography variant="h4" sx={{ mt: 1 }}>
                    {stats.branches}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                    Across 3 countries
                  </Typography>
                </div>
                <Avatar sx={{ 
                  bgcolor: theme.palette.warning.light,
                  color: theme.palette.warning.main,
                  width: 56, 
                  height: 56 
                }}>
                  <Store fontSize="large" />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            height: '100%',
            borderLeft: `4px solid ${theme.palette.info.main}`,
            boxShadow: theme.shadows[4]
          }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between">
                <div>
                  <Typography variant="subtitle2" color="textSecondary">
                    VENDORS
                  </Typography>
                  <Typography variant="h4" sx={{ mt: 1 }}>
                    {stats.vendors}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                    5 new this month
                  </Typography>
                </div>
                <Avatar sx={{ 
                  bgcolor: theme.palette.info.light,
                  color: theme.palette.info.main,
                  width: 56, 
                  height: 56 
                }}>
                  <People fontSize="large" />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts Row */}
      <Grid container spacing={3} sx={{ 
        width: '100%', 
        display: 'flex',
        flexDirection: {xs: 'column', sm: 'row'},
        flexWrap: 'nowrap'
        }}>
        <Grid item xs={12} sm={6} sx={{
            width: {xs:'100%', sm:'50%'}, // Explicit 50% width
            minWidth: '50%', // Prevent shrinkage
            flexShrink: 0, // Disable flex shrinking
            padding: '8px !important', // Override any spacing issues
        }}>
            <Card sx={{ 
            height: 400, // Fixed height for consistency
            width: '100%',
            boxShadow: 3,
            display: 'flex',
            flexDirection: 'column'
            }}>
            <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <Box display="flex" alignItems="center" mb={2}>
                <TrendingUp color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">GRN Activity</Typography>
                </Box>
                <Divider sx={{ mb: 2 }} />
                <Box sx={{ flex: 1 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                    data={[
                        { name: 'Jan', GRNs: 24 },
                        { name: 'Feb', GRNs: 18 },
                        { name: 'Mar', GRNs: 12 },
                        { name: 'Apr', GRNs: 6 },
                        { name: 'May', GRNs: 9 },
                        { name: 'Jun', GRNs: 15 }
                    ]}
                    margin={{ top: 10, right: 20, left: 10, bottom: 10 }}
                    >
                    <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                    <XAxis 
                        dataKey="name" 
                        tick={{ fill: theme.palette.text.secondary }}
                        interval={0} // Show all labels
                    />
                    <YAxis 
                        tick={{ fill: theme.palette.text.secondary }}
                        domain={[0, 'dataMax + 5']} // Add padding
                    />
                    <Tooltip />
                    <Line 
                        type="monotone" 
                        dataKey="GRNs" 
                        stroke={theme.palette.primary.main} 
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                    />
                    </LineChart>
                </ResponsiveContainer>
                </Box>
            </CardContent>
            </Card>
        </Grid>

  {/* Asset Distribution Chart */}
        <Grid item sx={{
            width: {xs:'100%', sm:'50%'}, // Explicit 50% width
            minWidth: '50%', // Prevent shrinkage
            flexShrink: 0, // Disable flex shrinking
            padding: '8px !important', // Override any spacing issues
        }}>
            <Card sx={{ 
            height: 400, // Match height with line chart
            width: '100%',
            boxShadow: 3,
            display: 'flex',
            flexDirection: 'column'
            }}>
            <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <Box display="flex" alignItems="center" mb={2}>
                <PieChartIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Asset Distribution</Typography>
                </Box>
                <Divider sx={{ mb: 2 }} />
                <Box sx={{ flex: 1 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                    <Pie
                        data={[
                        { name: 'Laptops', value: 24 },
                        { name: 'Monitors', value: 18 },
                        { name: 'Software', value: 12 },
                        { name: 'Furniture', value: 6 }
                        ]}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        labelLine={false}
                    >
                        {COLORS.map((color, index) => (
                        <Cell key={`cell-${index}`} fill={color} />
                        ))}
                    </Pie>
                    <Tooltip 
                        formatter={(value, name) => [`${value}`, name]}
                    />
                    <Legend />
                    </PieChart>
                </ResponsiveContainer>
                </Box>
            </CardContent>
            </Card>
        </Grid>
    </Grid>

      {/* Recent GRNs Table */}
      <Card sx={{ boxShadow: theme.shadows[4] }}>
        <CardContent>
          <Box display="flex" alignItems="center" mb={2}>
            <ListAlt color="primary" sx={{ mr: 1 }} />
            <Typography variant="h6">Recent GRNs</Typography>
          </Box>
          <Divider sx={{ mb: 3 }} />
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>GRN Number</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Vendor</TableCell>
                  <TableCell>Branch</TableCell>
                  <TableCell align="right">Amount</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {recentGrns.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((grn) => (
                  <TableRow key={grn.id} hover>
                    <TableCell>{grn.grn_number}</TableCell>
                    <TableCell>{new Date(grn.grn_date).toLocaleDateString()}</TableCell>
                    <TableCell>{grn.vendor_name}</TableCell>
                    <TableCell>{grn.branch_name}</TableCell>
                    <TableCell align="right">
                      ${grn.total_amount.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <Box 
                          sx={{
                            width: 10,
                            height: 10,
                            borderRadius: '50%',
                            bgcolor: getStatusColor(grn.status),
                            mr: 1
                          }} 
                        />
                        <Typography 
                          variant="body2"
                          sx={{ 
                            textTransform: 'capitalize',
                            color: getStatusColor(grn.status)
                          }}
                        >
                          {grn.status}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      <IconButton size="small">
                        <MoreVert fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={recentGrns.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </CardContent>
      </Card>
    </Container>
  );
};

export default Dashboard;