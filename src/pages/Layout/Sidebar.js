import React, { useState } from 'react';
import {
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  styled,
  Tooltip,
  SvgIcon,
  useTheme,
} from '@mui/material';
import {
  ChevronLeft,
  ChevronRight,
  Inventory,
  Receipt,
  Business,
  People,
  Settings,
  Dashboard,
} from '@mui/icons-material';
import { NavLink } from 'react-router-dom';

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

const Sidebar = ({ drawerWidth = 240 }) => {
  const theme = useTheme();
  const [open, setOpen] = useState(true);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const menuItems = [
    { text: 'Dashboard', icon: <Dashboard />, path: '/' },
    {
      text: 'Transactions',
      icon: <Receipt />,
      subItems: [{ text: 'GRN', path: '/grn/list' }],
    },
    {
      text: 'Masters',
      icon: <Inventory />,
      subItems: [
        { text: 'Asset Categories', path: '/asset-categories' },
        { text: 'Subcategories', path: '/asset-subcategories' },
        { text: 'Vendors', path: '/vendors' },
        { text: 'Manufacturers', path: '/manufacturers' },
      ],
    },
    { text: 'Branches', icon: <Business />, path: '/branches' },
    { text: 'Users', icon: <People />, path: '/users' },
    { text: 'Settings', icon: <Settings />, path: '/settings' },
  ];

  return (
    <Drawer
      variant="permanent"
      open={open}
      sx={{
        width: open ? drawerWidth : 72,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: open ? drawerWidth : 72,
          transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
          overflowX: 'hidden',
          boxSizing: 'border-box',
          marginTop: '64px',
          height: 'calc(100vh - 64px)',
        },
      }}
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
              <NavLink
                to={item.path}
                style={({ isActive }) => ({
                  textDecoration: 'none',
                  color: isActive ? '#1976d2' : 'inherit',
                  backgroundColor: isActive ? '#e3f2fd' : 'transparent',
                  borderRadius: 8,
                  display: 'block',
                })}
              >
                <Tooltip title={!open ? item.text : ''} placement="right">
                  <ListItem disablePadding sx={{ display: 'block' }}>
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
                        <SvgIcon color="primary">{item.icon}</SvgIcon>
                      </ListItemIcon>
                      <ListItemText primary={item.text} sx={{ opacity: open ? 1 : 0 }} />
                    </ListItemButton>
                  </ListItem>
                </Tooltip>
              </NavLink>
            ) : (
              <>
                <Tooltip title={!open ? item.text : ''} placement="right">
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
                      <SvgIcon color="primary">{item.icon}</SvgIcon>
                    </ListItemIcon>
                    <ListItemText primary={item.text} sx={{ opacity: open ? 1 : 0 }} />
                  </ListItemButton>
                </Tooltip>

                {open && item.subItems && (
                  <List disablePadding>
                    {item.subItems.map((subItem) => (
                      <NavLink
                        key={subItem.text}
                        to={subItem.path}
                        style={({ isActive }) => ({
                          textDecoration: 'none',
                          color: isActive ? '#1976d2' : 'inherit',
                          backgroundColor: isActive ? '#e3f2fd' : 'transparent',
                          borderRadius: 8,
                          display: 'block',
                        })}
                      >
                        <ListItem disablePadding sx={{ display: 'block' }}>
                          <ListItemButton
                            sx={{
                              minHeight: 40,
                              pl: 5,
                              px: 2.5,
                            }}
                          >
                            <ListItemText primary={subItem.text} />
                          </ListItemButton>
                        </ListItem>
                      </NavLink>
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
