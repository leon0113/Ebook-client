import { FC } from "react";
import useAuth from "../hooks/useAuth";
import { Navigate, Outlet } from "react-router-dom";
import Loading from "../components/common/Loading";

const Private: FC = () => {

    const { status } = useAuth();
    console.log(status);
    const notLoggedIn = status === 'unauthenticated'

    const busy = status === 'busy'
    if (busy) return <Loading />

    return notLoggedIn ? <Navigate to='/sign-up' /> : <Outlet />
};

export default Private