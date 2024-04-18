import {useState, useEffect} from 'react'
import UserAccordion from '../Components/UsersAccordion'
import { TextField } from '@mui/material'
import Button from '@mui/material/Button'
import RefreshIcon from '@mui/icons-material/Refresh'
import { useAuth0 } from '@auth0/auth0-react'
import { CustomUser } from '../types/types'
import { setAuthToken } from '../AxiosClients/apiClient.ts'
import apiClient from '../AxiosClients/apiClient'
import Swal from 'sweetalert2'
import { toast } from 'react-toastify'
import { useDictionaryContext } from '../Context/DictionaryContext'

const UserAdminSearch = () => {
  const { getAccessTokenSilently } = useAuth0()
  const { dictionary } = useDictionaryContext()

  const [idInputValue, setIdInputValue] = useState<string>('')
  const [nameInputValue, setNameInputValue] = useState<string>('')
  const [lastNameInputValue, setLastNameInputValue] = useState<string>('')
  const [phoneNumberInputValue, setPhoneNumberInputValue] = useState<string>('')
  const [emailInputValue, setEmailInputValue] = useState<string>('')
  const [pageNumber, setPageNumber] = useState<number>(0)
  const [pageCount, setPageCount] = useState<number>(0)
  const [users, setUsers] = useState<CustomUser[]>([])

    useEffect(() => {
        const getUsers = async () => {
          try {
            const token = await getAccessTokenSilently()
            setAuthToken(token)
            const response = await apiClient.post(`/users/search?page=0&size=5`, {
              id: idInputValue || null,
              firstName: nameInputValue || null,
              lastName: lastNameInputValue || null,
              phoneNumber: phoneNumberInputValue || null,
              email: emailInputValue || null,
            })
            setPageNumber(response.data.number)
            setPageCount(response.data.totalPages)
            setUsers(response.data.content)
          } catch (error) {
            console.error(error)
          }
        }
    
        if (
          idInputValue.length < 3 &&
          nameInputValue.length < 3 &&
          lastNameInputValue.length < 3 &&
          phoneNumberInputValue.length < 3 &&
          emailInputValue.length < 3
        ) {
          setUsers([])
          return
        }
    
        getUsers()
      }, [
        idInputValue,
        nameInputValue,
        lastNameInputValue,
        phoneNumberInputValue,
        emailInputValue,
        getAccessTokenSilently,
      ])
    
      const getUsersByPage = async (page: number) => {
        try {
          const token = await getAccessTokenSilently()
          setAuthToken(token)
          const response = await apiClient.post(
            `/users/search?page=${page}&size=5`,
            {
              id: idInputValue,
              firstName: nameInputValue,
              lastName: lastNameInputValue,
              phoneNumber: phoneNumberInputValue,
              email: emailInputValue,
            }
          )
    
          setUsers([...users, ...response.data.content])
        } catch (error) {
          console.error(error)
        }
      }
    
      const handleUserDelete = async (id: string) => {
        try {
          const token = await getAccessTokenSilently()
          setAuthToken(token)
          Swal.fire({
            title: dictionary.areYouSure,
            text: dictionary.youWillNotBeAbleToRevert,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: dictionary.yesDeleteIt,
          }).then((result) => {
            if (result.isConfirmed) {
              apiClient.delete(`/users/${id}`)
              const deletedUser = users.filter((user) => user.id !== id)
              setUsers(deletedUser)
              toast.success(dictionary.userDeletedSuccessfully)
            }
          })
        } catch (error) {
          console.error(error)
          toast.error(dictionary.failedToDeleteUser)
        }
      }
    
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
  return (
    <div>
      <h1>Users</h1>
      <div>
        <div className="admin-panel-users-search">
          <TextField
            className="admin-panel-users-search-id"
            label="Search for users by id..."
            variant="outlined"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setIdInputValue(e.target.value)
            }
            fullWidth
          />
          <TextField
            label="Search for users by name..."
            variant="outlined"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setNameInputValue(e.target.value)
            }
            fullWidth
          />
          <TextField
            label="Search for users by last name..."
            variant="outlined"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setLastNameInputValue(e.target.value)
            }
            fullWidth
          />
          <TextField
            label="Search for users by phone number..."
            variant="outlined"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setPhoneNumberInputValue(e.target.value)
            }
            fullWidth
          />
          <TextField
            label="Search for users by email..."
            variant="outlined"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setEmailInputValue(e.target.value)
            }
            fullWidth
          />
        </div>
        <div>
          <UserAccordion
            users={users}
            handleApporveUser={handleUserApprove}
            handleDeleteUser={handleUserDelete}
            handleBlockUser={handleBlockUser}
          />
        </div>
        <div className="admin-panel-load-more">
          {pageNumber < pageCount && pageCount > 1 && (
            <Button
              fullWidth
              variant="contained"
              onClick={() => getUsersByPage(pageNumber + 1)}
            >
              Load more&nbsp;
              <RefreshIcon />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

export default UserAdminSearch
