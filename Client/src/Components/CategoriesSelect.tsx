import {
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Checkbox,
    ListItemText,
} from '@mui/material'
import { useCategoriesContext } from '../Context/CategoriesContext' // Corrected typo in the hook name
import { SelectChangeEvent } from '@mui/material/Select'
import { Category, SelectedCategory } from '../types/types'

interface CategoriesSelectProps {
    selectedCategories: string[]
    setSelectedCategories: (categories: string[]) => void
    categoriesErrorMessage: string
}

const CategoriesSelect = ({
    selectedCategories,
    setSelectedCategories,
    categoriesErrorMessage,
}: CategoriesSelectProps) => {
    const { categories } = useCategoriesContext()

    const maximumCategoriesLimit = 10

    const handleCategoryChange = (
        event: SelectChangeEvent<typeof selectedCategories>
    ) => {
        const value = event.target.value
        if (value.length > maximumCategoriesLimit) {
            return
        }
        setSelectedCategories(
            typeof value === 'string' ? value.split(',') : value
        )
    }

    return (
        <>
            <FormControl fullWidth error={categoriesErrorMessage !== ''}>
                <InputLabel
                    id="categories-label"
                    shrink={true}
                    sx={{ backgroundColor: 'white', padding: '0 5px' }}
                >
                    Categories you work in (max 2)
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
                            .filter((cat: SelectedCategory) =>
                                selected.includes(cat.id)
                            )
                            .map((cat: SelectedCategory) => cat.name)
                            .join(', ')
                    }
                    MenuProps={{ disableScrollLock: true }}
                >
                    {categories.map((category: Category) => (
                        <MenuItem key={category.id} value={category.id}>
                            <Checkbox
                                checked={
                                    selectedCategories.indexOf(category.id) > -1
                                }
                            />
                            <ListItemText primary={category.name} />
                        </MenuItem>
                    ))}
                </Select>
                {selectedCategories.length === 0 && (
                    <p className="select-placeholder">
                        Choose categories you are working in...
                    </p>
                )}
                {categoriesErrorMessage && (
                    <p className="error-message">{categoriesErrorMessage}</p>
                )}
            </FormControl>
        </>
    )
}

export default CategoriesSelect
