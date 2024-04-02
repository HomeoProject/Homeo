import { useAuth0 } from '@auth0/auth0-react'
import ErrorPage from './ErrorPage'
import apiClient from '../AxiosClients/apiClient'
import '../style/scss/AdminPanelPage.scss'
import { TextField } from '@mui/material'
import { useCategoriesContext } from '../Context/CategoriesContext'
import { Category } from '../types/types'
// import UsersAutocomplete from '../Components/UsersAutocomplete'
import { useState, useEffect } from 'react'
import CategoriesAccordion from '../Components/CategoriesAccordion'
import CategoryFormModal from '../Components/CategoryFormModal'
import Swal from 'sweetalert2'
import { setAuthToken } from '../AxiosClients/apiClient.ts'

const AdminPanel = () => {
  const { isAuthenticated } = useAuth0()
  const { categories, setCategories } = useCategoriesContext()
  const { getAccessTokenSilently } = useAuth0()

  const [inputValue, setInputValue] = useState<string>('')
  const [categoriesToShow, setCategoriesToShow] = useState<Category[]>([])

  useEffect(() => {
    if (inputValue === '' || inputValue.length < 3) {
      setCategoriesToShow([])
      return
    }
    console.log(categories)
    // const categoriesFliltred = categories.filter(category => category.name.toLowerCase().includes(inputValue.toLowerCase()))
    const categoriesFliltred = categories
    setCategoriesToShow(categoriesFliltred)
  }, [inputValue])

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
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!',
      }).then((result) => {
        if (result.isConfirmed) {
          apiClient.delete(`/constructors/categories/${id}`)
          const deletedCategory = categories.filter(
            (category) => category.id !== id
          )
          setCategories(deletedCategory)
          setCategoriesToShow(deletedCategory)
          Swal.fire({
            title: 'Deleted!',
            text: 'Your file has been deleted.',
            icon: 'success',
          })
        }
      })
    } catch (error) {
      console.error(error)
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
      Swal.fire({
        icon: 'success',
        title: 'Your work has been saved',
        showConfirmButton: false,
        timer: 1500,
      })
    } catch (error) {
      console.error(error)
    }
  }

  const handleCategoryAdd = async (newCategory: {
    name: string
    description: string
  }) => {
    try {
      const token = await getAccessTokenSilently()
      setAuthToken(token)
      const createdCategory = await apiClient.post('/constructors/categories', {
        name: newCategory.name,
        description: newCategory.description,
      })
      const newCategoryList = [...categories, createdCategory.data]
      setCategories(newCategoryList)
      setCategoriesToShow(newCategoryList)
      Swal.fire({
        icon: 'success',
        title: 'Your work has been saved',
        showConfirmButton: false,
        timer: 1500,
      })
    } catch (error) {
      console.error(error)
    }
  }

  return isAuthenticated ? (
    <div className="AdminPanelPage">
      <h1>Users</h1>
      <div>
        {/* <UsersAutocomplete onSelectUser={setSelectedUser}/>
        {selectedUser} */}
      </div>
      <h1>Categories</h1>
      <div>
        <TextField
          label="Search for category..."
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
          <CategoryFormModal handler={handleCategoryAdd} label="+" />
        </div>
      </div>
    </div>
  ) : (
    <ErrorPage error="You are not authorized to view this page." />
  )
}

export default AdminPanel
