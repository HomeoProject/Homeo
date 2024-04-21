import { useAuth0 } from '@auth0/auth0-react'
import { Link } from 'react-router-dom'
import { useDictionaryContext } from '../Context/DictionaryContext'
import { useEffect, useState } from 'react'
import { checkIfUserHasPermission } from '../Auth0/auth0Helpers'

const AdminPanelLink = () => {
  const { isAuthenticated, getAccessTokenSilently } = useAuth0()
  const [isUserAdmin, setIsUserAdmin] = useState(false)
  const { dictionary } = useDictionaryContext()

  useEffect(() => {
    if (!isAuthenticated) return
    const checkIfUserIsAdmin = async () => {
      const token = await getAccessTokenSilently()
      const isAdmin = checkIfUserHasPermission(token, 'admin')
      setIsUserAdmin(isAdmin)
    }
    checkIfUserIsAdmin()
  }, [getAccessTokenSilently, isAuthenticated])

  return (
    isUserAdmin && (
      <Link className="header-nav-normal-right-link-special" to="/admin-panel">
        {dictionary.adminPanel}
      </Link>
    )
  )
}

export default AdminPanelLink
