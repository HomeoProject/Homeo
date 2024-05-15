import { JwtPayload } from 'jwt-decode'

export interface CustomUser {
  id: string
  firstName: string | null
  lastName: string | null
  phoneNumber: string | null
  email: string
  avatar: string
  isBlocked: boolean
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

export interface ConstructorReviewsStats {
  userId: string
  averageRating: number
  reviewsNumber: number
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

export interface Dictionary {
  [key: string]: string
}

export interface ConstructorFilters {
  selectedCategories: Array<number | string>
  priceValue: Array<number>
  ratingValue: number
  directionValue: string
  languages: Array<string>
  isApproved: boolean
  selectedPaymentMethods: Array<string>
  selectedPlaces: Array<string>
}

export interface ConstructorByFilters {
  userId: string
  firstName: string
  lastName: string
  isApproved: boolean
  avatar: string
  minRate: number
  phoneNumber: string
  email: string
  averageRating: number
  reviewsNumber: number
  languages: Array<string>
  cities: Array<string>
  paymentMethods: Array<string>
  categoryIds: Array<number>
}

export interface ChatParticipant {
  id: number
  userId: string
  lastViewedAt: string
  createdAt: string
  updatedAt: string
}

export interface ChatMessage {
  id: number
  content: string
  imageUrl?: string
  chatRoomId?: number | null
  createdAt: string
  senderId: string
}

export interface ChatMessageToSend {
  content: string
  imageUrl?: Uint8Array
  chatRoomId?: number | null
  chatParticipantsIds: string[]
}

export interface ChatRoom {
  id: number
  chatParticipants: ChatParticipant[]
  lastMessageCreatedAt: string
  createdAt: string
  updatedAt: string
}

export interface FullChatRoomInfo {
  chatRoom: ChatRoom
  chatter: CustomUser
}

// export interface UnreadChats {
//   chatsIds: string[]
// }
