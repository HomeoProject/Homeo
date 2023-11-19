import { useAuth0 } from '@auth0/auth0-react';


const UserPage = () => {

    const { user } = useAuth0();

    return (
    <div className="UserPage">
        hello {user?.sub}
    </div>
    )
}

export default UserPage;