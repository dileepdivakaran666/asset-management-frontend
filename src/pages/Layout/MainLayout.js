import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
// import Header from '../../components/Header';


// const drawerWidth = 240;

const MainLayout = () => {
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <main style={{ flex: 1}}>
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;