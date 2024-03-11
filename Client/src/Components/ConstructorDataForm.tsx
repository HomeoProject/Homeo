import { PaymentMethod, Place } from '../types/types'
import {
    ListItemText,
    MenuItem,
    Checkbox,
    Select,
    Button,
    TextField,
    FormControl,
    InputLabel,
} from '@mui/material'
import { ErrorMessage } from '@hookform/error-message'
import { SelectChangeEvent } from '@mui/material/Select'
import { useForm } from 'react-hook-form'
import { useMemo, useState } from 'react'
import '../style/scss/components/ConstructorDataForm.scss'
import CustomGooglePlacesAutocomplete from './CustomGooglePlacesAutocomplete'
import { LoadScript } from '@react-google-maps/api'
import LanguagesAutocomplete from './LanguagesAutocomplete'
import { toast } from 'react-toastify'
import axios from 'axios'
import { useAuth0 } from '@auth0/auth0-react'
import { checkIfUserHasPermission } from '../Auth0/auth0Helpers'
import CategoriesSelect from './CategoriesSelect'

interface ConstructorDataForm {
    phoneNumber: string
    email: string
    aboutMe: string
    experience: string
    minimalRate: number
    categories: Array<string>
    cities: Array<Place>
    languages: Array<string>
    acceptedPaymentMethods: Array<string>
}

const ConstructorDataForm = () => {
    const libraries = useMemo(() => ['places'] as 'places'[], [])

    const [selectedPlaces, setSelectedPlaces] = useState<Place[]>([])

    const [selectedLanguages, setSelectedLanguages] = useState<string[]>([])

    const [acceptedPaymentMethods, setAcceptedPaymentMethods] = useState<
        PaymentMethod[]
    >([])

    const [placesErrorMeessage, setPlacesErrorMessage] = useState<string>('')

    const [languagesErrorMessage, setLanguagesErrorMessage] =
        useState<string>('')

    const [
        acceptedPaymentMethodsErrorMessage,
        setAcceptedPaymentMethodsErrorMessage,
    ] = useState<string>('')

    const [selectedCategories, setSelectedCategories] = useState<
        string[]
    >([])

    const [categoriesErrorMessage, setCategoriesErrorMessage] = useState('')

    const [isFormLoading, setIsFormLoading] = useState<boolean>(false)

    const { isAuthenticated, getAccessTokenSilently } = useAuth0()

    const handleSelectPlace = (places: Place[]) => {
        setSelectedPlaces(places)
    }

    const handleSelectLanguage = (languages: string[]) => {
        setSelectedLanguages(languages)
    }

    const {
        register,
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

    const customHandleSubmit = async (data: ConstructorDataForm) => {
        setIsFormLoading(true)
        setPlacesErrorMessage('')
        setLanguagesErrorMessage('')
        setAcceptedPaymentMethodsErrorMessage('')

        if (selectedPlaces.length === 0) {
            setPlacesErrorMessage('At least one city is required.')
            setIsFormLoading(false)
            return
        }

        if (selectedLanguages.length === 0) {
            setLanguagesErrorMessage('At least one language is required.')
            setIsFormLoading(false)
            return
        }

        if (acceptedPaymentMethods.length === 0) {
            setAcceptedPaymentMethodsErrorMessage(
                'At least one payment method is required.'
            )
            setIsFormLoading(false)
            return
        }

        if (selectedCategories.length === 0) {
            setCategoriesErrorMessage('At least one category is required.')
            setIsFormLoading(false)
            return
        }

        const finalData: ConstructorDataForm = {
            ...data,
            minimalRate: +data.minimalRate, // convert string to number
            acceptedPaymentMethods: acceptedPaymentMethods.map((method) =>
                method.toString().toUpperCase()
            ),
            languages: selectedLanguages,
            cities: selectedPlaces,
            categories: selectedCategories,
        }

        console.log('Final data: ', finalData)

        if (isAuthenticated) {
            const token = await getAccessTokenSilently()

            const isProfileComplete = checkIfUserHasPermission(
                token,
                'user'
            )
    
            if (!isProfileComplete) {
                toast.error(
                    'Please complete your personal profile before creating a constructor profile.'
                )
                setIsFormLoading(false)
                return
            }

            const isConstructor = checkIfUserHasPermission(
                token,
                'constructor'
            )

            !isConstructor
                ? await axios
                      .post(
                          `${import.meta.env.VITE_REACT_APIGATEWAY_URL}/api/constructors`,
                          finalData,
                          {
                              headers: {
                                  Authorization: `Bearer ${token}`,
                              },
                          }
                      )
                      .then((response) => {
                          console.log(
                              'Constructor profile created successfully: ',
                              response.data
                          )
                          toast.success(
                              'Constructor profile created successfully!'
                          )
                      })
                      .catch((error) => {
                          toast.error('Failed to create constructor profile.')
                          console.error(error)
                      })
                : await axios
                      .put(
                          `${import.meta.env.VITE_REACT_APIGATEWAY_URL}/api/constructors`,
                          finalData,
                          {
                              headers: {
                                  Authorization: `Bearer ${token}`,
                              },
                          }
                      )
                      .then((response) => {
                          console.log(
                              'Constructor profile updated successfully: ',
                              response.data
                          )
                          toast.success(
                              'Constructor profile updated successfully!'
                          )
                          setIsFormLoading(false)
                      })
                      .catch((error) => {
                          console.error(error)
                          toast.error('Failed to update constructor profile.')
                          setIsFormLoading(false)
                      })
        } else {
            toast.error(
                'There was a problem with your authentication. Please try again in a moment.'
            )
        }
    }

    return (
        <div className="ConstructorDataForm">
            <h1>Constructor Information</h1>
            <div className="constructor-data-form-wrapper">
                <form
                    className="constructor-data-form"
                    onSubmit={handleSubmit(customHandleSubmit)}
                >
                    <TextField
                        id="phoneNumber"
                        label="Phone number"
                        InputLabelProps={{ shrink: true }}
                        type="text"
                        {...register('phoneNumber', {
                            required: 'Phone number is required.',
                            minLength: {
                                value: 2,
                                message:
                                    'Phone number must be at least 2 characters long.',
                            },
                            maxLength: {
                                value: 20,
                                message:
                                    'Phone number cannot be longer than 20 characters.',
                            },
                            pattern: {
                                value: /^\d{9}$/,
                                message:
                                    'Phone number must be exactly 9 digits.',
                            },
                        })}
                        placeholder="Fill in your work phone number (9 digits)"
                    />
                    <ErrorMessage
                        errors={errors}
                        name="phoneNumber"
                        render={({ message }) => (
                            <p className="error-message">{message}</p>
                        )}
                    />
                    <TextField
                        id="email"
                        label="Email"
                        InputLabelProps={{ shrink: true }}
                        type="text"
                        {...register('email', {
                            required: 'Email is required.',
                            minLength: {
                                value: 5,
                                message:
                                    'Email must be at least 5 characters long.',
                            },
                            maxLength: {
                                value: 50,
                                message:
                                    'Email cannot be longer than 50 characters.',
                            },
                            pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: 'Invalid email address.',
                            },
                        })}
                        placeholder="Fill in your work email address"
                    />
                    <ErrorMessage
                        errors={errors}
                        name="email"
                        render={({ message }) => (
                            <p className="error-message">{message}</p>
                        )}
                    />
                    <TextField
                        id="aboutMe"
                        label="About me"
                        InputLabelProps={{ shrink: true }}
                        type="text"
                        {...register('aboutMe', {
                            required: 'About me is required.',
                            minLength: {
                                value: 10,
                                message:
                                    'About me must be at least 10 characters long.',
                            },
                            maxLength: {
                                value: 300,
                                message:
                                    'About me cannot be longer than 300 characters.',
                            },
                        })}
                        placeholder="Write a few words about yourself"
                    />
                    <ErrorMessage
                        errors={errors}
                        name="aboutMe"
                        render={({ message }) => (
                            <p className="error-message">{message}</p>
                        )}
                    />
                    <TextField
                        id="experience"
                        label="Experience"
                        InputLabelProps={{ shrink: true }}
                        type="text"
                        {...register('experience', {
                            required: 'Experience is required.',
                            minLength: {
                                value: 10,
                                message:
                                    'Experience must be at least 10 characters long.',
                            },
                            maxLength: {
                                value: 300,
                                message:
                                    'Experience cannot be longer than 300 characters.',
                            },
                        })}
                        placeholder="Describe your experience"
                    />
                    <ErrorMessage
                        errors={errors}
                        name="experience"
                        render={({ message }) => (
                            <p className="error-message">{message}</p>
                        )}
                    />
                    <TextField
                        id="rate"
                        label="Minimal rate ($/hour)"
                        InputLabelProps={{ shrink: true }}
                        type="number"
                        {...register('minimalRate', {
                            required: 'Minimal rate is required.',
                            min: {
                                value: 1.0,
                                message: 'Minimal rate must be at least $1.00.',
                            },
                        })}
                        placeholder="Set your minimal rate ($/hour)"
                    />
                    <ErrorMessage
                        errors={errors}
                        name="rate"
                        render={({ message }) => (
                            <p className="error-message">{message}</p>
                        )}
                    />
                    <LoadScript
                        googleMapsApiKey={
                            import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string
                        }
                        libraries={libraries}
                    >
                        <CustomGooglePlacesAutocomplete
                            onSelectPlace={handleSelectPlace}
                        />
                    </LoadScript>
                    {placesErrorMeessage && <p className="error-message">{placesErrorMeessage}</p>}
                    <CategoriesSelect 
                        selectedCategories={selectedCategories}
                        setSelectedCategories={setSelectedCategories} 
                        categoriesErrorMessage={categoriesErrorMessage} 
                    />
                    <LanguagesAutocomplete
                        onSelectLanguage={handleSelectLanguage}
                    />
                    {languagesErrorMessage && <p className="error-message">{languagesErrorMessage}</p>}
                    <FormControl>
                        <InputLabel
                            shrink={true}
                            id="acceptedPaymentMethods"
                            sx={{ backgroundColor: 'white', padding: '0 5px' }}
                        >
                            Accepted payment methods
                        </InputLabel>
                        <Select
                            id="acceptedPaymentMethods"
                            multiple
                            MenuProps={{ disableScrollLock: true }}
                            value={acceptedPaymentMethods}
                            onChange={handlePaymentMethodChange}
                            renderValue={(selected) => selected.join(', ')}
                        >
                            {paymentMethods.map((method) => (
                                <MenuItem key={method} value={method}>
                                    <Checkbox
                                        checked={
                                            acceptedPaymentMethods.indexOf(
                                                method
                                            ) > -1
                                        }
                                    />
                                    <ListItemText primary={method} />
                                </MenuItem>
                            ))}
                        </Select>
                        {acceptedPaymentMethods.length === 0 && (
                            <p className="select-placeholder">
                                Choose accepted payment methods...
                            </p>
                        )}
                    </FormControl>
                    <p className="error-message">
                        {acceptedPaymentMethodsErrorMessage}
                    </p>
                    <Button
                        variant="contained"
                        type="submit"
                        className="submit-button"
                        disabled={isFormLoading}
                    >
                        Save
                    </Button>
                </form>
            </div>
        </div>
    )
}

export default ConstructorDataForm
