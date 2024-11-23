import { FC } from "react";
import client from "../api/client";
import NewUserForm from "../components/common/NewUserForm";
// import { useNavigate } from "react-router-dom";

const NewUser: FC = () => {
    // const navigate = useNavigate();

    const handleSubmit = async (formData: FormData) => {
        await client.put('/auth/profile', formData);
        // navigate('/')
    }

    return (
        <NewUserForm onSubmit={handleSubmit} title='You are almost there, Please fill out the form below' btnTitle='Sign Me Up! ' />
    )
};

export default NewUser;