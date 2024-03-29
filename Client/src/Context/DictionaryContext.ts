import { createContext, Dispatch, SetStateAction, useContext } from 'react'
import { Dictionary } from '../types/types'

type DictionaryContextType = {
  dictionary: Dictionary
  setDictionary: Dispatch<SetStateAction<Dictionary>>
}

const defaultContextValue: DictionaryContextType = {
  dictionary: {},
  setDictionary: () => {},
}

export const useDictionaryContext = () => {
  const context = useContext(DictionaryContext)
  if (!context) {
    console.error('Error deploying DictionaryContext')
  }
  return context
}

export const DictionaryContext =
  createContext<DictionaryContextType>(defaultContextValue)

export default DictionaryContext
