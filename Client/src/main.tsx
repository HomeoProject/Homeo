import ReactDOM from 'react-dom/client'
import App from './App.tsx'
// import { createTheme, ThemeProvider } from '@mui/material/styles';

// const primary = {
//   main: '#1CBE8E',
//   light: '#E1FFEB',
//   dark: '#24484C',
//   contrastText: '#004F32',
// };

// const theme = createTheme({
//   palette: {
//     primary: primary
//   },
// });

ReactDOM.createRoot(document.getElementById('root')!).render(
  // <ThemeProvider theme={theme}>
  <App />
  // </ThemeProvider>
)
