import { FC, useEffect, useState } from "react";
import BookForm, { InitialBookToUpdate } from "../components/common/BookForm";
import { useParams } from "react-router-dom";
import client from "../api/client";
import { parseError } from "../utils/helper";
import Loading from "../components/common/Loading";

const UpdateBook: FC = () => {
    const { slug } = useParams();
    const [bookInfo, setBookInfo] = useState<InitialBookToUpdate>();
    const [busy, setBusy] = useState(true);

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
    console.log(bookInfo);
    if (busy) return <Loading />

    return (
        <BookForm initialState={bookInfo} title='Update Your Book' submitBtnTitle='Update' />
    )
}

export default UpdateBook;