import { JwtPayload } from 'jwt-decode'

export interface CustomUser {
    id: string
    firstName: string | null
    lastName: string | null
    phoneNumber: string | null
    email: string
    avatar: string
    // isBanned: boolean
    isOnline: boolean
    isApproved: boolean
    isDeleted: boolean
    createdAt: string
    updatedAt: string
}

export interface Category {
    id: string
    name: string
    description: string
    image: string
    createdAt: string
    updatedAt: string
}

export enum PaymentMethod {
    CASH = 'Cash',
    CARD = 'Card',
    TRANSFER = 'Transfer',
}

export interface SelectedCategory {
    id: string
    name: string
}

export interface Review {
    id: string
    reviewerId: string
    receiverId: string
    text: string
    rating: string
    createdAt: string
    updatedAt: string
}

export interface Constructor {
    id: string
    userId: string
    phoneNumber: string
    constructorEmail: string
    aboutMe: string
    experience: string
    minRate: number
    categories: Array<Category>
    cities: Array<string>
    languages: Array<string>
    // receivedReviews: Array<Review>
    paymentMethods: Array<string>
    createdAt: string
    updatedAt: string
}

export interface City {
    name: string
    latitude: number
    longitude: number
    country: string
    population: number
    is_capital: boolean
}

export interface CustomJwtPayload extends JwtPayload {
    permissions: string[] // We're assuming permissions is an array of strings that is included in the JWT (it is)
}

export interface Developer {
    name: string
    github: string
    linkedin: string
    image: string
    role: string
}
