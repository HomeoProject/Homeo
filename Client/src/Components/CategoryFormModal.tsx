import '../style/scss/components/CategoryFormModal.scss'
import { useState } from 'react'
import { Category } from '../types/types'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import Card from '@mui/material/Card'
import TextField from '@mui/material/TextField'
import defaultCategory from '../Assets/default-category.svg'
import UserAvatar from './UserAvatar'

type CategoryFormModalProps = {
  category?: Category
  handler: (
    newCategory: { name: string; description: string },
    id?: number
  ) => void
  label: string
}

const CategoryFormModal = ({
  category,
  handler,
  label,
}: CategoryFormModalProps) => {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState(category?.name ? category.name : '')
  const [description, setDescription] = useState(
    category?.description ? category.description : ''
  )

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleAction = () => {
    handler({ name, description }, category?.id)
    setOpen(false)
  }

  const handleClear = () => {
    setName('')
    setDescription('')
  }

  return (
    <>
      <Button variant="contained" onClick={handleClickOpen} fullWidth>
        {label}
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        sx={{ width: '100%' }}
      >
        <Card sx={{ maxWidth: 500, width: '100%' }}>
          <div className="category-form">
            <div className="category-form-exit">
              <span className="category-form-exit-value" onClick={handleClose}>
                X
              </span>
            </div>
            {label !== '+' && (
              <UserAvatar
                src={category?.image || defaultCategory}
                alt="category-photo"
                variant="standard"
                isApproved={false}
                maxHeight="15rem"
                maxWidth="15rem"
              />
            )}
            <TextField
              className="category-form-input"
              label="Name"
              variant="outlined"
              onChange={(e) => setName(e.target.value)}
              value={name}
            />
            <TextField
              className="category-form-input"
              label="Description"
              variant="outlined"
              multiline
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
            />
            <div className="category-form-actions">
              <Button variant="contained" onClick={handleClear}>
                Clear
              </Button>
              <Button variant="contained" onClick={handleAction}>
                Save
              </Button>
            </div>
          </div>
        </Card>
      </Dialog>
    </>
  )
}

export default CategoryFormModal
