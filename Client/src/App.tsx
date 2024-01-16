import './Style/scss/App.scss'
import './style/themes/mui-styles.scss';
import Header from './Components/Header'
import Footer from './Components/Footer'
import { Outlet } from 'react-router'
import { useEffect } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import axios from 'axios'
import { RawUser } from './types/types'

function App() {
    const { user, isAuthenticated, getAccessTokenSilently } = useAuth0()

    // Check if user exists in local database, if not, create it using Auth0 data
    const syncUser = async (token: string) => {
        const userBody: RawUser = {
            id: user?.sub,
            email: user?.email,
            avatar: user?.picture,
            isBlocked: false,
        }
        const response = await axios.post(
            `http://localhost:8080/api/users`,
            userBody,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        )
        console.log(response.data)
    }

    useEffect(() => {
        if (user && isAuthenticated) {
            getAccessTokenSilently().then((token) => {
                syncUser(token)
                // console.log(token);
            })
        }
    }, [user, isAuthenticated])

    return (
        <div className="App">
            <Header />
            <Outlet />
            <Footer />
        </div>
    )
}

export default App
