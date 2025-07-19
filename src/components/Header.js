import {Link, useNavigate} from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
// import { useAuth } from '../context/AuthContext';


function Header() {

//   const {isLoggedIn, handleLogout} = useAuth()
  const navigate = useNavigate()


  return (
    <div>
        <AppBar position="fixed" sx={{zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          
          <Typography variant="h6" component="div" sx={{ flexGrow: 1,cursor: "pointer" }} onClick={()=>navigate('/')}>
           Asset Management App
          </Typography>
          

          <Button color="inherit" component={Link} to="/about" sx={{textTransform:"none", mr:4}}>About Us</Button>
          <Button color="inherit" component={Link} to="/contact" sx={{textTransform:"none", mr:4}}>Contact Us</Button>
        </Toolbar>
      </AppBar>
    </div>
  )
}

export default Header