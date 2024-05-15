import { createContext, Dispatch, SetStateAction, useContext } from 'react'
import { CustomUser } from '../types/types'

type UserContextType = {
  customUser: CustomUser | null
  setCustomUser: Dispatch<SetStateAction<CustomUser | null>>
}

const defaultContextValue: UserContextType = {
  customUser: null,
  setCustomUser: () => {},
}

export const useUserContext = () => {
  const context = useContext(UserContext)
  if (!context) {
    console.error('Error deploying UserContext')
  }
  return context
}

export const UserContext = createContext<UserContextType>(defaultContextValue)

export default UserContext
