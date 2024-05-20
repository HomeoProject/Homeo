import { Theme } from '@mui/material/styles'

export const chatMessageModalStyle = {
  position: 'absolute',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'space-between',
  top: '50%',
  left: '50%',
  borderRadius: '10px',
  transform: 'translate(-50%, -50%)',
  width: 'calc(80% - 3rem)',
  maxWidth: '600px',
  height: '70%',
  maxHeight: '600px',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  '@media (max-height: 780px)': {
    height: '80%',
  },
}

export const middleContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '100%',
  gap: '1rem',
}

export const textareaBoxStyle = {
  display: 'flex',
  justifyContent: 'center',
  width: '100%',
}

export const titleTypographyStyle = {
  fontWeight: 600,
  fontFamily: 'Gabarito',
  width: '100%',
  '@media (max-width: 600px)': {
    fontSize: '1rem',
  },
}

export const errorMessageTypographyStyle = {
  fontFamily: 'Gabarito',
  width: '100%',
  color: 'red',
  textAlign: 'center',
  paddingBottom: '2rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  '@media (max-width: 600px)': {
    fontSize: '0.8rem',
    paddingBottom: '1rem',
  },
}

export const errorChatAlreadyExistsStyle = {
  fontFamily: 'Gabarito',
  width: '100%',
  color: '#1cbe8e',
  textAlign: 'center',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  '@media (max-width: 600px)': {
    fontSize: '0.8rem',
  },
}

export const saveButtonStyle = {
  fontSize: '1rem',
  fontFamily: 'Gabarito',
  height: '47px',
  width: '100px',
  marginLeft: '0.5rem',
  '@media (max-width: 600px)': {
    marginTop: '0.5rem',
    marginLeft: '0',
  },
}

export const green = {
  100: '#84d8bf',
  200: '#4ad1a9',
  400: '#169872',
  500: '#1cbe8e',
  600: '#12b283',
  900: '#06674a',
}

export const grey = {
  50: '#F3F6F9',
  100: '#E5EAF2',
  200: '#DAE2ED',
  300: '#C7D0DD',
  400: '#B0B8C4',
  500: '#9DA8B7',
  600: '#6B7A90',
  700: '#434D5B',
  800: '#303740',
  900: '#1C2025',
}

export const listContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '100%',
  gap: '2rem',
  fontSize: '1rem',
  marginBottom: '-2rem',
  '@media (max-height: 650px)': {
    marginBottom: '-2rem',
  },
  '@media (max-height: 780px)': {
    gap: '1rem',
    fontSize: '0.8rem',
  },
}

export const rulesListStyle = {
  display: 'flex',
  flexDirection: 'column',
  maxWidth: '320px',
  color: grey[400],
  justifyContent: 'space-between',
  width: 'calc(100% - 30px)',
  gap: '0.5rem',
  listStyleType: 'circle',
  '@media(max-width: 500px)': {
    fontSize: '0.8rem',
  },
}

export const textareaStyle = (theme: Theme) => ({
  boxSizing: 'border-box',
  width: '100%',
  maxWidth: '320px',
  fontFamily: 'Gabarito',
  fontSize: '0.875rem',
  fontWeight: 400,
  lineHeight: 1.5,
  padding: '12px',
  borderRadius: '10px',
  resize: 'none',
  maxHeight: '250px',
  color: theme.palette.mode === 'dark' ? grey[300] : grey[900],
  background: theme.palette.mode === 'dark' ? grey[900] : '#fff',
  border: `1px solid ${theme.palette.mode === 'dark' ? grey[700] : grey[200]}`,
  boxShadow: `0px 2px 2px ${theme.palette.mode === 'dark' ? grey[900] : grey[50]}`,
  '&:hover': {
    borderColor: green[400],
  },
  '&:focus': {
    outline: '0',
    borderColor: green[400],
    boxShadow: `0 0 0 3px ${theme.palette.mode === 'dark' ? green[600] : green[200]}`,
  },
  '&:focusVisible': {
    outline: '0',
  },
})

export const listTitleStyle = {
  fontFamily: 'Gabarito',
  fontWeight: 600,
  color: grey[800],
  maxWidth: '400px',
  textAlign: 'center',
  width: '100%',
  '@media(max-width: 500px)': {
    fontSize: '0.9rem',
  },
}

export const bottomButtonContainer = {
  display: 'flex',
  justifyContent: 'space-between',
  width: '100%',
  alignItems: 'center',
  boxSizing: 'border-box',
}

export const closeModalContainerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  width: '100%',
  alignItems: 'center',
}
