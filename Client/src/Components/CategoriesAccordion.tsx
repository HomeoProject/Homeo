import React from 'react'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Button from '@mui/material/Button'
import CategoryFormModal from '../Components/CategoryFormModal'
import { Category } from '../types/types'
import '../style/scss/components/CategoriesAccordion.scss'

type CategoriesAccordionProps = {
  categories: Category[]
  deleteCategory: (id: number) => void
  handler: (newCategory: {name: string, description: string}, id?: number) => void
}

const CategoriesAccordion = ({
  categories,
  deleteCategory,
  handler,
}: CategoriesAccordionProps) => {
  return (
    <div className="CategoriesAccordion">
      {categories.map((category) => {
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
                  <img
                    src={category.image}
                    alt="category-photo"
                    className="categories-accordion-details-image"
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
                        Description:
                      </span>
                      <span>{category.description}</span>
                    </div>
                  </div>
                </div>
                <div className="categories-accordion-details-actions">
                  <CategoryFormModal 
                    category={category}
                    handler={handler}
                    label="Edit"
                  />
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => deleteCategory(category.id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </AccordionDetails>
          </Accordion>
        )
      })}
    </div>
  )
}

export default CategoriesAccordion
