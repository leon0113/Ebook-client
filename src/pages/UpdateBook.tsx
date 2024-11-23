import { FC } from "react";
import BookForm from "../components/common/BookForm";

const UpdateBook: FC = () => {
    return (
        <BookForm title='Update Your Book' submitBtnTitle='Update' />
    )
}

export default UpdateBook;