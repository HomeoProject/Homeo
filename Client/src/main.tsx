import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import ErrorPage from './Pages/ErrorPage.tsx'
import HomePage from './Pages/HomePage.tsx'
import AdvertsPage from './Pages/AdvertsPage.tsx'
import ContactPage from './Pages/ContactPage.tsx'
import AboutPage from './Pages/AboutPage.tsx'
import UserPage from './Pages/UserPage.tsx'
import { ThemeProvider } from '@mui/material/styles'
import { Auth0Provider } from '@auth0/auth0-react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import theme from './Style/themes/themes'

const domain: string | undefined = import.meta.env.VITE_REACT_APP_AUTH0_DOMAIN
const clientId: string | undefined = import.meta.env.VITE_REACT_APP_AUTH0_CLIENT_ID

const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        errorElement: <ErrorPage />,
        children: [
            {
                index: true,
                element: <HomePage />,
            },
            {
                path: '/about',
                element: <AboutPage />,
            },
            {
                path: '/adverts',
                element: <AdvertsPage />,
            },
            {
                path: '/contact',
                element: <ContactPage />,
            },
            {
                path: '/user/:id',
                element: <UserPage />,
            }
        ],
    },
])

// console.log(domain, clientId)

ReactDOM.createRoot(document.getElementById('root')!).render(
    <Auth0Provider
        domain={domain || ''}
        clientId={clientId || ''}
        authorizationParams={{
            redirect_uri: window.location.origin,
            audience: 'https://homeo-backend/api',
        }}
    >
        <ThemeProvider theme={theme}>
            <RouterProvider router={router} />
        </ThemeProvider>
    </Auth0Provider>
)
