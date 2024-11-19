/* eslint-disable @typescript-eslint/no-unused-vars */
import { FC } from "react";
import { Navigate, useSearchParams } from "react-router-dom";

const Verify: FC = () => {

    const [searchParams] = useSearchParams();
    const profileInfoString = searchParams.get('profile');

    if (profileInfoString) {
        try {
            const profile = JSON.parse(profileInfoString);
            console.log(profile);
            if (!profile.signedUp) return <Navigate to='new-user' />

            return <Navigate to='/' />
        } catch (error) {
            return <Navigate to='not-found' />
        }
    }

    return (
        <div>
            verify page
        </div>
    )
};

export default Verify;
