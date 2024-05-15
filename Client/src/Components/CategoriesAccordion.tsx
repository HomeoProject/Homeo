import { useState } from 'react'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Button from '@mui/material/Button'
import CategoryFormModal from '../Components/CategoryFormModal'
import { Category } from '../types/types'
import '../style/scss/components/CategoriesAccordion.scss'
import UploadPictureModal from './UploadPictureModal'
import apiClient from '../AxiosClients/apiClient'
import UserAvatar from './UserAvatar'
import { useDictionaryContext } from '../Context/DictionaryContext'

type CategoriesAccordionProps = {
  categories: Category[]
  deleteCategory: (id: number) => void
  handler: (
    newCategory: { name: string; description: string },
    id?: number
  ) => void
}

const CategoriesAccordion = ({
  categories,
  deleteCategory,
  handler,
}: CategoriesAccordionProps) => {
  const [openModalId, setOpenModalId] = useState<number | null>(null)

  const handleOpenModal = (id: number) => {
    setOpenModalId(id)
  }

  const handleCloseModal = () => {
    setOpenModalId(null)
  }

  const { dictionary } = useDictionaryContext()

  return (
    <div className="CategoriesAccordion">
      {categories ? (
        categories.map((category) => {
          return (
            <Accordion key={category.id}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1-content"
                id="panel1-header"
              >
                <div className="categories-accordion-label">
                  <img
                    className="categories-accordion-label-image"
                    src={category.image}
                    alt="category-photo"
                  />
                  {category.name}
                </div>
              </AccordionSummary>
              <AccordionDetails>
                <div className="categories-accordion-details">
                  <div className="categories-accordion-details-container">
                    <UserAvatar
                      src={category.image}
                      alt="Category"
                      isApproved={false}
                      variant="category"
                      maxHeight="9rem"
                      maxWidth="16rem"
                      customOnClick={() => handleOpenModal(category.id)}
                    />
                    <div className="categories-accordion-details-fields">
                      <div className="categories-accordion-details-fields-container name">
                        <span className="categories-accordion-details-fields-container-key">
                          Name:
                        </span>
                        <span>{category.name}</span>
                      </div>
                      <div className="categories-accordion-details-fields-container">
                        <span className="categories-accordion-details-fields-container-key">
                          {dictionary.descriptionWord}:
                        </span>
                        <span>{category.description}</span>
                      </div>
                    </div>
                  </div>
                  <div className="categories-accordion-details-actions">
                    <CategoryFormModal
                      category={category}
                      handler={handler}
                      label={dictionary.editWord}
                    />
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => deleteCategory(category.id)}
                    >
                      {dictionary.deleteWord}
                    </Button>
                  </div>
                </div>
              </AccordionDetails>
              <UploadPictureModal
                open={openModalId === category.id}
                handleClose={() => handleCloseModal()}
                minHeight={200}
                minWidth={200}
                maxSize={2}
                client={apiClient}
                path={`/constructors/categories/image/${category.id}`}
                method="put"
                customInitSource={category.image}
                customHeadline={dictionary.changeCategoryImage}
                aspectRatio="rectangle"
              />
            </Accordion>
          )
        })
      ) : (
        <div className="categories-accordion-exaption">
          {dictionary.noCategoriesFound}
        </div>
      )}
    </div>
  )
}

export default CategoriesAccordion
