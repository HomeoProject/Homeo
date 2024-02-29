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
import { useState } from 'react'
import '../style/scss/components/ConstructorDataForm.scss'

interface ConstructorDataForm {
    companyName: string
    companyAddress: string
    companyPhoneNumber: string
    companyEmail: string
    aboutMe: string
    experience: string
    rate: number
    categories: Array<Category>
    city: string
    language: string
    acceptedPaymentMethods: Array<PaymentMethod>
}

const ConstructorDataForm = () => {
    const {
        register,
        // reset,
        formState: { errors },
        handleSubmit,
    } = useForm<ConstructorDataForm>()

    const paymentMethods: Array<PaymentMethod> = [
        PaymentMethod.CASH,
        PaymentMethod.CARD,
        PaymentMethod.TRANSFER,
    ]

    const [acceptedPaymentMethods, setAcceptedPaymentMethods] = useState<
        PaymentMethod[]
    >([])

    const handlePaymentMethodChange = (
        event: SelectChangeEvent<PaymentMethod[]>
    ) => {
        const {
            target: { value },
        } = event
        setAcceptedPaymentMethods(
            (typeof value === 'string'
                ? value.split(',')
                : value) as PaymentMethod[]
        )
    }

    const customHandleSubmit = (data: ConstructorDataForm) => {
        const finalData: ConstructorDataForm = {
            ...data,
            rate: +data.rate, // convert string to number
            acceptedPaymentMethods: acceptedPaymentMethods,
        }
        console.log(finalData)
    }

    return (
        <div className="ConstructorDataForm">
            <h1>Company Information</h1>
            <div className="constructor-data-form-wrapper">
                <form
                    className="constructor-data-form"
                    onSubmit={handleSubmit(customHandleSubmit)}
                >
                    <TextField
                        id="companyName"
                        label="Company name"
                        InputLabelProps={{ shrink: true }}
                        type="text"
                        {...register('companyName', {
                            required: 'Company name is required.',
                            minLength: {
                                value: 2,
                                message:
                                    'Company name must be at least 2 characters long.',
                            },
                            maxLength: {
                                value: 20,
                                message:
                                    'Company name cannot be longer than 20 characters.',
                            },
                        })}
                    />
                    <ErrorMessage
                        errors={errors}
                        name="companyName"
                        render={({ message }) => (
                            <p className="error-message">{message}</p>
                        )}
                    />
                    <TextField
                        id="companyAddress"
                        label="Company address"
                        InputLabelProps={{ shrink: true }}
                        type="text"
                        {...register('companyAddress', {
                            required: 'Company address is required.',
                            minLength: {
                                value: 2,
                                message:
                                    'Company address must be at least 2 characters long.',
                            },
                            maxLength: {
                                value: 20,
                                message:
                                    'Company address cannot be longer than 20 characters.',
                            },
                        })}
                    />
                    <ErrorMessage
                        errors={errors}
                        name="companyAddress"
                        render={({ message }) => (
                            <p className="error-message">{message}</p>
                        )}
                    />
                    <TextField
                        id="companyPhoneNumber"
                        label="Company phone number"
                        InputLabelProps={{ shrink: true }}
                        type="text"
                        {...register('companyPhoneNumber', {
                            required: 'Company phone number is required.',
                            minLength: {
                                value: 2,
                                message:
                                    'Company phone number must be at least 2 characters long.',
                            },
                            maxLength: {
                                value: 20,
                                message:
                                    'Company phone number cannot be longer than 20 characters.',
                            },
                        })}
                    />
                    <ErrorMessage
                        errors={errors}
                        name="companyPhoneNumber"
                        render={({ message }) => (
                            <p className="error-message">{message}</p>
                        )}
                    />
                    <TextField
                        id="companyEmail"
                        label="Company email"
                        InputLabelProps={{ shrink: true }}
                        type="text"
                        {...register('companyEmail', {
                            required: 'Company email is required.',
                            minLength: {
                                value: 2,
                                message:
                                    'Company email must be at least 2 characters long.',
                            },
                            maxLength: {
                                value: 20,
                                message:
                                    'Company email cannot be longer than 20 characters.',
                            },
                        })}
                    />
                    <ErrorMessage
                        errors={errors}
                        name="companyEmail"
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
                                value: 2,
                                message:
                                    'About me must be at least 2 characters long.',
                            },
                            maxLength: {
                                value: 20,
                                message:
                                    'About me cannot be longer than 20 characters.',
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
                                value: 2,
                                message:
                                    'Experience must be at least 2 characters long.',
                            },
                            maxLength: {
                                value: 20,
                                message:
                                    'Experience cannot be longer than 20 characters.',
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
                        label="Rate ($/hour)"
                        InputLabelProps={{ shrink: true }}
                        type="number"
                        {...register('rate', {
                            required: 'Rate is required.',
                            min: {
                                value: 1.0,
                                message: 'Rate must be at least $1.00.',
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
                    <TextField
                        id="city"
                        label="City"
                        InputLabelProps={{ shrink: true }}
                        type="text"
                        {...register('city', {
                            required: 'City is required.',
                            minLength: {
                                value: 2,
                                message:
                                    'City must be at least 2 characters long.',
                            },
                            maxLength: {
                                value: 30,
                                message:
                                    'City cannot be longer than 30 characters.',
                            },
                        })}
                    />
                    <ErrorMessage
                        errors={errors}
                        name="city"
                        render={({ message }) => (
                            <p className="error-message">{message}</p>
                        )}
                    />
                    <TextField
                        id="language"
                        label="Language"
                        InputLabelProps={{ shrink: true }}
                        type="text"
                        {...register('language', {
                            required: 'Language is required.',
                            minLength: {
                                value: 2,
                                message:
                                    'Language must be at least 2 characters long.',
                            },
                            maxLength: {
                                value: 20,
                                message:
                                    'Language cannot be longer than 20 characters.',
                            },
                        })}
                    />
                    <ErrorMessage
                        errors={errors}
                        name="language"
                        render={({ message }) => (
                            <p className="error-message">{message}</p>
                        )}
                    />
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
                                    <ListItemText
                                        primary={
                                            method.charAt(0).toUpperCase() +
                                            method.slice(1)
                                        }
                                    />
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <ErrorMessage
                        errors={errors}
                        name="paymentMethod"
                        render={({ message }) => (
                            <p className="error-message">{message}</p>
                        )}
                    />
                    <Button
                        variant="contained"
                        type="submit"
                        className="submit-button"
                    >
                        Save
                    </Button>
                </form>
            </div>
        </div>
    )
}

export default ConstructorDataForm
