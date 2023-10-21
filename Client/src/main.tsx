import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { ThemeProvider, Theme } from '@mui/material/styles'
import theme from './Style/themes/themes'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <ThemeProvider theme={theme as Theme}>
    <App />
  </ThemeProvider>
)
