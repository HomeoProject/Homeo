import { useState, useEffect } from 'react'
import { TextField } from '@mui/material'
import { useSearchParams, useNavigate } from 'react-router-dom'
import CategoriesAccordion from './CategoriesAccordion'
import CategoryFormModal from './CategoryFormModal'
import { useDictionaryContext } from '../Context/DictionaryContext'
import { useCategoriesContext } from '../Context/CategoriesContext'
import { Category } from '../types/types'
import { setAuthToken } from '../AxiosClients/apiClient.ts'
import Swal from 'sweetalert2'
import apiClient from '../AxiosClients/apiClient'
import { toast } from 'react-toastify'
import Pagination from '@mui/material/Pagination'
import { useAuth0 } from '@auth0/auth0-react'
import LoadingSpinner from './LoadingSpinner.tsx'
import '../style/scss/components/CategoriesAdminSearch.scss'

const CategoriesAdminSearch = () => {
  const { categories, setCategories } = useCategoriesContext()
  const { getAccessTokenSilently } = useAuth0()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const [inputValue, setInputValue] = useState<string>('')
  const [categoriesToShow, setCategoriesToShow] = useState<Category[]>([])

  const [page, setPage] = useState<number>(1)
  const [defaultPageNumber, setDefaultPageNumber] = useState<number | null>(
    null
  )
  const [totalPages, setTotalPages] = useState(0)
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(
    null
  )
  const [loading, setLoading] = useState(false)
  const perPage = 5

  useEffect(() => {
    if (searchTimeout) {
      clearTimeout(searchTimeout)
    }
    setLoading(true)
    const timeout = setTimeout(() => {
      const categoriesFliltred = categories.filter((category) =>
        category.name.toLowerCase().includes(inputValue.toLowerCase())
      )

      const categoriesPagination = []

      for (let i = 0; i < categoriesFliltred.length; i += perPage) {
        categoriesPagination.push(categoriesFliltred.slice(i, i + perPage))
      }
      console.log(categoriesPagination, page)
      setTotalPages(categoriesPagination.length)
      setCategoriesToShow(categoriesPagination[page - 1])
      setLoading(false)
    }, 500)

    setSearchTimeout(timeout)
    // eslint-disable-next-line
  }, [categories, inputValue, page])

  useEffect(() => {
    const page = searchParams.get('page')
    if (page !== null) {
      setDefaultPageNumber(parseInt(page))
      setPage(parseInt(page) + 1)
    } else {
      setDefaultPageNumber(0)
    }
    // eslint-disable-next-line
  }, [])

  const handlePageChange = (value: number) => {
    setPage(value)
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

  const handlePagination = (_event: unknown, value: number) => {
    handlePageChange(value)
    navigate(`?page=${value - 1}`)
  }

  const { dictionary } = useDictionaryContext()
  return (
    <div className="CategoryAdmin">
      <h1>Categories</h1>
      <div>
        <TextField
          label="Search for categories..."
          variant="outlined"
          onChange={handleCategoryInputChange}
          fullWidth
        />
        <div>
          {loading ? (
            <LoadingSpinner maxHeight="266px" maxWidth="100vh" />
          ) : (
            <CategoriesAccordion
              categories={categoriesToShow}
              deleteCategory={handleCategoryDelete}
              handler={handleCategoryEdit}
            />
          )}
        </div>
        <div className="category-admin-pagination">
          {defaultPageNumber !== null && (
            <Pagination
              count={totalPages}
              defaultPage={defaultPageNumber + 1}
              color="primary"
              onChange={handlePagination}
            />
          )}
        </div>
        <div className="admin-panel-add">
          <CategoryFormModal
            handler={handleCategoryAdd}
            label="Add Category +"
          />
        </div>
      </div>
    </div>
  )
}

export default CategoriesAdminSearch
