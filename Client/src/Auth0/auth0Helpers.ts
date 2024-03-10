import { CustomJwtPayload } from '../types/types'
import { jwtDecode } from 'jwt-decode'

export const checkIfUserHasPermission = (
    token: string,
    permission: string
) => {
    const decodedToken = jwtDecode<CustomJwtPayload>(token)

    switch (permission) {
        case 'admin':
            return decodedToken.permissions.includes(
                import.meta.env.VITE_REACT_ADMIN_ROLE
            )
        case 'constructor':
            return decodedToken.permissions.includes(
                import.meta.env.VITE_REACT_CONSTRUCTOR_ROLE
            )
        case 'user':
            return decodedToken.permissions.includes(
                import.meta.env.VITE_REACT_USER_ROLE
            )
        default:
            return false
    }
}
