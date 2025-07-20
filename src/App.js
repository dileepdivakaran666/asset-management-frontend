import './App.css';
import GRNForm from './pages/GRN/Form';
import List from './pages/GRN/List';
import { Box, CssBaseline } from "@mui/material";
import { Routes, Route } from 'react-router-dom';
import DraftGRNList from './pages/GRN/Draft';
import Header from './components/Header';
import MainLayout from './pages/Layout/MainLayout';
import AssetCategories from './pages/Master/AssetCategories';
import AssetCategoryForm from './components/master/AssetCategoryForm.jsx';
import AssetSubcategories from './pages/Master/AssetSubcategories.jsx';
import AssetSubcategoryForm from './components/master/AssetSubcategoryForm.jsx';
import Branches from './pages/Master/Branches.jsx';
import BranchForm from './components/master/BranchForm.jsx';
import Vendors from './pages/Master/Vendors.jsx';
import VendorForm from './components/master/VendorForm.jsx';
import Manufacturers from './pages/Master/Manufacturers.jsx';
import ManufacturerForm from './components/master/ManufacturerForm.jsx';

function App() {
  return (
    <>
      <CssBaseline />
      <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
          <Header />
        <Box component="main" sx={{ flexGrow: 1,width: '100%',
            pt: 8,
            px: 3 }}>
                <Routes>
                   <Route path="/" element={<MainLayout />}>
                      <Route path="/grn/list" element={<List />} />
                      <Route path="/grn/new" element={<GRNForm />} />

                      <Route path="/asset-categories" element={<AssetCategories />} />
                      <Route path="/asset-categories/create" element={<AssetCategoryForm />} />
                      <Route path="/asset-categories/edit/:id" element={<AssetCategoryForm />} />

                      <Route path="/asset-subcategories" element={<AssetSubcategories />} />
                      <Route path="/asset-subcategories/create" element={<AssetSubcategoryForm />} />
                      <Route path="/asset-subcategories/edit/:id" element={<AssetSubcategoryForm />} />
                      
                      <Route path="/branches" element={<Branches />} />
                      <Route path="/branches/create" element={<BranchForm />} />
                      <Route path="/branches/edit/:id" element={<BranchForm />} />

                      <Route path="/vendors" element={<Vendors />} />
                      <Route path="/vendors/create" element={<VendorForm />} />
                      <Route path="/vendors/edit/:id" element={<VendorForm />} />

                      <Route path="/manufacturers" element={<Manufacturers />} />
                      <Route path="/manufacturers/create" element={<ManufacturerForm />} />
                      <Route path="/manufacturers/edit/:id" element={<ManufacturerForm />} />
                    </Route>
                  
                  
                  <Route path="/grn/edit/:id" element={<GRNForm />} />
                  <Route path="/grns/drafts" element={<DraftGRNList />} />
                </Routes>
        </Box>
      </Box>
      </>
  );
}

export default App;
