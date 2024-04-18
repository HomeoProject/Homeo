import { useAuth0 } from '@auth0/auth0-react'
import { Outlet, NavLink } from 'react-router-dom'
import ErrorPage from './ErrorPage'
import '../style/scss/AdminPanelPage.scss'
// import UsersAutocomplete from '../Components/UsersAutocomplete'
import { useState, useEffect } from 'react'
import { useDictionaryContext } from '../Context/DictionaryContext'
import { checkIfUserHasPermission } from '../Auth0/auth0Helpers.ts'
import LoadingSpinner from '../Components/LoadingSpinner.tsx'

const AdminPanel = () => {
  const { isAuthenticated } = useAuth0()
  const { getAccessTokenSilently } = useAuth0()
  const [isUserAdmin, setIsUserAdmin] = useState<boolean | null>(null)

  useEffect(() => {
    const checkIfUserIsAdmin = async () => {
      const token = await getAccessTokenSilently()
      const isAdmin = checkIfUserHasPermission(token, 'admin')
      setIsUserAdmin(isAdmin)
    }
    checkIfUserIsAdmin()
  }, [getAccessTokenSilently])

  const { dictionary } = useDictionaryContext()

  if (isUserAdmin === null) {
    return (
      <div className="AdminPanelPage">
        <LoadingSpinner />
      </div>
    )
  }

  if (!isUserAdmin) {
    return (
      <div className="AdminPanelPage">
        <ErrorPage error={dictionary.errorPageMessage} />
      </div>
    )
  }

  return isAuthenticated ? (
    <div className="AdminPanelPage">
      <div className='admin-panel-nav'>
        <NavLink 
          to='/admin-panel'
          className={({ isActive }) => {return isActive ? 'admin-panel-nav-link active' : 'admin-panel-nav-link'}} 
          end
        >
          Users
        </NavLink>
        <NavLink 
          to='/admin-panel/categories' 
          className={({ isActive }) => {return isActive ? 'admin-panel-nav-link active' : 'admin-panel-nav-link'}}   
          end
        >
          Categories
        </NavLink>
      </div>
      <Outlet/>
    </div>
  ) : (
    <ErrorPage error={dictionary.errorPageMessage} />
  )
}

export default AdminPanel
