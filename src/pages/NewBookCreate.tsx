import { FC } from "react";
import BookForm from "../components/common/BookForm";
import client from "../api/client";

const NewBookCreate: FC = () => {

    const handleSubmit = async (data: FormData) => {
        await client.post('/book/create', data);
    }

    return (
        <BookForm onSubmit={handleSubmit} title='Publish New Book' submitBtnTitle='Publish' />
    )
}

export default NewBookCreate;