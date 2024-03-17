import { Category, PaymentMethod } from '../types/types'
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
import { useEffect, useState } from 'react'
import '../style/scss/components/ConstructorDataForm.scss'
import CitiesAutocomplete from './CitiesAutocomplete'
import LanguagesAutocomplete from './LanguagesAutocomplete'
import { toast } from 'react-toastify'
import { useAuth0 } from '@auth0/auth0-react'
import { checkIfUserHasPermission } from '../Auth0/auth0Helpers'
import CategoriesSelect from './CategoriesSelect'
import apiClient, { setAuthToken } from '../AxiosClients/apiClient'
import { useConstructorContext } from '../Context/ConstructorContext'
import Banner from './Banner'

interface ConstructorDataForm {
    phoneNumber: string
    constructorEmail: string
    aboutMe: string
    experience: string
    minRate: number
    categoryIds: Array<string>
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

    const [languagesErrorMessage, setLanguagesErrorMessage] =
        useState<string>('')

    const [
        acceptedPaymentMethodsErrorMessage,
        setAcceptedPaymentMethodsErrorMessage,
    ] = useState<string>('')

    const [selectedCategories, setSelectedCategories] = useState<string[]>([])

    const [categoriesErrorMessage, setCategoriesErrorMessage] = useState('')

    const [isFormLoading, setIsFormLoading] = useState<boolean>(false)

    const { isAuthenticated, getAccessTokenSilently } = useAuth0()

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
            setPlacesErrorMessage('At least one city is required.')
        } else {
            setPlacesErrorMessage('')
        }

        if (selectedLanguages.length === 0) {
            setLanguagesErrorMessage('At least one language is required.')
        } else {
            setLanguagesErrorMessage('')
        }

        if (acceptedPaymentMethods.length === 0) {
            setAcceptedPaymentMethodsErrorMessage(
                'At least one payment method is required.'
            )
        } else {
            setAcceptedPaymentMethodsErrorMessage('')
        }

        if (selectedCategories.length === 0) {
            setCategoriesErrorMessage('At least one category is required.')
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

        try {
            if (!isConstructor) {
                // Creating a new constructor profile
                apiClient.post('/constructors', finalData).then((response) => {
                    setConstructor(response.data)
                })
                toast.success('Constructor profile created successfully!')
            } else {
                // Updating an existing constructor profile
                apiClient.put('/constructors', finalData).then((response) => {
                    setConstructor(response.data)
                })
                toast.success('Constructor profile updated successfully!')
            }
        } catch (error) {
            const errorMessage = isConstructor
                ? 'Failed to update constructor profile.'
                : 'Failed to create constructor profile.'
            console.error(error)
            toast.error(errorMessage)
        } finally {
            setIsFormLoading(false)
        }
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

        console.log('Final data: ', finalData)

        if (isAuthenticated) {
            const token = await getAccessTokenSilently()

            const isProfileComplete = checkIfUserHasPermission(token, 'user')

            if (!isProfileComplete) {
                toast.error(
                    'Please complete your personal profile before creating a constructor profile.'
                )
                setIsFormLoading(false)
                return
            }

            const isConstructor = checkIfUserHasPermission(token, 'constructor')

            updateConstructorProfile(isConstructor, finalData, token)
        } else {
            toast.error(
                'There was a problem with your authentication. Please try again in a moment.'
            )
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
                    PaymentMethod[
                        method.toUpperCase() as keyof typeof PaymentMethod
                    ]
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
            {!constructor && (
                <Banner
                    variant="info"
                    text="Fill in the missing constructor information to become one and start offering your services."
                    headline="Want to become a constructor?"
                />
            )}
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
                        id="constructorEmail"
                        label="Email"
                        InputLabelProps={{ shrink: true }}
                        type="text"
                        {...register('constructorEmail', {
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
                        name="constructorEmail"
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
                        id="minRate"
                        label="Minimal rate ($/hour)"
                        InputLabelProps={{ shrink: true }}
                        type="number"
                        {...register('minRate', {
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
                        name="minRate"
                        render={({ message }) => (
                            <p className="error-message">{message}</p>
                        )}
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
                        <p className="error-message">
                            {categoriesErrorMessage}
                        </p>
                    )}
                    <LanguagesAutocomplete
                        selectedLanguages={selectedLanguages}
                        onSelectLanguage={handleSelectLanguage}
                    />
                    {languagesErrorMessage && (
                        <p className="error-message">{languagesErrorMessage}</p>
                    )}
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
