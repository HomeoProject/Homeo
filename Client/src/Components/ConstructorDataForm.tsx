import { Category, PaymentMethod } from '../types/types'
import { Button, TextField } from '@mui/material'
import { ErrorMessage } from '@hookform/error-message'
import { SelectChangeEvent } from '@mui/material/Select'
import { useForm } from 'react-hook-form'
import { useEffect, useState } from 'react'
import '../style/scss/components/ConstructorDataForm.scss'
import CitiesAutocomplete from './CitiesAutocomplete'
import LanguagesAutocomplete from './LanguagesAutocomplete'
import { toast } from 'react-toastify'
import { useAuth0 } from '@auth0/auth0-react'
import { checkIfUserHasPermission } from '../Auth0/auth0Helpers'
import CategoriesSelect from './CategoriesSelect'
import AcceptedPaymentMethodSelect from './AcceptedPaymentMethodSelect'
import apiClient, { setAuthToken } from '../AxiosClients/apiClient'
import { useConstructorContext } from '../Context/ConstructorContext'
import { useDictionaryContext } from '../Context/DictionaryContext'

interface ConstructorDataForm {
  phoneNumber: string
  constructorEmail: string
  aboutMe: string
  experience: string
  minRate: number
  categoryIds: Array<number>
  cities: Array<string>
  languages: Array<string>
  paymentMethods: Array<string>
}

const ConstructorDataForm = () => {
  const { constructor, setConstructor } = useConstructorContext()

  const [selectedPlaces, setSelectedPlaces] = useState<string[]>([])

  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([])

  const [acceptedPaymentMethods, setAcceptedPaymentMethods] = useState<
    PaymentMethod[]
  >([])

  const [placesErrorMeessage, setPlacesErrorMessage] = useState<string>('')

  const [languagesErrorMessage, setLanguagesErrorMessage] = useState<string>('')

  const [
    acceptedPaymentMethodsErrorMessage,
    setAcceptedPaymentMethodsErrorMessage,
  ] = useState<string>('')

  const [selectedCategories, setSelectedCategories] = useState<number[]>([])

  const [categoriesErrorMessage, setCategoriesErrorMessage] = useState('')

  const [isFormLoading, setIsFormLoading] = useState<boolean>(false)

  const { isAuthenticated, getAccessTokenSilently } = useAuth0()

  const { dictionary } = useDictionaryContext()

  const handleSelectPlace = (places: string[]) => {
    setSelectedPlaces(places)
  }

  const handleSelectLanguage = (languages: string[]) => {
    setSelectedLanguages(languages)
  }

  const {
    register,
    reset,
    formState: { errors },
    handleSubmit,
  } = useForm<ConstructorDataForm>()

  const paymentMethods: Array<PaymentMethod> = [
    PaymentMethod.CASH,
    PaymentMethod.CARD,
    PaymentMethod.TRANSFER,
  ]

  const handlePaymentMethodChange = (
    event: SelectChangeEvent<PaymentMethod[]>
  ) => {
    const {
      target: { value },
    } = event
    setAcceptedPaymentMethods(value as PaymentMethod[])
  }

  const validateSelectsAndAutocompletes = () => {
    if (selectedPlaces.length === 0) {
      setPlacesErrorMessage(dictionary.cityRequiredErr)
    } else {
      setPlacesErrorMessage('')
    }

    if (selectedLanguages.length === 0) {
      setLanguagesErrorMessage(dictionary.languageRequiredErr)
    } else {
      setLanguagesErrorMessage('')
    }

    if (acceptedPaymentMethods.length === 0) {
      setAcceptedPaymentMethodsErrorMessage(dictionary.paymentMethodRequiredErr)
    } else {
      setAcceptedPaymentMethodsErrorMessage('')
    }

    if (selectedCategories.length === 0) {
      setCategoriesErrorMessage(dictionary.categoryRequiredErr)
    } else {
      setCategoriesErrorMessage('')
    }
  }

  const updateConstructorProfile = async (
    isConstructor: boolean,
    finalData: ConstructorDataForm,
    token: string
  ) => {
    setAuthToken(token)

    if (!isConstructor) {
      // Creating a new constructor profile
      apiClient
        .post('/constructors', finalData)
        .then((response) => {
          setConstructor(response.data)
        })
        .then(() => {
          toast.success(dictionary.constructorMessageSucc)
        })
        .catch((error) => {
          console.error(error)
          toast.error(dictionary.constructorMessageErr)
        })
    } else {
      // Updating an existing constructor profile
      apiClient
        .put('/constructors', finalData)
        .then((response) => {
          setConstructor(response.data)
        })
        .then(() => {
          toast.success(dictionary.constructorUpdMessageSucc)
        })
        .catch((error) => {
          console.error(error)
          toast.error(dictionary.constructorUpdMessageErr)
        })
    }
    setIsFormLoading(false)
  }

  const customHandleSubmit = async (data: ConstructorDataForm) => {
    setIsFormLoading(true)
    validateSelectsAndAutocompletes()

    const finalData: ConstructorDataForm = {
      ...data,
      minRate: +data.minRate, // convert string to number
      paymentMethods: acceptedPaymentMethods.map((method) =>
        method.toString().toUpperCase()
      ),
      languages: selectedLanguages,
      cities: selectedPlaces,
      categoryIds: selectedCategories,
    }

    if (isAuthenticated) {
      const token = await getAccessTokenSilently()

      const isProfileComplete = checkIfUserHasPermission(token, 'user')

      if (!isProfileComplete) {
        toast.error(dictionary.constructorBeforePersonalMessageErr)
        setIsFormLoading(false)
        return
      }

      const isConstructor = checkIfUserHasPermission(token, 'constructor')

      updateConstructorProfile(isConstructor, finalData, token)
    } else {
      toast.error(dictionary.authErr)
    }
  }

  useEffect(() => {
    if (isAuthenticated && constructor !== null) {
      const {
        phoneNumber,
        constructorEmail,
        aboutMe,
        experience,
        minRate,
        categories,
        cities,
        languages,
        paymentMethods,
      } = constructor

      const selectedCategoriesIds = categories.map(
        (category: Category) => category.id
      )

      //convert payment methods from string to PaymentMethod enum
      const selectedPaymentMethods: PaymentMethod[] = paymentMethods.map(
        (method: string) =>
          PaymentMethod[method.toUpperCase() as keyof typeof PaymentMethod]
      )

      setSelectedCategories(selectedCategoriesIds)
      setSelectedPlaces(cities)
      setSelectedLanguages(languages)
      setAcceptedPaymentMethods(selectedPaymentMethods)

      reset({
        phoneNumber,
        constructorEmail,
        aboutMe,
        experience,
        minRate,
      })
    }
  }, [isAuthenticated, constructor, reset])

  return (
    <div className="ConstructorDataForm">
      <h1>{dictionary.contructorInfoWord}</h1>
      <div className="constructor-data-form-wrapper">
        <form
          className="constructor-data-form"
          onSubmit={handleSubmit(customHandleSubmit)}
        >
          <TextField
            id="phoneNumber"
            label={dictionary.phoneNumberWord}
            InputLabelProps={{ shrink: true }}
            type="text"
            {...register('phoneNumber', {
              required: dictionary.phoneRequiredErr,
              pattern: {
                value: /^\d{9}$/,
                message: dictionary.phoneLengthErr,
              },
            })}
            placeholder={dictionary.phoneNumberPlaceholder}
          />
          <ErrorMessage
            errors={errors}
            name="phoneNumber"
            render={({ message }) => <p className="error-message">{message}</p>}
          />
          <TextField
            id="constructorEmail"
            label="Email"
            InputLabelProps={{ shrink: true }}
            type="text"
            {...register('constructorEmail', {
              required: dictionary.emailRequiredErr,
              minLength: {
                value: 5,
                message: dictionary.EmailLengthErrSec,
              },
              maxLength: {
                value: 50,
                message: dictionary.emailLengthErr,
              },
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: dictionary.emailInvalidErr,
              },
            })}
            placeholder={dictionary.emailPlaceholder}
          />
          <ErrorMessage
            errors={errors}
            name="constructorEmail"
            render={({ message }) => <p className="error-message">{message}</p>}
          />
          <TextField
            id="aboutMe"
            label={dictionary.aboutMe}
            InputLabelProps={{ shrink: true }}
            type="text"
            {...register('aboutMe', {
              required: dictionary.aboutMeRequiredErr,
              minLength: {
                value: 10,
                message: dictionary.aboutMeLengthErr,
              },
              maxLength: {
                value: 300,
                message: dictionary.aboutMeLengthErrSec,
              },
            })}
            placeholder={dictionary.aboutMePlaceholder}
          />
          <ErrorMessage
            errors={errors}
            name="aboutMe"
            render={({ message }) => <p className="error-message">{message}</p>}
          />
          <TextField
            id="experience"
            label={dictionary.experience}
            InputLabelProps={{ shrink: true }}
            type="text"
            {...register('experience', {
              required: dictionary.experienceRequiredErr,
              minLength: {
                value: 10,
                message: dictionary.experienceLengthErr,
              },
              maxLength: {
                value: 300,
                message: dictionary.experienceLengthErrSec,
              },
            })}
            placeholder={dictionary.experiencePlaceholder}
          />
          <ErrorMessage
            errors={errors}
            name="experience"
            render={({ message }) => <p className="error-message">{message}</p>}
          />
          <TextField
            id="minRate"
            label={dictionary.rateWord}
            InputLabelProps={{ shrink: true }}
            type="number"
            {...register('minRate', {
              required: dictionary.rateRequiredErr,
              min: {
                value: 1.0,
                message: dictionary.rateMinimalErr,
              },
            })}
            placeholder={dictionary.ratePlaveholder}
          />
          <ErrorMessage
            errors={errors}
            name="minRate"
            render={({ message }) => <p className="error-message">{message}</p>}
          />
          <CitiesAutocomplete
            selectedPlaces={selectedPlaces}
            onSelectPlace={handleSelectPlace}
          />
          {placesErrorMeessage && (
            <p className="error-message">{placesErrorMeessage}</p>
          )}
          <CategoriesSelect
            selectedCategories={selectedCategories}
            setSelectedCategories={setSelectedCategories}
            categoriesErrorMessage={categoriesErrorMessage}
          />
          {categoriesErrorMessage && (
            <p className="error-message">{categoriesErrorMessage}</p>
          )}
          <LanguagesAutocomplete
            selectedLanguages={selectedLanguages}
            onSelectLanguage={handleSelectLanguage}
          />
          {languagesErrorMessage && (
            <p className="error-message">{languagesErrorMessage}</p>
          )}
          <AcceptedPaymentMethodSelect
            acceptedPaymentMethods={acceptedPaymentMethods}
            handlePaymentMethodChange={handlePaymentMethodChange}
            paymentMethods={paymentMethods}
          />
          <p className="error-message">{acceptedPaymentMethodsErrorMessage}</p>
          <Button
            variant="contained"
            type="submit"
            className="submit-button"
            disabled={isFormLoading}
          >
            {dictionary.saveWord}
          </Button>
        </form>
      </div>
    </div>
  )
}

export default ConstructorDataForm
