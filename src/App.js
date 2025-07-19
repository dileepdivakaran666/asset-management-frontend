import './App.css';
import GRNForm from './pages/GRN/Form';
import List from './pages/GRN/List';
import { Box, CssBaseline } from "@mui/material";
import { Routes, Route } from 'react-router-dom';
import DraftGRNList from './pages/GRN/Draft';
import Header from './components/Header';
import MainLayout from './pages/Layout/MainLayout';

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
