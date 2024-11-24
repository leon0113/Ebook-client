import { FC } from "react";
import useAuth from "../hooks/useAuth";
import { Navigate, Outlet } from "react-router-dom";
import Loading from "../components/common/Loading";

const Guest: FC = () => {

    const { status } = useAuth();
    const isLoggedIn = status === 'authenticated'
    const busy = status === 'busy'
    console.log("Guest: ", status);

    if (busy) return <Loading />
    if (isLoggedIn) {
        return <Navigate to='/profile' />
    } else {
        return <Outlet />
    }

};

export default Guest