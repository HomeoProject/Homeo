import { Box, Button, Modal, Typography } from '@mui/material'
import { ChangeEvent, useEffect, useRef, useState } from 'react'
import { useUserContext } from '../Context/UserContext'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import { TextField } from '@mui/material'
import { useAuth0 } from '@auth0/auth0-react'
import Cropper, { ReactCropperElement } from 'react-cropper'
import 'cropperjs/dist/cropper.css'
import '../style/scss/components/ChangeAvatarModal.scss'
import { Warning } from '@mui/icons-material'
import {
    avatarModalStyle,
    cropperBoxStyle,
    saveButtonStyle,
    titleTypographyStyle,
    errorMessageTypographyStyle,
    closeModalContainerStyle,
} from '../style/scss/muiComponents/ChangeAvatarModal.ts'
import CloseIcon from '@mui/icons-material/Close'

type ChangeAvatarModalProps = {
    open: boolean
    handleClose: () => void
}

const ChangeAvatarModal = ({ open, handleClose }: ChangeAvatarModalProps) => {
    const { customUser, setCustomUser } = useUserContext()
    const { getAccessTokenSilently } = useAuth0()
    const [errorMessage, setErrorMessage] = useState('')
    const [imgSrc, setImgSrc] = useState('')

    const internalHandleClose = () => {
        handleClose()
        customUser && setImgSrc(customUser?.avatar)
        setErrorMessage('')
    }

    function getFileExtension(filename: string) {
        const parts = filename.split('.')
        return parts[parts.length - 1]
    }

    function isImage(filename: string) {
        const ext = getFileExtension(filename)
        switch (ext.toLowerCase()) {
            case 'jpg':
            case 'svg':
            case 'png':
            case 'jpeg':
                return true
        }

        return false
    }

    const { register, handleSubmit } = useForm()

    useEffect(() => {
        if (customUser?.avatar) {
            setImgSrc(customUser.avatar)
        }
    }, [customUser])

    const cropperRef = useRef<ReactCropperElement>(null)

    const onSubmit = async () => {
        const token = await getAccessTokenSilently()
        const cropper = cropperRef.current?.cropper
        if (customUser && cropper) {
            const canvas = cropper.getCroppedCanvas()
            const dataURL = canvas.toDataURL('image/jpeg', 0.5)
            const blob = dataURItoBlob(dataURL)
            const formData = new FormData(document.forms[0])
            formData.append('file', blob)
            axios
                .patch(
                    `http://localhost:8080/api/users/avatar/${customUser.id}`,
                    formData,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'multipart/form-data',
                        },
                    }
                )
                .then((response) => {
                    internalHandleClose()
                    setCustomUser({
                        ...customUser,
                        avatar: response.data.avatar,
                    })
                })
                .catch((error) => {
                    console.log(error)
                    setErrorMessage('Error while uploading file')
                })
        }
    }

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]

        if (file && isImage(file.name)) {
            const image = new Image()
            image.src = URL.createObjectURL(file)

            image.onload = () => {
                if (image.width < 200 || image.height < 200) {
                    setErrorMessage('Image must be at least 200x200 pixels')
                    return
                }

                // If the image dimensions are valid, set the image source
                const reader = new FileReader()
                reader.onload = () => {
                    setImgSrc(reader.result as string)
                }
                reader.readAsDataURL(file)
            }
        } else {
            setErrorMessage('Unsupported file type')
        }
    }

    function dataURItoBlob(dataURI: string) {
        let byteString
        if (dataURI.split(',')[0].indexOf('base64') >= 0)
            byteString = atob(dataURI.split(',')[1])
        else byteString = unescape(dataURI.split(',')[1])

        const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]

        const ia = new Uint8Array(byteString.length)
        for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i)
        }

        return new Blob([ia], { type: mimeString })
    }

    return (
        <Modal
            open={open}
            onClose={internalHandleClose}
            className="change-avatar-modal"
        >
            <Box sx={avatarModalStyle}>
                <Box sx={closeModalContainerStyle}>
                    <Typography
                        id="modal-modal-title"
                        variant="h6"
                        component="h2"
                        sx={titleTypographyStyle}
                    >
                        Change your profile picture
                    </Typography>
                    <button
                        onClick={internalHandleClose}
                        className="close-modal-button"
                    >
                        <CloseIcon className="close-icon"></CloseIcon>
                    </button>
                </Box>
                <Box sx={cropperBoxStyle}>
                    <Cropper
                        src={imgSrc}
                        style={{ height: 400, width: '100%' }}
                        initialAspectRatio={1}
                        aspectRatio={1}
                        guides={false}
                        ref={cropperRef}
                        viewMode={1}
                        max={1}
                        autoCropArea={1}
                        cropBoxResizable={false}
                        cropBoxMovable={true}
                        dragMode="none"
                    />
                </Box>
                <Typography
                    id="modal-modal-error"
                    variant="body1"
                    sx={errorMessageTypographyStyle}
                >
                    {<Warning></Warning> && errorMessage}
                </Typography>
                <Box>
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="modal-form"
                    >
                        <TextField
                            type="file"
                            {...register('file')}
                            onChange={handleChange}
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            sx={saveButtonStyle}
                        >
                            Save
                        </Button>
                    </form>
                </Box>
            </Box>
        </Modal>
    )
}

export default ChangeAvatarModal
