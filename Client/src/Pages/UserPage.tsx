import { useAuth0 } from '@auth0/auth0-react';
<<<<<<< HEAD
import '../style/scss/UserPage.scss';
import { useParams } from 'react-router-dom';
import ErrorPage from './ErrorPage';

// either make a user page with instant form or make a user page with a button that redirects to a form page that is prefilled with user data

const UserPage = () => {

    const { user, isLoading } = useAuth0();

    const { id } = useParams<{ id: string }>();

    return (
    <div className="UserPage">
        {
            user && (user.sub === id) ?
                <div className='user-page-main'>
                    UserPage
                </div>
            :
                !isLoading && <ErrorPage error={"You are not authorized to view this page"} />
        }
=======


const UserPage = () => {

    const { user } = useAuth0();

    return (
    <div className="UserPage">
        hello {user?.sub}
>>>>>>> 644d4fc01752ac6528663e6c0abd7ab35d4d38c3
    </div>
    )
}

export default UserPage;