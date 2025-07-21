import React, { useState, useEffect } from 'react';
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
  useMediaQuery,
  AppBar,
  Toolbar,
  Collapse
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
  Assessment,
  Menu as MenuIcon,
  ExpandLess,
  ExpandMore
} from '@mui/icons-material';
import { NavLink } from 'react-router-dom';

const drawerWidth = 240;

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

const Sidebar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery('(max-width:768px)');
  const [open, setOpen] = useState(!isMobile);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState({});

  // Reset expanded items when sidebar closes
  useEffect(() => {
    if ((isMobile && !mobileOpen) || (!isMobile && !open)) {
      setExpandedItems({});
    }
  }, [isMobile, mobileOpen, open]);

  const toggleDrawer = () => {
    if (isMobile) {
      setMobileOpen(!mobileOpen);
    } else {
      setOpen(!open);
    }
  };

  const toggleSubItems = (text) => {
    setExpandedItems(prev => ({
      ...prev,
      [text]: !prev[text]
    }));
  };

  const menuItems = [
    { text: 'Dashboard', icon: <Dashboard />, path: '/' },
    {
      text: 'Transactions',
      icon: <Receipt />,
      subItems: [{ text: 'GRN', path: '/grn/list' }],
    },
    {
      text: 'Reports',
      icon: <SvgIcon color="primary"><Assessment /></SvgIcon>,
      subItems: [
        { text: 'GRN Register', path: '/reports/grn-register' },
        { text: 'Asset Summary', path: '/reports/asset-summary' }
      ],
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

  const drawerContent = (
    <>
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
                <Tooltip title={!open && !isMobile ? item.text : ''} placement="right">
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
                <Tooltip title={!open && !isMobile ? item.text : ''} placement="right">
                  <ListItemButton
                    onClick={() => toggleSubItems(item.text)}
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
                    {open && item.subItems && (
                      expandedItems[item.text] ? <ExpandLess /> : <ExpandMore />
                    )}
                  </ListItemButton>
                </Tooltip>

                {item.subItems && (
                  <Collapse 
                    in={(isMobile && mobileOpen) || (!isMobile && open && expandedItems[item.text])} 
                    timeout="auto" 
                    unmountOnExit
                  >
                    <List disablePadding>
                      {item.subItems.map((subItem) => (
                        <NavLink
                          key={subItem.text}
                          to={subItem.path}
                          onClick={() => {
                            if (isMobile) setMobileOpen(false);
                          }}
                          style={({ isActive }) => ({
                            textDecoration: 'none',
                            color: isActive ? '#1976d2' : 'inherit',
                            backgroundColor: isActive ? '#e3f2fd' : 'transparent',
                            borderRadius: 8,
                            display: 'block',
                          })}
                        >
                          <ListItem disablePadding sx={{ display: 'block' }}>
                            <ListItemButton sx={{ minHeight: 40, pl: 5, px: 2.5 }}>
                              <ListItemText primary={subItem.text} />
                            </ListItemButton>
                          </ListItem>
                        </NavLink>
                      ))}
                    </List>
                  </Collapse>
                )}
              </>
            )}
            <Divider />
          </React.Fragment>
        ))}
      </List>
    </>
  );

  return (
    <>
      {/* AppBar with menu button on mobile */}
      {isMobile && (
        <AppBar position="fixed" sx={{ zIndex: theme.zIndex.drawer + 1 }}>
          <Toolbar>
            <IconButton
              color="inherit"
              edge="start"
              onClick={toggleDrawer}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <ListItemText primary="Asset Management" sx={{ color: 'white' }} />
          </Toolbar>
        </AppBar>
      )}

      {/* Drawer: permanent on desktop, temporary on mobile */}
      <Drawer
        variant={isMobile ? 'temporary' : 'permanent'}
        open={isMobile ? mobileOpen : open}
        onClose={toggleDrawer}
        sx={{
          width: isMobile ? drawerWidth : (open ? drawerWidth : 72),
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: isMobile ? drawerWidth : (open ? drawerWidth : 72),
            transition: theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
            overflowX: 'hidden',
            boxSizing: 'border-box',
            marginTop: isMobile ? 0 : '64px',
            height: isMobile ? '100vh' : 'calc(100vh - 64px)',
          },
        }}
      >
        {drawerContent}
      </Drawer>
    </>
  );
};

export default Sidebar;