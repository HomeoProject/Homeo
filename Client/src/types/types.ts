export interface RawUser {
    id: string | undefined
    email: string | undefined
    avatar: string | undefined
    isBlocked: boolean
}

export interface CustomUser {
    id: string | undefined
    firstName: string | undefined
    lastName: string | undefined
    phoneNumber: string | undefined
    email: string | undefined
    avatar: string | undefined
    isBlocked: boolean
    isOnline: boolean
    isConstructor: boolean
    isApproved: boolean
    createdAt: string
    updatedAt: string
}

export interface Category {
    id: string | undefined
    name: string | undefined
    createdAt: string
    updatedAt: string
}

export enum PaymentMethod {
    CASH = 'cash',
    CARD = 'card',
    TRANSFER = 'transfer',
}

export interface Review {
    id: string | undefined
    reviewerId: string | undefined
    receiverId: string | undefined
    text: string | undefined
    rating: string | undefined
    createdAt: string
    updatedAt: string
}

export interface Constructor {
    id: string | undefined
    userId: string | undefined
    companyName: string | undefined
    companyAddress: string | undefined
    companyPhoneNumber: string | undefined
    companyEmail: string | undefined
    aboutMe: string | undefined
    experience: string | undefined
    rate: number | undefined
    categories: Array<Category>
    city: string | undefined
    language: string | undefined
    receivedReviews: Array<Review>
    acceptedPaymentMethods: Array<PaymentMethod>
    createdAt: string
    updatedAt: string
}
