export interface RawUser {
    id: string | undefined
    email: string | undefined
    avatar: string | undefined
    isBlocked: boolean
}

// {"id":"auth0|65468898e5d9a8efb224e51d","firstName":null,"lastName":null,"phoneNumber":null,"email":"user@wp.pl","avatar":"https://s.gravatar.com/avatar/53a00923baa61bd0235299111656d621?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fus.png","isBlocked":false,"isOnline":false,"isApproved":false,"createdAt":"2023-11-19T18:10:20.293+00:00","updatedAt":"2023-11-19T18:33:04.232+00:00"}

export interface CustomUser {
    id: string | undefined
    firstName: string | undefined
    lastName: string | undefined
    phoneNumber: string | undefined
    email: string | undefined
    avatar: string | undefined
    isBlocked: boolean
    isOnline: boolean
    isApproved: boolean
    createdAt: string
    updatedAt: string
}
