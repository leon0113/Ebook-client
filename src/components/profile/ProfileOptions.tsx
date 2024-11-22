import { Button, Spinner } from "@nextui-org/react";
import { FC } from "react";
import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import ProfileMenu from "./ProfileMenu";



const ProfileOptions: FC = () => {
    const { profile, status, signOut } = useAuth();
    if (status === 'busy') {
        return <Spinner size="sm" />
    }

    return profile ? <ProfileMenu profile={profile} signOut={signOut} /> : <Button as={Link} to='sign-up' variant="bordered">Sign Up / In</Button>
}

export default ProfileOptions