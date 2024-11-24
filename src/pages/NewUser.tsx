import { FC } from "react";
import { useDispatch } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import client from "../api/client";
import NewUserForm from "../components/common/NewUserForm";
import useAuth from "../hooks/useAuth";
import { parseError } from "../utils/helper";

const NewUser: FC = () => {
    const navigate = useNavigate();
    const { profile } = useAuth();

    const handleSubmit = async (formData: FormData) => {
        try {
            await client.put('/auth/profile', formData);
            navigate('/')
            window.location.reload();
        } catch (error) {
            parseError(error)
        }
    }

    if (profile?.signedUp) return <Navigate to='/' />

    return (
        <NewUserForm onSubmit={handleSubmit} title='You are almost there, Please fill out the form below' btnTitle='Sign Me Up! ' />
    )
};

export default NewUser;