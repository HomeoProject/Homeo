import { JwtPayload } from 'jwt-decode'

export interface RawUser {
    id: string | undefined
    email: string | undefined
    avatar: string | undefined
}

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
    createdAt: string
    updatedAt: string
}

export enum PaymentMethod {
    CASH = 'Cash',
    CARD = 'Card',
    TRANSFER = 'Transfer',
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
    email: string
    aboutMe: string
    experience: string
    rate: number
    categories: Array<Category>
    cities: Array<string>
    languages: Array<string>
    receivedReviews: Array<Review>
    acceptedPaymentMethods: Array<string>
    createdAt: string
    updatedAt: string
}

export interface Place {
    label: string
    value: string
}

export interface CustomJwtPayload extends JwtPayload {
    permissions: string[] // We're assuming permissions is an array of strings that is included in the JWT (it is)
}
