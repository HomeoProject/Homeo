import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import UserAccordion from '../Components/UsersAccordion'
import { TextField } from '@mui/material'
import { useAuth0 } from '@auth0/auth0-react'
import { CustomUser } from '../types/types'
import { setAuthToken } from '../AxiosClients/apiClient.ts'
import apiClient from '../AxiosClients/apiClient'
import Swal from 'sweetalert2'
import { toast } from 'react-toastify'
import Pagination from '@mui/material/Pagination'
import { useDictionaryContext } from '../Context/DictionaryContext'
import LoadingSpinner from './LoadingSpinner.tsx'
import '../style/scss/components/UserAdminSearch.scss'

const UserAdminSearch = () => {
  const { getAccessTokenSilently } = useAuth0()
  const { dictionary } = useDictionaryContext()

  const [loading, setLoading] = useState<boolean>(false)
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(
    null
  )
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [idInputValue, setIdInputValue] = useState<string>('')
  const [nameInputValue, setNameInputValue] = useState<string>('')
  const [lastNameInputValue, setLastNameInputValue] = useState<string>('')
  const [phoneNumberInputValue, setPhoneNumberInputValue] = useState<string>('')
  const [emailInputValue, setEmailInputValue] = useState<string>('')
  const [pageNumber, setPageNumber] = useState<number>(0)
  const [defaultPageNumber, setDefaultPageNumber] = useState<number | null>(
    null
  )
  const [totalPages, setTotalPages] = useState<number>(0)
  const [users, setUsers] = useState<CustomUser[]>([])

  useEffect(() => {
    const getUsersByPage = async (page: number) => {
      try {
        const token = await getAccessTokenSilently()
        setAuthToken(token)
        const response = await apiClient.post(
          `/users/search?page=${page}&size=5`,
          {
            id: idInputValue || null,
            firstName: nameInputValue || null,
            lastName: lastNameInputValue || null,
            phoneNumber: phoneNumberInputValue || null,
            email: emailInputValue || null,
          }
        )
        setTotalPages(response.data.totalPages)
        setUsers(response.data.content)
        setLoading(false)
      } catch (error) {
        console.error(error)
      }
    }
    setLoading(true)
    if (searchTimeout) {
      clearTimeout(searchTimeout)
    }
    const timeout = setTimeout(() => {
      getUsersByPage(pageNumber)
    }, 500)
    setSearchTimeout(timeout)
    // eslint-disable-next-line
  }, [
    idInputValue,
    nameInputValue,
    lastNameInputValue,
    phoneNumberInputValue,
    emailInputValue,
    getAccessTokenSilently,
    pageNumber,
  ])

  useEffect(() => {
    const page = searchParams.get('page')
    if (page !== null) {
      setDefaultPageNumber(parseInt(page))
      setPageNumber(parseInt(page))
    } else {
      setDefaultPageNumber(0)
    }
    // eslint-disable-next-line
  }, [])

  const handleUserApprove = async (id: string, isApproved: boolean) => {
    try {
      const token = await getAccessTokenSilently()
      setAuthToken(token)
      Swal.fire({
        title: dictionary.areYouSure,
        text: isApproved
          ? dictionary.doYouWantToApproveThisUser
          : dictionary.doYouWantToDisapproveThisUser,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: isApproved
          ? dictionary.yesApproveUser
          : dictionary.yesDisapproveUser,
      }).then((result) => {
        if (result.isConfirmed) {
          apiClient.patch(`/users/approve/${id}`, {
            isApproved: isApproved,
          })

          const newUsers = users.map((user) => {
            if (user.id === id) {
              return {
                ...user,
                isApproved: isApproved,
              }
            }
            return user
          })
          setUsers(newUsers)
          isApproved
            ? toast.success(dictionary.userDisapprovedSuccessfully)
            : toast.success(dictionary.userApprovedSuccessfully)
        }
      })
    } catch (error) {
      console.error(error)
      toast.error(dictionary.failedToApproveUser)
    }
  }

  const handleBlockUser = async (id: string, isBlocked: boolean) => {
    try {
      const token = await getAccessTokenSilently()
      setAuthToken(token)
      Swal.fire({
        title: dictionary.areYouSure,
        text: isBlocked
          ? dictionary.doYouWantToBlockThisUser
          : dictionary.doYouWantToUnblockThisUser,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: isBlocked
          ? dictionary.yesBlockUser
          : dictionary.yesUnblockUser,
        cancelButtonText: dictionary.cancelWord,
      }).then((result) => {
        if (result.isConfirmed) {
          apiClient.patch(`/users/block/${id}`, {
            isBlocked: isBlocked,
          })
          const newUsers = users.map((user) => {
            if (user.id === id) {
              return {
                ...user,
                isBlocked: isBlocked,
              }
            }
            return user
          })

          setUsers(newUsers)
          isBlocked
            ? toast.success(dictionary.userBlockedSuccessfully)
            : toast.success(dictionary.userUnblockedSuccessfully)
        }
      })
    } catch (error) {
      console.error(error)
      isBlocked
        ? toast.error(dictionary.failedToBlockUser)
        : toast.error(dictionary.failedToUnblockUser)
    }
  }

  const handlePagination = (_event: unknown, value: number) => {
    setPageNumber(value - 1)
    navigate(`?page=${value - 1}`)
  }

  return (
    <div className="userAdmin">
      <h1>Users</h1>
      <div>
        <div className="admin-panel-users-search">
          <TextField
            className="admin-panel-users-search-id"
            label={`${dictionary.searchForUsersBy} id...`}
            variant="outlined"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setIdInputValue(e.target.value)
            }
            fullWidth
          />
          <TextField
            label={`${dictionary.searchForUsersBy} ${dictionary.firstNameWord}...`}
            variant="outlined"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setNameInputValue(e.target.value)
            }
            fullWidth
          />
          <TextField
            label={`${dictionary.searchForUsersBy} ${dictionary.lastNameWord}...`}
            variant="outlined"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setLastNameInputValue(e.target.value)
            }
            fullWidth
          />
          <TextField
            label={`${dictionary.searchForUsersBy} ${dictionary.phoneNumberWord}...`}
            variant="outlined"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setPhoneNumberInputValue(e.target.value)
            }
            fullWidth
          />
          <TextField
            label={`${dictionary.searchForUsersBy} email...`}
            variant="outlined"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setEmailInputValue(e.target.value)
            }
            fullWidth
          />
        </div>
        <div>
          {loading ? (
            <LoadingSpinner maxWidth="100vh" maxHeight="256px" />
          ) : (
            <UserAccordion
              users={users}
              handleApporveUser={handleUserApprove}
              handleBlockUser={handleBlockUser}
            />
          )}
        </div>
        <div className="admin-panel-user-search-pagination">
          {defaultPageNumber !== null ? (
            <Pagination
              count={totalPages}
              color="primary"
              defaultPage={defaultPageNumber + 1}
              onChange={handlePagination}
            />
          ) : (
            ''
          )}
        </div>
      </div>
    </div>
  )
}

export default UserAdminSearch
