import { createContext, Dispatch, SetStateAction, useContext } from 'react'

type UnreadChatsContextType = {
  unreadChats: string[]
  setUnreadChats: Dispatch<SetStateAction<string[]>>
}

const defaultContextValue: UnreadChatsContextType = {
  unreadChats: [],
  setUnreadChats: () => {},
}

// eslint-disable-next-line react-refresh/only-export-components
export const useUnreadChatsContext = () => {
  const context = useContext(UnreadChatsContext)
  if (!context) {
    console.error('Error deploying UnreadChatsContext')
  }
  return context
}

export const UnreadChatsContext =
  createContext<UnreadChatsContextType>(defaultContextValue)

export default UnreadChatsContext
