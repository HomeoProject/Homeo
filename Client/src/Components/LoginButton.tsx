import { useAuth0 } from '@auth0/auth0-react'
import { useDictionaryContext } from '../Context/DictionaryContext'
import Button from '@mui/material/Button'

const LoginButton = () => {
  const { loginWithRedirect, isLoading } = useAuth0()
  const { dictionary } = useDictionaryContext()

  return (
    !isLoading && (
      <Button
        variant="contained"
        onClick={() => loginWithRedirect()}
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
        {dictionary.loginWord}
      </Button>
    )
  )
}

export default LoginButton
