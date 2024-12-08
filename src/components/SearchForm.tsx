import { Input } from "@nextui-org/react";
import { FC, FormEventHandler, useState } from "react";
import toast from "react-hot-toast";
import { IoMdSearch } from "react-icons/io";
import { useNavigate } from "react-router-dom";

const SearchForm: FC = () => {
    const [query, setQuery] = useState('');
    const navigate = useNavigate();

    const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();
        if (query.trim().length >= 3) {
            navigate(`/search?title=${query}`);
            setQuery('');
        } else {
            toast.error('Please enter at least 3 characters');
        }
    }

    return (
        <form onSubmit={handleSubmit} className="w-full">
            <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full"
                placeholder="Search your desired books..."
                variant="bordered"
                endContent={
                    <button
                        className="focus:outline-none"
                        type="submit"

                    >
                        <IoMdSearch size={22} className="text-slate-400" />
                    </button>
                }

            />
        </form>
    )
}

export default SearchForm;