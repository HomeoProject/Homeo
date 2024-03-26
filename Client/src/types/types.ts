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
  id: number
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
  id: number
  name: string
}

export interface Review {
  id: number
  reviewerId: string
  receiverId: string
  rating: number
  text: string
  createdAt: string
  updatedAt: string
}

export interface Constructor {
  id: number
  userId: string
  phoneNumber: string
  constructorEmail: string
  aboutMe: string
  experience: string
  minRate: number
  categories: Array<Category>
  cities: Array<string>
  languages: Array<string>
  paymentMethods: Array<string>
  createdAt: string
  updatedAt: string
}

export interface ConstructorProfileReviews {
  stats: {
    userId: string
    averageRating: number
    reviewsNumber: number
  }
  content: Array<Review>
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
