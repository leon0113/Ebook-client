import { FC } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { Navigate } from "react-router-dom";
import client from "../api/client";
import AuthorForm, { IAuthorInfo } from "../components/common/AuthorForm";
import useAuth from "../hooks/useAuth";
import { updateProfile } from "../store/slice/auth.slice";

const AuthorRegister: FC = () => {
    const { profile } = useAuth();
    const dispatch = useDispatch();

    const handleSubmit = async (data: IAuthorInfo) => {
        const res = await client.post('/author/register', data);
        dispatch(updateProfile(res.data.user));
        toast.success(res.data.message, { duration: 3000, icon: '🎉' });

    };

    if (profile?.role === 'author') return <Navigate to='/profile' />

    return (
        <div>
            <AuthorForm onSubmit={handleSubmit} btnTitle="Register as an Author!" />
        </div>

    )
}

export default AuthorRegister;