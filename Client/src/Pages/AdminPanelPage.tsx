import { useAuth0 } from '@auth0/auth0-react'
import ErrorPage from './ErrorPage'
import '../style/scss/AdminPanelPage.scss'

const AdminPanel = () => {
  const { isAuthenticated } = useAuth0()

  return isAuthenticated ? (
    <div className="AdminPanelPage">
      <h1></h1>
    </div>
  ) : (
    <ErrorPage error="You are not authorized to view this page." />
  )
}

export default AdminPanel
