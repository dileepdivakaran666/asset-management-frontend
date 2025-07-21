import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useMediaQuery, useTheme } from '@mui/material';

// import Header from '../../components/Header';


// const drawerWidth = 240;

const MainLayout = () => {

  const theme = useTheme();
const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <main style={{
        flex: 1,
        padding: isMobile ? '64px 16px 16px' : '16px',
        overflow: 'auto',
        position: 'relative',
      }}>
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;