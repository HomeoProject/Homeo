import { Box, Button, Modal, Typography, styled } from '@mui/material'
import { ChangeEvent, useEffect, useRef, useState } from 'react'
import { useUserContext } from '../Context/UserContext.ts'
import { useDictionaryContext } from '../Context/DictionaryContext'
import { useForm } from 'react-hook-form'
import UploadIcon from '@mui/icons-material/Upload'
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
import LoadingSpinner from './LoadingSpinner.tsx'
import { toast } from 'react-toastify'
import { AxiosInstance } from 'axios'

type UploadPictureModalProps = {
  open: boolean
  minHeight?: number
  minWidth?: number
  maxSize?: number
  client: AxiosInstance
  path: string
  method: 'patch' | 'post' | 'put'
  handleClose: () => void
  customInitSource: string
  setCustomExternalSource?: (source: string) => void
  customHeadline: string
  aspectRatio?: 'square' | 'rectangle'
}

const UploadPictureModal = ({
  open,
  minHeight,
  minWidth,
  maxSize,
  client,
  path,
  method,
  handleClose,
  customInitSource,
  setCustomExternalSource,
  customHeadline,
  aspectRatio = 'square',
}: UploadPictureModalProps) => {
  const { dictionary } = useDictionaryContext()
  const { customUser, setCustomUser } = useUserContext()
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [imgSrc, setImgSrc] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [fileName, setFileName] = useState<string>('')

  const internalHandleClose = () => {
    handleClose()
    customUser && setImgSrc(customInitSource)
    setFileName(dictionary.noFileSelected)
    setErrorMessage('')
    setIsLoading(false)
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

  const cropperRef = useRef<ReactCropperElement>(null)

  const Input = styled('input')({
    display: 'none',
  })

  const onSubmit = async () => {
    if (setCustomExternalSource) {
      setCustomExternalSource(imgSrc)
      internalHandleClose()
      return
    }

    setIsLoading(true)

    const cropper = cropperRef.current?.cropper
    if (customUser && cropper) {
      const canvas = cropper.getCroppedCanvas()
      const dataURL = canvas.toDataURL('image/jpeg', 0.5)
      const blob = dataURItoBlob(dataURL)
      const formData = new FormData()
      formData.append('file', blob)

      client[method](path, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
        .then((response) => {
          internalHandleClose()
          if (response.data.avatar && customUser) {
            setCustomUser({
              ...customUser,
              avatar: response.data.avatar,
            })
          }
          toast.success(dictionary.successfulyUploadedPicture)
        })
        .catch((error) => {
          console.error(error)
          setErrorMessage(dictionary.errorWhileUploadingFile)
          setImgSrc(customInitSource)
        })
        .finally(() => setIsLoading(false))
    } else {
      setErrorMessage(dictionary.authErr)
      setImgSrc(customInitSource)
      setIsLoading(false)
    }
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setIsLoading(true)
    setErrorMessage('')
    const file = e.target.files?.[0]

    if (file && isImage(file.name)) {
      const image = new Image()
      image.src = URL.createObjectURL(file)

      image.onload = () => {
        if (
          image.width < (minWidth || 220) ||
          image.height < (minHeight || 220)
        ) {
          setErrorMessage(
            `${dictionary.imageMustBeAtLeast} ${minWidth || 220}x${minHeight || 220} ${dictionary.pixels}`
          ) // Default: 220x220
          setIsLoading(false)
          return
        }

        const maxSizeInBytes = (maxSize || 1) * 1024 * 1024 // Default: 1MB
        if (file.size > maxSizeInBytes) {
          setErrorMessage(`${dictionary.imageSizeExceeds} (${maxSize || 1}MB)`)
          setIsLoading(false)
          return
        }

        const reader = new FileReader()
        reader.onload = () => {
          setImgSrc(reader.result as string)
          setIsLoading(false)
          setFileName(file.name)
        }
        reader.readAsDataURL(file)
      }
    } else {
      setErrorMessage(dictionary.unsupportedFileType)
      setIsLoading(false)
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

  useEffect(() => {
    if (open) {
      setImgSrc(customInitSource)
      setFileName(dictionary.noFileSelected)
    }
  }, [open, customInitSource, dictionary.noFileSelected])

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
            {customHeadline}
          </Typography>
          <button onClick={internalHandleClose} className="close-modal-button">
            <CloseIcon className="close-icon"></CloseIcon>
          </button>
        </Box>
        <Box sx={cropperBoxStyle}>
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <Cropper
              src={imgSrc}
              style={{ height: 400, width: '100%' }}
              initialAspectRatio={1}
              aspectRatio={aspectRatio === 'square' ? 1 : 16 / 9}
              guides={false}
              ref={cropperRef}
              viewMode={1}
              max={1}
              autoCropArea={1}
              cropBoxResizable={false}
              cropBoxMovable={true}
              dragMode="none"
              zoomable={false}
            />
          )}
        </Box>
        <Typography
          id="modal-modal-error"
          variant="body1"
          sx={errorMessageTypographyStyle}
        >
          {<Warning /> && errorMessage}
        </Typography>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
          }}
        >
          <form onSubmit={handleSubmit(onSubmit)} className="modal-form">
            <label htmlFor="contained-button-file" className="modal-form-left">
              <Input
                accept="image/*"
                id="contained-button-file"
                multiple
                type="file"
                {...register('file')}
                onChange={handleChange}
              />
              <Button
                variant="outlined"
                component="span"
                sx={{ minWidth: '150px', height: '47px' }}
              >
                {dictionary.uploadFile}
                <UploadIcon />
              </Button>
              <Typography
                variant="body1"
                sx={{
                  color: '#b6b6b6',
                  overflow: 'hidden',
                  textWrap: 'nowrap',
                  textOverflow: 'ellipsis',
                  maxWidth: '150px',
                  fontFamily: 'Gabarito',
                }}
              >
                {fileName}
              </Typography>
            </label>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={saveButtonStyle}
              disabled={isLoading}
            >
              {dictionary.saveWord}
            </Button>
          </form>
        </Box>
      </Box>
    </Modal>
  )
}

export default UploadPictureModal
