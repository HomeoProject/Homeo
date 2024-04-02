import '../style/scss/components/CategoryFormModal.scss'
import {useState} from 'react'
import { Category } from '../types/types'
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Card from '@mui/material/Card';
import TextField from '@mui/material/TextField';
import UploadPictureModal from './UploadPictureModal';
import apiClient from '../AxiosClients/apiClient';

type CategoryFormModalProps = {
    category?: Category,
    handler: (newCategory: {name: string, description: string}, id?: number) => void,
    label: string
}

const CategoryFormModal = ({category, handler, label}: CategoryFormModalProps) => {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState((category?.name) ? category.name : '')
    const [description, setDescription] = useState((category?.description) ? category.description : '')

    const [openPictureModal, setOpenPictureModal] = useState(false)

    const handleClickOpen = () => {
        setOpen(true);
      };
    
      const handleClose = () => {
        setOpen(false);
      };

      const handleAction = () => {
        handler({name, description}, category?.id)
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
        >
            <Card sx={{minWidth: 500}}>
                <div className='category-form'>
                    <div className='category-form-exit'>
                        <span className='category-form-exit-value' onClick={handleClose}>
                            X
                        </span>
                    </div>
                    {label !== "+" && 
                    <>
                        <UploadPictureModal
                            open={openPictureModal}
                            handleClose={() => setOpenPictureModal(false)}
                            minHeight={200}
                            minWidth={200}
                            maxSize={1}
                            client={apiClient}
                            path={`/constructors/categories/image/${category?.id}`}
                            method='put'
                        />  
                        <div className="category-form-image">
                            <img
                                src={category?.image}
                                alt="category-photo"
                                className='category-form-image-value'
                                onClick={() => setOpenPictureModal(true)}
                            />
                        </div>
                    </>
                    }
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
                        <Button variant="contained" onClick={handleAction}>Save</Button>
                    </div>
                </div>
            </Card>
        </Dialog>
      </>
    )
}

export default CategoryFormModal
