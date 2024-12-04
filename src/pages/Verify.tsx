import { FC } from "react";
import { useDispatch } from "react-redux";
import { Navigate, useSearchParams } from "react-router-dom";
import { updateProfile } from "../store/slice/auth.slice";
import Loading from "../components/common/Loading";
import { parseError } from "../utils/helper";

const Verify: FC = () => {

    const [searchParams] = useSearchParams();
    const profileInfoString = searchParams.get('profile');
    const dispatch = useDispatch();

    if (profileInfoString) {
        try {
            const profile = JSON.parse(profileInfoString);

            dispatch(updateProfile(profile));

            if (!profile.signedUp) return <Navigate to='/new-user' />

            return <Navigate to='/' />
        } catch (error) {
            parseError(error)
            return <Navigate to='/not-found' />
        }
    }

    return (
        <Loading />
        // <p>Working</p>
    )
};

export default Verify;
