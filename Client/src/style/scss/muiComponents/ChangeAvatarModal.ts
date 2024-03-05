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
    width: '50%',
    maxWidth: '600px',
    height: '70%',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    '@media (max-width: 600px)': {
        width: 'calc(80% - 32px)',
    },
}

export const titleTypographyStyle = {
    fontWeight: 600,
    fontFamily: 'Gabarito',
    width: '100%',
    '@media (max-width: 600px)': {
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
    '@media (max-width: 600px)': {
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
    '@media (max-width: 600px)': {
        fontSize: '0.8rem',
        paddingBottom: '1rem',
    },
}

export const saveButtonStyle = {
    fontSize: '1rem',
    fontFamily: 'Gabarito',
    height: '47px',
    width: '70px',
    marginLeft: '0.5rem',
    '@media (max-width: 600px)': {
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