import { FC } from "react";
import { useDispatch } from "react-redux";
import client from "../api/client";
import NewUserForm from "../components/common/NewUserForm";
import useAuth from "../hooks/useAuth";
import { updateProfile } from "../store/slice/auth.slice";
import { useNavigate } from "react-router-dom";

const UpdateProfile: FC = () => {
    const { profile } = useAuth();
    const disPatch = useDispatch();
    const navigate = useNavigate();

    const handleSubmit = async (formData: FormData) => {
        const { data } = await client.put('/auth/profile', formData);
        disPatch(updateProfile(data.profile));
        navigate('/profile');
    };



    return (
        <div className="flex-1 flex items-center justify-center">
            <NewUserForm name={profile?.name} avatar={profile?.avatar} onSubmit={handleSubmit} title='Update your information' btnTitle='Update' />
        </div>
    )
};

export default UpdateProfile;