import { useAuth0 } from '@auth0/auth0-react'
import { Link } from 'react-router-dom'
import { useDictionaryContext } from '../Context/DictionaryContext'

const AdminPanelLink = () => {
  const { isAuthenticated } = useAuth0()
  const { dictionary } = useDictionaryContext()

  return (
    isAuthenticated && (
      <Link className="header-nav-normal-right-link-special" to="/admin-panel">
        {dictionary.adminPanel}
      </Link>
    )
  )
}

export default AdminPanelLink
