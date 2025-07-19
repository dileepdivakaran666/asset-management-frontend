import React, { useState } from 'react';
import {
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  styled,
  useTheme
} from '@mui/material';
import {
  ChevronLeft,
  ChevronRight,
  Inventory,
  Receipt,
  Business,
  People,
  Settings,
  Dashboard
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

const Sidebar = ({ drawerWidth = 240 }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [open, setOpen] = useState(true);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const menuItems = [
    { text: 'Dashboard', icon: <Dashboard />, path: '/' },
    {
      text: 'Transactions',
      icon: <Receipt />,
      subItems: [
        { text: 'GRN', path: '/grn/list' },
        { text: 'Issuance', path: '/issuance' },
      ],
    },
    {
      text: 'Masters',
      icon: <Inventory />,
      subItems: [
        { text: 'Asset Categories', path: '/asset-categories' },
        { text: 'Subcategories', path: '/subcategories' },
        { text: 'Vendors', path: '/vendors' },
        { text: 'Manufacturers', path: '/manufacturers' },
      ],
    },
    { text: 'Branches', icon: <Business />, path: '/branches' },
    { text: 'Users', icon: <People />, path: '/users' },
    { text: 'Settings', icon: <Settings />, path: '/settings' },
  ];

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <Drawer
      sx={{
        width: open ? drawerWidth : 72,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: open ? drawerWidth : 72,
          boxSizing: 'border-box',
          transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
          overflowX: 'hidden',
          marginTop: '64px', // Matches AppBar height
      height: 'calc(100vh - 64px)', // Subtract AppBar height
        },
      }}
      variant="permanent"
      anchor="left"
      open={open}
    >
      <DrawerHeader>
        <IconButton onClick={toggleDrawer}>
          {open ? <ChevronLeft /> : <ChevronRight />}
        </IconButton>
      </DrawerHeader>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <React.Fragment key={item.text}>
            {item.path ? (
              <ListItem 
                disablePadding
                sx={{ display: 'block' }}
              >
                <ListItemButton
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? 'initial' : 'center',
                    px: 2.5,
                  }}
                  onClick={() => handleNavigation(item.path)}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : 'auto',
                      justifyContent: 'center',
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.text} 
                    sx={{ opacity: open ? 1 : 0 }} 
                  />
                </ListItemButton>
              </ListItem>
            ) : (
              <>
                <ListItemButton
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? 'initial' : 'center',
                    px: 2.5,
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : 'auto',
                      justifyContent: 'center',
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.text} 
                    sx={{ opacity: open ? 1 : 0 }} 
                  />
                </ListItemButton>
                {open && item.subItems && (
                  <List disablePadding>
                    {item.subItems.map((subItem) => (
                      <ListItem 
                        key={subItem.text} 
                        disablePadding
                        sx={{ display: 'block' }}
                      >
                        <ListItemButton
                          sx={{
                            minHeight: 48,
                            pl: 4,
                            px: 2.5,
                          }}
                          onClick={() => handleNavigation(subItem.path)}
                        >
                          <ListItemText primary={subItem.text} />
                        </ListItemButton>
                      </ListItem>
                    ))}
                  </List>
                )}
              </>
            )}
            <Divider />
          </React.Fragment>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;