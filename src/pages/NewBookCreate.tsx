import { FC } from "react";
import BookForm from "../components/common/BookForm";

const NewBookCreate: FC = () => {
    return (
        <BookForm title='Publish New Book' submitBtnTitle='Publish' />
    )
}

export default NewBookCreate;