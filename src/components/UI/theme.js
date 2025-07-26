import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    h4: {
      fontWeight: 800,
      background: 'linear-gradient(90deg, #1a237e 0%, #3949ab 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      letterSpacing: '0.02em',
    },
  },
});

export default theme;
