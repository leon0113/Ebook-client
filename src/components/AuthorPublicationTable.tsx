import { Button, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react";
import { FC, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { GoDotFill } from "react-icons/go";
import { HiOutlineTrash } from "react-icons/hi";
import { RiFileEditLine } from "react-icons/ri";
import { Link } from "react-router-dom";
import client from "../api/client";
import { parseError } from "../utils/helper";
import { IoEyeOutline } from "react-icons/io5";

interface Props {
    authorId?: string
};

interface AuthorBooks {
    id: string;
    title: string;
    slug: string;
    cover?: string;
    status: "publish" | "unpublish";
    sold?: number;
}

const AuthorPublicationTable: FC<Props> = ({ authorId }) => {

    const [authorBooks, setAuthorBooks] = useState<AuthorBooks[]>([]);
    const [deleteReqId, setDeleteReqId] = useState('');
    const [loading, setLoading] = useState(false);

    const handleBookDelete = async (bookId: string) => {
        if (bookId) {
            try {
                setLoading(true);
                const { data } = await client.delete(`/book/${bookId}`);
                setDeleteReqId('');
                if (data.success) {
                    toast.success("Book Deleted successfully!", { icon: "🎉" });
                    setAuthorBooks((oldBooks) => oldBooks.filter((book) => book.id !== bookId))
                }

                if (!data.success) {
                    toast.error((t) => (
                        <div className="space-y-2">
                            <span className="font-medium">We couldn't delete the book, Reasons can be multiple!</span>
                            <li>The book is already purchased by some user.</li>
                            <li>Your content does not support the feature.</li>
                            <button className="p-2 border-2 rounded w-full bg-slate-200" onClick={() => toast.dismiss(t.id)}>
                                Close
                            </button>
                        </div>
                    ), { duration: 5000 })
                }
            } catch (error) {
                parseError(error)
            } finally {
                setLoading(false);
            }
        }
    }

    useEffect(() => {
        if (authorId) {
            const fetchAuthorBooks = async () => {
                const { data } = await client.get(`/author/books/${authorId}`);
                setAuthorBooks(data.books)
            }

            fetchAuthorBooks()
        }
    }, [authorId]);

    return (
        <Table aria-label="Example static collection table">
            <TableHeader>
                <TableColumn className="w-3/5">Title</TableColumn>
                <TableColumn className="w-2/12">Status</TableColumn>
                <TableColumn className="w-2/12">Action</TableColumn>
            </TableHeader>
            <TableBody>
                {
                    authorBooks.map((book) => {
                        return <TableRow key={book.id}>

                            <TableCell className="flex items-center gap-3">
                                <img src={book.cover} alt="book image" className="w-10 h-10 rounded-full" />
                                <Link to={`/book/${book.slug}`} className="hover:underline text-lg font-medium">
                                    {book.title}
                                </Link>
                            </TableCell>

                            <TableCell>
                                {book.status === 'publish' ? <GoDotFill size={30} className="text-green-500" /> : <GoDotFill size={30} className="text-yellow-300" />}
                            </TableCell>

                            <TableCell>
                                <div className="flex space-x-3 relative">
                                    {
                                        deleteReqId === book.id && (<div className="absolute inset-0 bg-red-600 z-50 flex justify-center items-center rounded-md hover:text-white hover:underline">
                                            <button
                                                // as we are using onBlur, the inBlur will fire before onClick so we have to use onMouseDown for this cases
                                                onMouseDown={() => handleBookDelete(book.id)}
                                            >
                                                Confirm remove
                                            </button>
                                        </div>)
                                    }

                                    <Button
                                        isIconOnly
                                        variant="ghost"
                                        size="sm"
                                        as={Link}
                                        to={`/update-book/${book.slug}`}
                                        isLoading={loading}
                                    >
                                        <RiFileEditLine size={20} className="cursor-pointer text-green-500" title="Edit book" />
                                    </Button>

                                    <Button
                                        isIconOnly
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setDeleteReqId(book.id)}
                                        onBlur={() => setDeleteReqId('')}
                                        isLoading={loading}
                                    >
                                        <HiOutlineTrash size={20} className="cursor-pointer text-red-500" title="Delete book" />
                                    </Button>

                                    <Button
                                        isIconOnly
                                        variant="ghost"
                                        size="sm"
                                        as={Link}
                                        to={`/read/${book.slug}?title=${book.title}&id=${book.id}`}
                                        isLoading={loading}
                                    >
                                        <IoEyeOutline size={20} className="cursor-pointer text-blue-600" title="View Book" />
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    })
                }
            </TableBody>
        </Table>
    );
}


export default AuthorPublicationTable;