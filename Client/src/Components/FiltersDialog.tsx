import Dialog from '@mui/material/Dialog'

export interface FiltersDialogProps {
    open: boolean
    handleClose: () => void
}

const FiltersDialog = (props: FiltersDialogProps) => {
    const { open, handleClose } = props

    return (
        <Dialog
            onClose={handleClose}
            open={open}
            maxWidth={'xl'}
            className="dialog"
        >
            <div style={{backgroundColor: 'white'}}>
                bla bla
            </div>
        </Dialog>
    )
}

export default FiltersDialog
