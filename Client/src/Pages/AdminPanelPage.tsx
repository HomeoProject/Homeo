import { useAuth0 } from '@auth0/auth0-react'
import ErrorPage from './ErrorPage'
import apiClient from '../AxiosClients/apiClient'
import '../style/scss/AdminPanelPage.scss'
import { TextField } from '@mui/material'
import { useCategoriesContext } from '../Context/CategoriesContext'
import { Category } from '../types/types'
// import UsersAutocomplete from '../Components/UsersAutocomplete'
import {useState, useEffect} from 'react'
import CategoriesAccordion from '../Components/CategoriesAccordion'
import Swal from 'sweetalert2'

const AdminPanel = () => {
  const { isAuthenticated } = useAuth0()
  const { categories, setCategories } = useCategoriesContext()

  const [inputValue, setInputValue] = useState<string>('')
  const [categoriesToShow, setCategoriesToShow] = useState<Category[]>([])

  useEffect(() => {
    if(inputValue === '' || inputValue.length < 3) {
      setCategoriesToShow([])
      return
    }
    console.log(categories)
    // const categoriesFliltred = categories.filter(category => category.name.toLowerCase().includes(inputValue.toLowerCase()))
    const categoriesFliltred = categories
    setCategoriesToShow(categoriesFliltred)
  }, [inputValue])

  const handleCategoryInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value)
  }

  const handleCategoryDelete = (id: number) => {
    try {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
      }).then((result) => {
        if (result.isConfirmed) {
          // apiClient.delete(`/constructors/categories/${id}`)
          const deletedCategory = categories.filter(category => category.id !== id)
          setCategories(deletedCategory)
          setCategoriesToShow(deletedCategory)
          Swal.fire({
            title: "Deleted!",
            text: "Your file has been deleted.",
            icon: "success"
          });
        }
      });
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
          <CategoriesAccordion categories={categoriesToShow} deleteCategory={handleCategoryDelete}/>
        </div>
      </div>
    </div>
  ) : (
    <ErrorPage error="You are not authorized to view this page." />
  )
}

export default AdminPanel
