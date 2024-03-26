import { createContext, Dispatch, SetStateAction, useContext } from 'react'
import { Category } from '../types/types'

type CategoriesContextType = {
  categories: Category[]
  setCategories: Dispatch<SetStateAction<Category[]>>
}

const defaultContextValue: CategoriesContextType = {
  categories: [],
  setCategories: () => {},
}

export const useCategoriesContext = () => {
  const context = useContext(CategoriesContext)
  if (!context) {
    console.error('Error deploying CategoriesContext')
  }
  return context
}

export const CategoriesContext =
  createContext<CategoriesContextType>(defaultContextValue)

export default CategoriesContext
