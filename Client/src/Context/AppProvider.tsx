import { ReactNode, useEffect, useState } from 'react'
import UserContext from './UserContext'
import CategoriesContext from './CategoriesContext'
import ConstructorContext from './ConstructorContext'
import { Constructor, Category, CustomUser } from '../types/types'
import { useAuth0 } from '@auth0/auth0-react'
import apiClient, { setAuthToken } from '../AxiosClients/apiClient'
import { checkIfUserHasPermission } from '../Auth0/auth0Helpers'

type AppProviderProps = {
    children: ReactNode
}

const AppProvider = ({ children }: AppProviderProps) => {
    const { isAuthenticated, getAccessTokenSilently } = useAuth0()
    const [customUser, setCustomUser] = useState<CustomUser | null>(null)
    const [constructor, setConstructor] = useState<Constructor | null>(null)
    const [categories, setCategories] = useState<Category[]>([])

    useEffect(() => {
        const fetchUserData = async () => {
            if (!isAuthenticated) return

            // Check if user exists in local database, if not, create it using Auth0 data
            const token = await getAccessTokenSilently()
            setAuthToken(token) // Set the auth token for the axios client

            // Get user data
            const userResponse = await apiClient.get<CustomUser>('/users/sync')
            console.log('Custom user: ', userResponse.data)
            if (userResponse.status === 200 && userResponse.data) {
                setCustomUser(userResponse.data)
            }

            // Get constructor data
            const isConstructor = checkIfUserHasPermission(token, 'constructor')

            if (isConstructor) {
                const userId = userResponse.data.id
                const constructorResponse = await apiClient.get<Constructor>(
                    `/constructors/${userId}`
                )
                setConstructor(constructorResponse.data)
                console.log('Constructor: ', constructorResponse.data)
            }
        }

        const fetchCategories = async () => {
            try {
                const categoriesResponse = await apiClient.get<Category[]>(
                    '/constructors/categories'
                )
                setCategories(categoriesResponse.data)
            } catch (error) {
                console.error(error)
            }
        }

        fetchUserData()
        fetchCategories()
    }, [getAccessTokenSilently, isAuthenticated])

    return (
        <UserContext.Provider value={{ customUser, setCustomUser }}>
            <ConstructorContext.Provider
                value={{ constructor, setConstructor }}
            >
                <CategoriesContext.Provider
                    value={{ categories, setCategories }}
                >
                    {children}
                </CategoriesContext.Provider>
            </ConstructorContext.Provider>
        </UserContext.Provider>
    )
}

export default AppProvider
