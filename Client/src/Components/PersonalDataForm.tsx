import { useForm } from 'react-hook-form'
import { ErrorMessage } from '@hookform/error-message'
import { Button, TextField } from '@mui/material'
import '../style/scss/components/PersonalDataForm.scss'
import { useUserContext } from '../Context/UserContext'
import { useEffect } from 'react'

interface PersonalDataForm {
    firstName: string
    lastName: string
    email: string
    phoneNumber: string
}

const PersonalDataForm = () => {
    const { customUser } = useUserContext()

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
            <h1>Personal Information</h1>
            <div className="personal-data-form-wrapper">
                <form
                    className="personal-data-form"
                    onSubmit={handleSubmit((data) => console.log(data))}
                >
                    <TextField
                        id="firstName"
                        label="First name"
                        // shrink the labels so the input text doesn't overlap with the label
                        InputLabelProps={{ shrink: true }}
                        type="text"
                        {...register('firstName', {
                            required: 'First name is required.',
                            minLength: {
                                value: 2,
                                message:
                                    'First name must be at least 2 characters long.',
                            },
                            maxLength: {
                                value: 20,
                                message:
                                    'First name cannot be longer than 20 characters.',
                            },
                            validate: (value) =>
                                validateSpacesStartOrEnd(value, 'First name'),
                        })}
                        className="custom-input"
                    />
                    <ErrorMessage
                        errors={errors}
                        name="firstName"
                        render={({ message }) => (
                            <p className="error-message">{message}</p>
                        )}
                    />
                    <TextField
                        id="lastName"
                        label="Last name"
                        InputLabelProps={{ shrink: true }}
                        type="text"
                        {...register('lastName', {
                            required: 'Last name is required.',
                            minLength: {
                                value: 2,
                                message:
                                    'Last name must be at least 2 characters long.',
                            },
                            maxLength: {
                                value: 30,
                                message:
                                    'Last name must be at most 30 characters long.',
                            },
                            validate: (value) =>
                                validateSpacesStartOrEnd(value, 'Last name'),
                        })}
                        className="custom-input"
                    />
                    <ErrorMessage
                        errors={errors}
                        name="lastName"
                        render={({ message }) => (
                            <p className="error-message">{message}</p>
                        )}
                    />
                    <TextField
                        id="email"
                        label="Email"
                        InputLabelProps={{ shrink: true }}
                        type="email"
                        {...register('email', {
                            required: 'Email is required.',
                            pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: 'Invalid email address.',
                            },
                            maxLength: {
                                value: 50,
                                message:
                                    'Email must be at most 50 characters long.',
                            },
                        })}
                        className="custom-input"
                    />
                    <ErrorMessage
                        errors={errors}
                        name="email"
                        render={({ message }) => (
                            <p className="error-message">{message}</p>
                        )}
                    />
                    <TextField
                        id="phoneNumber"
                        label="Phone number"
                        InputLabelProps={{ shrink: true }}
                        type="number"
                        {...register('phoneNumber', {
                            required: 'Phone number is required.',
                            pattern: {
                                value: /^\d{9}$/,
                                message:
                                    'Phone number must be exactly 9 digits.',
                            },
                            minLength: {
                                value: 9,
                                message:
                                    'Phone number must be exactly 9 characters long.',
                            },
                            maxLength: {
                                value: 9,
                                message:
                                    'Phone number must be exactly 9 characters long.',
                            },
                        })}
                        className="custom-input"
                    />
                    <ErrorMessage
                        errors={errors}
                        name="phoneNumber"
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

export default PersonalDataForm
