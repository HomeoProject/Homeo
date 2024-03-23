import { useAuth0 } from '@auth0/auth0-react'
import { Link } from 'react-router-dom'

const AdminPanelLink = () => {
  const { isAuthenticated } = useAuth0()

  return (
    isAuthenticated && (
      <Link className="header-nav-normal-right-link-special" to="/admin-panel">
        Admin Panel
      </Link>
    )
  )
}

export default AdminPanelLink
