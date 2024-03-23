import { useAuth0 } from '@auth0/auth0-react'
import ErrorPage from './ErrorPage'

const AdminPanel = () => {
  const { isAuthenticated } = useAuth0()

  return isAuthenticated ? (
    <div>
      <h1>Admin Panel</h1>
    </div>
  ) : (
    <ErrorPage error="You are not authorized to view this page." />
  )
}

export default AdminPanel
