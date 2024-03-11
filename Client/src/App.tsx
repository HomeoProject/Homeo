import './Style/scss/App.scss'
import './style/themes/mui-styles.scss'
import './style/themes/toastify-styles.scss'
import Header from './Components/Header'
import Footer from './Components/Footer'
import { Outlet } from 'react-router'
import { useEffect, useState } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import axios from 'axios'
import { Category, CustomUser } from './types/types'
import UserContext from './Context/UserContext'
import { ToastContainer } from 'react-toastify'
import CategoriesContext from './Context/CategoriesContext'

function App() {
    const { isAuthenticated, getAccessTokenSilently } = useAuth0()
    const [customUser, setCustomUser] = useState<CustomUser | null>(null)
    const [categories, setCategories] = useState<Category[]>([])

    // Check if user exists in local database, if not, create it using Auth0 data
    const syncUser = async (token: string) => {
        await axios
            .get(
                `${import.meta.env.VITE_REACT_APIGATEWAY_URL}/api/users/sync`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )
            .then((response) => {
                console.log('Custom user from backend: ', response.data)
                setCustomUser(response.data)
            })
            .catch((error) => {
                console.error(error)
            })
    }

    useEffect(() => {
        if (isAuthenticated) {
            getAccessTokenSilently().then((token) => {
                syncUser(token)
            })
        }

        axios
            .get(
                `${import.meta.env.VITE_REACT_APIGATEWAY_URL}/api/constructors/categories`
            )
            .then((categories) => setCategories(categories.data))
    }, [getAccessTokenSilently, isAuthenticated])

    return (
        <div className="App">
            <UserContext.Provider
                value={{
                    customUser,
                    setCustomUser,
                }}
            >
                <CategoriesContext.Provider
                    value={{
                        categories,
                        setCategories,
                    }}
                >
                    <Header />
                    <ToastContainer />
                    <Outlet />
                    <Footer />
                </CategoriesContext.Provider>
            </UserContext.Provider>
        </div>
    )
}

export default App
