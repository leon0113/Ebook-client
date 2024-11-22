import { FC } from "react";
import { Navigate } from "react-router-dom";
import client from "../api/client";
import NewUserForm from "../components/common/NewUserForm";
import useAuth from "../hooks/useAuth";

const NewUser: FC = () => {
    const { profile } = useAuth();

    const handleSubmit = async (formData: FormData) => {
        await client.put('/auth/profile', formData);
    }

    if (profile?.signedUp === true) {
        return <Navigate to='/' />
    }

    return (
        <NewUserForm onSubmit={handleSubmit} title='You are almost there, Please fill out the form below' btnTitle='Sign Me Up! ' />
    )
};

export default NewUser;