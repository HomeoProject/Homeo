export const avatarModalStyle = {
  position: 'absolute',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'space-between',
  top: '50%',
  left: '50%',
  borderRadius: '10px',
  transform: 'translate(-50%, -50%)',
  width: '100%',
  maxWidth: '600px',
  height: '70%',
  maxHeight: '600px',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  '@media (max-width: 840px)': {
    width: 'calc(80% - 32px)',
    height: '80%',
    maxHeight: '700px',
  },
  '@media (max-height: 780px)': {
    height: '80%',
  },
}

export const titleTypographyStyle = {
  fontWeight: 600,
  fontFamily: 'Gabarito',
  width: '100%',
  '@media (max-width: 840px)': {
    fontSize: '1rem',
  },
}

export const cropperBoxStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  height: '100%',
  maxWidth: '600px',
  maxHeight: '400px',
  padding: '2rem',
  '@media (max-width: 840px)': {
    padding: '1rem',
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
  '@media (max-width: 840px)': {
    fontSize: '0.8rem',
    paddingBottom: '1rem',
  },
}

export const saveButtonStyle = {
  fontSize: '1rem',
  fontFamily: 'Gabarito',
  height: '47px',
  width: '70px',
  '@media (max-width: 840px)': {
    marginTop: '0.5rem',
    marginLeft: '0',
  },
}

export const closeModalContainerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  width: '100%',
  alignItems: 'center',
}
