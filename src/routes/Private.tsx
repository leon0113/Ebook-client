import { FC } from "react";
import useAuth from "../hooks/useAuth";
import { Navigate, Outlet } from "react-router-dom";
import Loading from "../components/common/Loading";

const Private: FC = () => {
    const { status } = useAuth();

    if (status === 'busy') return <Loading />;

    if (status !== 'authenticated') {
        return <Navigate to="/sign-up" />;
    }

    return <Outlet />;
};

export default Private;
