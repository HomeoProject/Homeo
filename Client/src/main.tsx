import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { ThemeProvider } from '@mui/material/styles'
import { Auth0Provider } from '@auth0/auth0-react'
import theme from './Style/themes/themes'

const domain: string | undefined = import.meta.env.VITE_REACT_APP_AUTH0_DOMAIN
const clientId: string | undefined = import.meta.env
    .VITE_REACT_APP_AUTH0_CLIENT_ID

// console.log(domain, clientId)

ReactDOM.createRoot(document.getElementById('root')!).render(
    <Auth0Provider
        domain={domain || ''}
        clientId={clientId || ''}
        authorizationParams={{
            redirect_uri: window.location.origin,
        }}
    >
        <ThemeProvider theme={theme}>
            <App />
        </ThemeProvider>
    </Auth0Provider>
)
