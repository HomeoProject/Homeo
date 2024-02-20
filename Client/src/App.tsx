import './Style/scss/App.scss'
import './style/themes/mui-styles.scss'
import Header from './Components/Header'
import Footer from './Components/Footer'
import { Outlet } from 'react-router'
import { useEffect, useState } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import axios from 'axios'
import { CustomUser, RawUser } from './types/types'
import UserContext from './Context/UserContext'

function App() {
    const { user, isAuthenticated, getAccessTokenSilently } = useAuth0()
    const [customUser, setCustomUser] = useState<CustomUser | null>(null)

    // Check if user exists in local database, if not, create it using Auth0 data
    const syncUser = async (token: string) => {
        const userBody: RawUser = {
            id: user?.sub,
            email: user?.email,
            avatar: user?.picture,
            isBlocked: false,
        }

        await axios
            .post(`http://localhost:8080/api/users`, userBody, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((response) => {
                setCustomUser({
                    ...response.data,
                    firstName: 'Karol',
                    lastName: 'Wiśniewski',
                    phoneNumber: '737483499',
                    isConstructor: true,
                })
            })
            .catch((error) => {
                console.log(error)
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
            <UserContext.Provider value={{ customUser, setCustomUser }}>
                <Header />
                <Outlet />
                <Footer />
            </UserContext.Provider>
        </div>
    )
}

export default App
