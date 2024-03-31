import '../style/scss/components/CategoryFormModal.scss'
import {useState} from 'react'
import { Category } from '../types/types'
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Card from '@mui/material/Card';
import TextField from '@mui/material/TextField';

type CategoryFormModalProps = {
    category: Category,
    editCategory: (id: number, newCategory: {name: string, description: string}) => void
}

const CategoryFormModal = ({category, editCategory}: CategoryFormModalProps) => {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState(category.name)
    const [description, setDescription] = useState(category.description)

    const handleClickOpen = () => {
        setOpen(true);
      };
    
      const handleClose = () => {
        setOpen(false);
      };

      const handleEdit = () => {
        editCategory(category.id, {name, description})
        setOpen(false)
      }

      const handleClear = () => {
        setName('')
        setDescription('')
      }

    return (
        <>
        <Button variant="contained" onClick={handleClickOpen}>
            Edit
        </Button>
        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <Card sx={{minWidth: 500}}>
                <div className='category-form'>
                    <div className='category-form-exit'>
                        <span className='category-form-exit-value' onClick={handleClose}>
                            X
                        </span>
                    </div>
                    <TextField 
                        className='category-form-input' 
                        label="Name" 
                        variant="outlined"
                        onChange={(e) => setName(e.target.value)} 
                        value={name}
                    />
                    <TextField
                        className='category-form-input'
                        label="Description"
                        variant="outlined"
                        multiline
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={5}
                    />
                    <div className='category-form-actions'>
                        <Button variant="contained" onClick={handleClear}>Clear</Button>
                        <Button variant="contained" onClick={handleEdit}>Save</Button>
                    </div>
                </div>
            </Card>
        </Dialog>
      </>
    )
}

export default CategoryFormModal
