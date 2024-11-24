import { FC } from "react";
import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const Author: FC = () => {
    const { profile } = useAuth();

    if (profile?.role !== 'author') {
        return <Navigate to="/profile" />;
    }

    return <Outlet />;
};

export default Author;
