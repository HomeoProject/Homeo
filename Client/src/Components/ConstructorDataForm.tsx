import { Category, PaymentMethod, Place } from '../types/types'
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

interface ConstructorDataForm {
    phoneNumber: string
    email: string
    aboutMe: string
    experience: string
    minimalRate: number
    categories: Array<Category>
    cities: Array<Place>
    languages: Array<string>
    acceptedPaymentMethods: Array<PaymentMethod>
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

    const [isFormLoading, setIsFormLoading] = useState<boolean>(false)

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

    const customHandleSubmit = (data: ConstructorDataForm) => {
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

        const finalData: ConstructorDataForm = {
            ...data,
            minimalRate: +data.minimalRate, // convert string to number
            acceptedPaymentMethods: acceptedPaymentMethods,
            languages: selectedLanguages,
            cities: selectedPlaces,
        }
        console.log(finalData)

        setTimeout(() => {
            setIsFormLoading(false)
        }, 2000)
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
                                value: 2,
                                message:
                                    'Email must be at least 2 characters long.',
                            },
                            maxLength: {
                                value: 20,
                                message:
                                    'Email cannot be longer than 20 characters.',
                            },
                            pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: 'Invalid email address.',
                            },
                        })}
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
                    <p className="error-message">{placesErrorMeessage}</p>
                    <LanguagesAutocomplete
                        onSelectLanguage={handleSelectLanguage}
                    />
                    <p className="error-message">{languagesErrorMessage}</p>
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
