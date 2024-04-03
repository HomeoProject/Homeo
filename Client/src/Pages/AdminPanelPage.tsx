import { useAuth0 } from '@auth0/auth0-react'
import ErrorPage from './ErrorPage'
import '../style/scss/AdminPanelPage.scss'
import { useDictionaryContext } from '../Context/DictionaryContext'

const AdminPanel = () => {
  const { isAuthenticated } = useAuth0()

  const { dictionary } = useDictionaryContext()

  return isAuthenticated ? (
    <div className="AdminPanelPage">
      <h1></h1>
    </div>
  ) : (
    <ErrorPage error={dictionary.errorPageMessage} />
  )
}

export default AdminPanel
