import { FC } from "react";
import BookForm from "../components/common/BookForm";
import client from "../api/client";
import toast from "react-hot-toast";

const NewBookCreate: FC = () => {

    const handleSubmit = async (data: FormData) => {
        const res = await client.post('/book/create', data);
        toast(res.data);
    }

    return (
        <BookForm onSubmit={handleSubmit} title='Publish New Book' submitBtnTitle='Publish' />
    )
}

export default NewBookCreate;