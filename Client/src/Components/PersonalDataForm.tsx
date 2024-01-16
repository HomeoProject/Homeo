import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import { useAuth0 } from "@auth0/auth0-react";
import TextField from '@mui/material/TextField';
import { CustomUser } from "../types/types";
import { useEffect } from "react";
import '../style/scss/components/PersonalDataForm.scss';
import Button from "@mui/material/Button";

interface PersonalDataForm {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
}

interface FormInputs {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
}

type PersonalDataFormProps = {
  customUser: CustomUser | null;
  setCustomUser: (customUser: CustomUser) => void;
}

const PersonalDataForm = ({ customUser, setCustomUser }: PersonalDataFormProps) => {
  const { user, isAuthenticated, isLoading } = useAuth0();

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<FormInputs>();

  useEffect(() => {
    if (user && isAuthenticated && !isLoading) {  
      console.log(customUser);
    }
  }, []);

  const validateInputSpaces = (input: string): boolean => {
    return (input.trim().length > 0 && input.slice(0) !== " ");
  }

  return (
    <div className="PersonalDataForm">
      <h1>Personal Data</h1>
      <div className="personal-data-form-wrapper">
        <form className="personal-data-form" onSubmit={handleSubmit((data) => console.log(data))}>
          <TextField
            id="firstName"
            label="First name"
            defaultValue={customUser?.firstName}
            type="text"
            {
              ...register(
                "firstName", 
                { 
                  required: "First name is required." ,
                  minLength: {
                    value: 2,
                    message: "First name must be at least 2 characters long."
                  },
                  maxLength: {
                    value: 20,
                    message: "First name cannot be longer than 50 characters."
                  },
                  validate: (value) => validateInputSpaces(value)
                }
              )
            }
            className="custom-input"
          />
          <ErrorMessage
            errors={errors}
            name="firstName"
            render={({ message }) => <p className="error-message">{message}</p>}
          />
          <TextField
            id="lastName"
            label="Last name"
            defaultValue={customUser?.lastName}
            type="text"
            {
              ...register(
                "lastName", 
                { 
                  required: "Last name is required.",
                  minLength: {
                    value: 2,
                    message: "Last name must be at least 2 characters long."
                  },
                  maxLength: {
                    value: 30,
                    message: "Last name must be at most 30 characters long."
                  },
                  validate: (value) => validateInputSpaces(value)
                }
              )
            }
            className="custom-input"
          />
          <ErrorMessage
            errors={errors}
            name="lastName"
            render={({ message }) => <p className="error-message">{message}</p>}
          />
          <TextField
            id="email"
            label="Email"
            defaultValue={customUser?.email}
            type="email"
            {
              ...register(
                "email", 
                { 
                  required: "Email is required.",
                  pattern: {
                    value: /\S+@\S+\.\S+/,
                    message: "Email is not valid."
                  },
                  maxLength: {
                    value: 50,
                    message: "Email must be at most 50 characters long."
                  },
                  validate: (value) => validateInputSpaces(value)
                }
              )
            }
            className="custom-input"
          />
          <ErrorMessage
            errors={errors}
            name="email"
            render={({ message }) => <p className="error-message">{message}</p>}
          />
          <TextField
            id="phoneNumber"
            label="Phone number"
            defaultValue={customUser?.phoneNumber}
            type="number"
            {
              ...register(
                "phoneNumber", 
                { 
                  required: "Phone number is required.",
                  pattern: {
                    value: /^[0-9\b]+$/,
                    message: "Phone number is not valid."
                  },
                  minLength: {
                    value: 9,
                    message: "Phone number must be exactly 9 characters long."
                  },
                  maxLength: {
                    value: 9,
                    message: "Phone number must be exactly 9 characters long."
                  },
                  validate: (value) => validateInputSpaces(value)
                }
              )
            }
            className="custom-input"
          />
          <ErrorMessage
            errors={errors}
            name="phoneNumber"
            render={({ message }) => <p className="error-message">{message}</p>}
          />
          <Button variant="contained" type="submit" className="submit-button">Save</Button>
        </form>
      </div>
    </div>
  )
}

export default PersonalDataForm;