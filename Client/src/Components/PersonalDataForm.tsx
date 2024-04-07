import { useForm } from 'react-hook-form'
import { ErrorMessage } from '@hookform/error-message'
import { Button, CircularProgress, TextField } from '@mui/material'
import '../style/scss/components/PersonalDataForm.scss'
import { useUserContext } from '../Context/UserContext'
import { useDictionaryContext } from '../Context/DictionaryContext'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import axios from 'axios'
import { useAuth0 } from '@auth0/auth0-react'

interface PersonalDataForm {
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
}

const PersonalDataForm = () => {
  const [isFormLoading, setIsFormLoading] = useState(false)
  const { isAuthenticated, getAccessTokenSilently } = useAuth0()
  const { customUser, setCustomUser } = useUserContext()
  const { dictionary } = useDictionaryContext()

  const {
    register,
    reset,
    formState: { errors },
    handleSubmit,
  } = useForm<PersonalDataForm>()

  const validateSpacesStartOrEnd = (value: string, label: string) => {
    return (
      !(value.trim().length != value.length) ||
      `${label} cannot start or end with spaces.`
    )
  }

  const handleSubmitForm = async (data: PersonalDataForm) => {
    setIsFormLoading(true)
    if (isAuthenticated) {
      const token = await getAccessTokenSilently()

      await axios
        .put(
          `${import.meta.env.VITE_REACT_APIGATEWAY_URL}/api/users/${customUser?.id}`,
          data,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((response) => {
          setCustomUser(response.data)
          toast.success(dictionary.personalInfoUpdSucc)
        })
        .catch((error) => {
          toast.error(dictionary.personalInfoUpdErr)
          console.error(error)
        })
        .finally(() => {
          setIsFormLoading(false)
        })
    } else {
      toast.error(dictionary.authErr)
      setIsFormLoading(false)
    }
  }

  useEffect(() => {
    if (customUser) {
      reset({
        firstName: customUser.firstName || '',
        lastName: customUser.lastName || '',
        email: customUser.email || '',
        phoneNumber: customUser.phoneNumber || '',
      })
    }
  }, [customUser, reset])

  return (
    <div className="PersonalDataForm">
      <h1>{dictionary.personalInfo}</h1>
      <div className="personal-data-form-wrapper">
        <form
          className="personal-data-form"
          onSubmit={handleSubmit(handleSubmitForm)}
        >
          <TextField
            id="firstName"
            label={dictionary.firstNameWord}
            // shrink the labels so the input text doesn't overlap with the label
            InputLabelProps={{ shrink: true }}
            type="text"
            {...register('firstName', {
              required: dictionary.firstNameRequiredErr,
              minLength: {
                value: 2,
                message: dictionary.firstNameLengthErr,
              },
              maxLength: {
                value: 20,
                message: dictionary.firstNameLengthErrSec,
              },
              validate: (value) =>
                validateSpacesStartOrEnd(value, dictionary.firstNameWord),
            })}
            className="custom-input"
            placeholder={dictionary.fillInName}
          />
          <ErrorMessage
            errors={errors}
            name="firstName"
            render={({ message }) => <p className="error-message">{message}</p>}
          />
          <TextField
            id="lastName"
            label={dictionary.lastNameWord}
            InputLabelProps={{ shrink: true }}
            type="text"
            {...register('lastName', {
              required: dictionary.lastNameRequiredErr,
              minLength: {
                value: 2,
                message: dictionary.lastNameLengthErr,
              },
              maxLength: {
                value: 30,
                message: dictionary.lastNameLengthErrSec,
              },
              validate: (value) =>
                validateSpacesStartOrEnd(value, dictionary.lastNameWord),
            })}
            className="custom-input"
            placeholder={dictionary.fillInLastname}
          />
          <ErrorMessage
            errors={errors}
            name="lastName"
            render={({ message }) => <p className="error-message">{message}</p>}
          />
          <TextField
            id="email"
            label="Email"
            InputLabelProps={{ shrink: true }}
            type="email"
            {...register('email', {
              required: dictionary.emailRequiredErr,
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: dictionary.emailInvalidErr,
              },
              maxLength: {
                value: 50,
                message: dictionary.emailLengthErr,
              },
            })}
            className="custom-input"
          />
          <ErrorMessage
            errors={errors}
            name="email"
            render={({ message }) => <p className="error-message">{message}</p>}
          />
          <TextField
            id="phoneNumber"
            label={dictionary.phoneNumberWord}
            InputLabelProps={{ shrink: true }}
            type="number"
            {...register('phoneNumber', {
              required: dictionary.phoneNumberRequiredErr,
              pattern: {
                value: /^\d{9}$/,
                message: dictionary.phoneLengthErr,
              },
              minLength: {
                value: 9,
                message: dictionary.phoneLengthErrSec,
              },
              maxLength: {
                value: 9,
                message: dictionary.phoneLengthErrSec,
              },
            })}
            className="custom-input"
            placeholder={dictionary.fillInPhoneNumber}
          />
          <ErrorMessage
            errors={errors}
            name="phoneNumber"
            render={({ message }) => <p className="error-message">{message}</p>}
          />
          <div className="submit-button-container">
            <Button
              variant="contained"
              type="submit"
              className="submit-button"
              disabled={isFormLoading}
            >
              {dictionary.saveWord}
            </Button>
            {isFormLoading && <CircularProgress className="loader" />}
          </div>
        </form>
      </div>
    </div>
  )
}

export default PersonalDataForm
