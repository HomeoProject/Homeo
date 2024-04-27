import { ReactNode, useEffect, useState } from 'react'
import UserContext from './UserContext'
import CategoriesContext from './CategoriesContext'
import ConstructorContext from './ConstructorContext'
import { english } from '../Data/dictionary'
import DictionaryContext from './DictionaryContext'
import { Constructor, Category, CustomUser, Dictionary } from '../types/types'
import { useAuth0 } from '@auth0/auth0-react'
import apiClient, { setAuthToken } from '../AxiosClients/apiClient'
import { checkIfUserHasPermission } from '../Auth0/auth0Helpers'
import chatClient, { setChatAuthToken } from '../WebSockets/ChatClient'
import UnreadChatsContext from './UnreadChatsContext'

type AppProviderProps = {
  children: ReactNode
}

const AppProvider = ({ children }: AppProviderProps) => {
  const { getAccessTokenSilently } = useAuth0()
  const [customUser, setCustomUser] = useState<CustomUser | null>(null)
  const [constructor, setConstructor] = useState<Constructor | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [dictionary, setDictionary] = useState<Dictionary>(english)
  const [unreadChats, setUnreadChats] = useState<string[]>([])

  useEffect(() => {
    const setApiClientToken = async () => {
      const token = await getAccessTokenSilently()
      if (token) {
        setAuthToken(token)
        return token
      }
    }

    const fetchUserData = async (token: string) => {
      // if (!isAuthenticated) return

      // Get user data
      const userResponse = await apiClient.get<CustomUser>('users/sync')
      if (userResponse.status === 200 && userResponse.data) {
        setCustomUser(userResponse.data)
      }

      // Get constructor data
      const isConstructor = checkIfUserHasPermission(token, 'constructor')

      if (isConstructor) {
        const userId = userResponse.data.id
        const constructorResponse = await apiClient.get<Constructor>(
          `constructors/${encodeURI(userId)}`
        )
        setConstructor(constructorResponse.data)
      }
    }

    const fetchCategories = async () => {
      try {
        const categoriesResponse = await apiClient.get<Category[]>(
          'constructors/categories'
        )
        setCategories(categoriesResponse.data)
      } catch (error) {
        console.error(error)
      }
    }

    const fetchUnreadChats = async () => {
      try {
        const unreadChatsResponse = await apiClient.get('/chat/unread-chats')
        setUnreadChats(unreadChatsResponse.data)
        console.log('Unread chats: ', unreadChatsResponse.data)
      } catch (error) {
        console.error(error)
      }
    }

    setApiClientToken().then((token) => {
      if (!token) return
      fetchUserData(token)
      fetchUnreadChats()
    })
    fetchCategories()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const setChatClientToken = async () => {
      const token = await getAccessTokenSilently()
      if (token) {
        setChatAuthToken(token)
        return token
      }
    }

    setChatClientToken().then(() => chatClient.connect())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <UserContext.Provider value={{ customUser, setCustomUser }}>
      <ConstructorContext.Provider value={{ constructor, setConstructor }}>
        <CategoriesContext.Provider value={{ categories, setCategories }}>
          <DictionaryContext.Provider value={{ dictionary, setDictionary }}>
            <UnreadChatsContext.Provider
              value={{ unreadChats, setUnreadChats }}
            >
              {children}
            </UnreadChatsContext.Provider>
          </DictionaryContext.Provider>
        </CategoriesContext.Provider>
      </ConstructorContext.Provider>
    </UserContext.Provider>
  )
}

export default AppProvider
