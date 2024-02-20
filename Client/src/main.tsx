import { ThemeProvider } from '@mui/material'
import { Auth0Provider } from '@auth0/auth0-react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import ErrorPage from './Pages/ErrorPage.tsx'
import HomePage from './Pages/HomePage.tsx'
import AdvertsPage from './Pages/AdvertsPage.tsx'
import ContactPage from './Pages/ContactPage.tsx'
import AboutPage from './Pages/AboutPage.tsx'
import UserPage from './Pages/UserPage.tsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import theme from './style/themes/themes.ts'
import PersonalDataForm from './Components/PersonalDataForm.tsx'
import ConstructorDataForm from './Components/ConstructorDataForm.tsx'

const domain: string | undefined = import.meta.env.VITE_REACT_APP_AUTH0_DOMAIN
const clientId: string | undefined = import.meta.env
    .VITE_REACT_APP_AUTH0_CLIENT_ID

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
                children: [
                    {
                        index: true,
                        element: <PersonalDataForm />,
                    },
                    {
                        path: 'constructor-info',
                        element: <ConstructorDataForm />,
                    },
                ],
            },
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
