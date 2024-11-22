import { FC } from "react";
import useAuth from "../hooks/useAuth";
import { Navigate, Outlet } from "react-router-dom";
import Loading from "../components/common/Loading";

const Guest: FC = () => {

    const { status } = useAuth();
    const isLoggedIn = status === 'authenticated'
    const busy = status === 'busy'
    if (busy) return <Loading />
    return isLoggedIn ? <Navigate to='/profile' /> : <Outlet />
};

export default Guest