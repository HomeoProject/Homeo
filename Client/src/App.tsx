import './Style/scss/App.scss'
import './style/themes/mui-styles.scss'
import './style/themes/toastify-styles.scss'
import Header from './Components/Header'
import Footer from './Components/Footer'
import { Outlet } from 'react-router'
import { useEffect, useState } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import axios from 'axios'
import { CustomUser, RawUser } from './types/types'
import UserContext from './Context/UserContext'
import { ToastContainer } from 'react-toastify'

function App() {
    const { user, isAuthenticated, getAccessTokenSilently } = useAuth0()
    const [customUser, setCustomUser] = useState<CustomUser | null>(null)

    // Check if user exists in local database, if not, create it using Auth0 data
    const syncUser = async (token: string) => {
        const userBody: RawUser = {
            id: user?.sub,
            email: user?.email,
            avatar: user?.picture,
            // TODO: banning on our backend side
            // isBanned: user?.
        }

        await axios
            .post(
                `${import.meta.env.VITE_REACT_APIGATEWAY_URL}/api/users`,
                userBody,
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
        if (user && isAuthenticated) {
            getAccessTokenSilently().then((token) => {
                syncUser(token)
            })
        }
    }, [user, isAuthenticated])

    return (
        <div className="App">
            <UserContext.Provider
                value={{
                    customUser,
                    setCustomUser,
                }}
            >
                <Header />
                <ToastContainer />
                <Outlet />
                <Footer />
            </UserContext.Provider>
        </div>
    )
}

export default App
