import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
} from '@mui/material'
import { useCategoriesContext } from '../Context/CategoriesContext'
import { SelectChangeEvent } from '@mui/material/Select'
import { Category, SelectedCategory } from '../types/types'
import { useDictionaryContext } from '../Context/DictionaryContext'

interface CategoriesSelectProps {
  selectedCategories: number[]
  setSelectedCategories: (categories: number[]) => void
  categoriesErrorMessage: string
}

const CategoriesSelect = ({
  selectedCategories,
  setSelectedCategories,
  categoriesErrorMessage,
}: CategoriesSelectProps) => {
  const { categories } = useCategoriesContext()
  const { dictionary } = useDictionaryContext()

  const maximumCategoriesLimit = 10

  const handleCategoryChange = (
    event: SelectChangeEvent<typeof selectedCategories>
  ) => {
    const value = event.target.value
    if (value.length > maximumCategoriesLimit) {
      return
    }
    setSelectedCategories(value as number[])
  }

  return (
    <>
      <FormControl fullWidth error={categoriesErrorMessage !== ''}>
        <InputLabel
          id="categories-label"
          shrink={true}
          sx={{ backgroundColor: 'white', padding: '0 5px' }}
        >
          {dictionary.categoriesYouWorkIn}
        </InputLabel>
        <Select
          labelId="categories-label"
          id="categories-select"
          multiple
          value={selectedCategories}
          onChange={handleCategoryChange}
          renderValue={(selected) =>
            // Map selected category IDs to names for display
            categories
              .filter((cat: SelectedCategory) => selected.includes(cat.id))
              .map((cat: SelectedCategory) => cat.name)
              .join(', ')
          }
          MenuProps={{
            disableScrollLock: true,
            PaperProps: {
              style: {
                maxHeight: 200,
              },
            },
          }}
        >
          {categories.map((category: Category) => (
            <MenuItem key={category.id} value={category.id}>
              <Checkbox
                checked={selectedCategories.indexOf(category.id) > -1}
              />
              <ListItemText primary={category.name} />
            </MenuItem>
          ))}
        </Select>
        {selectedCategories.length === 0 && (
          <p className="select-placeholder">{dictionary.chooseCategories}</p>
        )}
      </FormControl>
    </>
  )
}

export default CategoriesSelect
