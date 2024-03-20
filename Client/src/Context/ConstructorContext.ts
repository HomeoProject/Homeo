import { createContext, Dispatch, SetStateAction, useContext } from 'react'
import { Constructor } from '../types/types'

type ConstructorContextType = {
    constructor: Constructor | null
    setConstructor: Dispatch<SetStateAction<Constructor | null>>
}

const defaultContextValue: ConstructorContextType = {
    constructor: null,
    setConstructor: () => {},
}

export const useConstructorContext = () => {
    const context = useContext(ConstructorContext)
    if (!context) {
        console.error('Error deploying ConstructorContext')
    }
    return context
}

export const ConstructorContext =
    createContext<ConstructorContextType>(defaultContextValue)

export default ConstructorContext
