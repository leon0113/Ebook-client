/* eslint-disable @typescript-eslint/no-unused-vars */
import { Spinner } from "@nextui-org/react";
import { FC } from "react";
import { Navigate, useSearchParams } from "react-router-dom";

const Verify: FC = () => {

    const [searchParams] = useSearchParams();
    const profileInfoString = searchParams.get('profile');

    if (profileInfoString) {
        try {
            const profile = JSON.parse(profileInfoString);
            console.log(profile);
            if (!profile.signedUp) return <Navigate to='/new-user' />

            return <Navigate to='/' />
        } catch (error) {
            return <Navigate to='/not-found' />
        }
    }

    return (
        <div className="flex items-center justify-center p-10">
            <Spinner label="Verifying..." color="success" />
        </div>
    )
};

export default Verify;
