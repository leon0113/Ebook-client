import { FC, useEffect, useState } from "react";
import BookForm, { InitialBookToUpdate } from "../components/common/BookForm";
import { useParams } from "react-router-dom";
import client from "../api/client";
import { parseError } from "../utils/helper";
import Loading from "../components/common/Loading";
import toast from "react-hot-toast";
import axios from "axios";

const UpdateBook: FC = () => {
    const { slug } = useParams();
    const [bookInfo, setBookInfo] = useState<InitialBookToUpdate>();
    const [busy, setBusy] = useState(true);

    const handleSubmit = async (data: FormData, file?: File) => {
        const res = await client.patch('/book', data);
        if (res.data) {
            axios.put(res.data, file, {
                headers: {
                    'Content-Type': "application/octet-stream",
                }
            });

            toast("Congratulations, Your book Updated Successfully. It may take some time to render.", {
                icon: "🎉",
                duration: 3000
            })
        }
    }

    useEffect(() => {
        const fetchBookDetails = async () => {
            try {
                const { data } = await client.get(`/book/details/${slug}`);
                setBookInfo(data.book);
            } catch (error) {
                parseError(error)
            } finally {
                setBusy(false);
            }
        }
        fetchBookDetails();
    }, [slug]);


    if (busy) return <Loading />

    return (
        <BookForm onSubmit={handleSubmit} initialState={bookInfo} title='Update Your Book' submitBtnTitle='Update' />
    )
}

export default UpdateBook;