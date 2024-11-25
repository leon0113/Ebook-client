import { FC } from "react";
import AuthorForm, { IAuthorInfo } from "../components/common/AuthorForm";
import client from "../api/client";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const AuthorRegister: FC = () => {
    const navigate = useNavigate();

    const handleSubmit = async (data: IAuthorInfo) => {
        const res = await client.post('/author/register', data);
        toast.success(res.data.message, { duration: 3000 });
        navigate('/profile');
        window.location.reload();
    }

    return (
        <div>
            <AuthorForm onSubmit={handleSubmit} btnTitle="Register as an Author!" />
        </div>

    )
}

export default AuthorRegister;