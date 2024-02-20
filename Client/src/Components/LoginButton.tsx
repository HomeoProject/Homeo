import { useAuth0 } from '@auth0/auth0-react'
import Button from '@mui/material/Button'

const LoginButton = () => {
    const { loginWithRedirect, isLoading } = useAuth0()

    return (
        !isLoading && (
            <Button
                variant="contained"
                onClick={() => (
                    loginWithRedirect(),
                    console.log(import.meta.env.REACT_APP_AUTH0_DOMAIN)
                )}
                sx={{
                    fontFamily: 'inherit',
                    fontWeight: 'bold',
                    color: '#1cbe8e',
                    backgroundColor: 'white',
                    margin: '0',
                    ':hover': {
                        color: 'white',
                    },
                }}
            >
                Login
            </Button>
        )
    )
}

export default LoginButton
