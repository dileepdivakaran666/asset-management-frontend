import { useNavigate} from 'react-router-dom';
import { AppBar, Toolbar, Typography } from '@mui/material';
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
          
        </Toolbar>
      </AppBar>
    </div>
  )
}

export default Header