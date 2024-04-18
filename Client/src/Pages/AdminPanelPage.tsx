import { useAuth0 } from '@auth0/auth0-react'
import ErrorPage from './ErrorPage'
import apiClient from '../AxiosClients/apiClient'
import '../style/scss/AdminPanelPage.scss'
import { TextField } from '@mui/material'
import { useCategoriesContext } from '../Context/CategoriesContext'
import { Category } from '../types/types'
import { CustomUser } from '../types/types'
import Button from '@mui/material/Button'
// import UsersAutocomplete from '../Components/UsersAutocomplete'
import { useState, useEffect } from 'react'
import CategoriesAccordion from '../Components/CategoriesAccordion'
import UserAccordion from '../Components/UsersAccordion'
import CategoryFormModal from '../Components/CategoryFormModal'
import Swal from 'sweetalert2'
import { setAuthToken } from '../AxiosClients/apiClient.ts'
import RefreshIcon from '@mui/icons-material/Refresh'
import { useDictionaryContext } from '../Context/DictionaryContext'
import { checkIfUserHasPermission } from '../Auth0/auth0Helpers.ts'
import LoadingSpinner from '../Components/LoadingSpinner.tsx'
import { toast } from 'react-toastify'

const AdminPanel = () => {
  const { isAuthenticated } = useAuth0()
  const { categories, setCategories } = useCategoriesContext()
  const { getAccessTokenSilently } = useAuth0()

  const [inputValue, setInputValue] = useState<string>('')
  const [categoriesToShow, setCategoriesToShow] = useState<Category[]>([])

  const [idInputValue, setIdInputValue] = useState<string>('')
  const [nameInputValue, setNameInputValue] = useState<string>('')
  const [lastNameInputValue, setLastNameInputValue] = useState<string>('')
  const [phoneNumberInputValue, setPhoneNumberInputValue] = useState<string>('')
  const [emailInputValue, setEmailInputValue] = useState<string>('')
  const [pageNumber, setPageNumber] = useState<number>(0)
  const [pageCount, setPageCount] = useState<number>(0)
  const [users, setUsers] = useState<CustomUser[]>([])
  const [isUserAdmin, setIsUserAdmin] = useState<boolean | null>(null)

  useEffect(() => {
    const checkIfUserIsAdmin = async () => {
      const token = await getAccessTokenSilently()
      const isAdmin = checkIfUserHasPermission(token, 'admin')
      setIsUserAdmin(isAdmin)
    }
    checkIfUserIsAdmin()
  }, [getAccessTokenSilently])

  useEffect(() => {
    if (inputValue === '' || inputValue.length < 3) {
      setCategoriesToShow([])
      return
    }
    const categoriesFliltred = categories.filter((category) =>
      category.name.toLowerCase().includes(inputValue.toLowerCase())
    )
    setCategoriesToShow(categoriesFliltred)
  }, [categories, inputValue])

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

  const handleCategoryInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setInputValue(event.target.value)
  }

  const handleCategoryDelete = async (id: number) => {
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
          apiClient.delete(`/constructors/categories/${id}`)
          const deletedCategory = categories.filter(
            (category) => category.id !== id
          )
          setCategories(deletedCategory)
          setCategoriesToShow(deletedCategory)
          toast.success(dictionary.categoryDeletedSuccessfully)
        }
      })
    } catch (error) {
      console.error(error)
      toast.error(dictionary.failedToDeleteCategory)
    }
  }

  const handleCategoryEdit = async (
    newCategory: { name: string; description: string },
    id?: number
  ) => {
    try {
      const token = await getAccessTokenSilently()
      setAuthToken(token)
      apiClient.put(`/constructors/categories/${id}`, {
        name: newCategory.name,
        description: newCategory.description,
      })
      const editedCategories = categories.map((category) => {
        if (category.id === id) {
          return {
            ...category,
            name: newCategory.name,
            description: newCategory.description,
          }
        }
        return category
      })
      setCategories(editedCategories)
      setCategoriesToShow(editedCategories)
      toast.success(dictionary.categoryEditedSuccessfully)
    } catch (error) {
      console.error(error)
      toast.error(dictionary.failedToEditCategory)
    }
  }

  const handleCategoryAdd = async (newCategory: {
    name: string
    description: string
  }) => {
    try {
      const createdCategory = await apiClient.post('/constructors/categories', {
        name: newCategory.name,
        description: newCategory.description,
      })
      const newCategoryList = [...categories, createdCategory.data]
      setCategories(newCategoryList)
      setCategoriesToShow(newCategoryList)
      toast.success('Category added successfully')
    } catch (error) {
      console.error(error)
      toast.error('Failed to add category')
    }
  }

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
      <h1>Categories</h1>
      <div>
        <TextField
          label="Search for categories..."
          variant="outlined"
          onChange={handleCategoryInputChange}
          fullWidth
        />
        <div>
          <CategoriesAccordion
            categories={categoriesToShow}
            deleteCategory={handleCategoryDelete}
            handler={handleCategoryEdit}
          />
        </div>
        <div className="admin-panel-add">
          <CategoryFormModal
            handler={handleCategoryAdd}
            label="Add Category +"
          />
        </div>
      </div>
    </div>
  ) : (
    <ErrorPage error={dictionary.errorPageMessage} />
  )
}

export default AdminPanel
