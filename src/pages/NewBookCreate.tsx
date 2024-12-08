import { FC } from "react";
import BookForm from "../components/common/BookForm";
import client from "../api/client";
import axios from "axios";
import toast from "react-hot-toast";

const NewBookCreate: FC = () => {

    const handleSubmit = async (data: FormData, file: File) => {
        const res = await client.post('/book/create', data);
        if (res.data) {
            axios.put(res.data, file, {
                headers: {
                    'Content-Type': "application/octet-stream",
                }
            });

            toast("Congratulations, Your book has been published. It may take some time to render.", {
                icon: "🎉",
                duration: 3000
            })
        }
    };

    return (
        <BookForm
            onSubmit={handleSubmit}
            title='Publish New Book'
            submitBtnTitle='Publish'
        />
    )
}

export default NewBookCreate;