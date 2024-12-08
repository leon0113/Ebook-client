import { FC, useEffect, useState } from "react";
import client from "../api/client";
import { IBookBySearch } from "./Search";
import { Link, useSearchParams } from "react-router-dom";
import { Autocomplete, AutocompleteItem, Chip } from "@nextui-org/react";
import { calDiscount, formatPrice, parseError } from "../utils/helper";
import { FaStar } from "react-icons/fa";
import SkeBookList from "../components/skeletons/SkeBookList";
import { genres } from "../utils/data";


const AllBooks: FC = () => {
    const [allBooks, setAllBooks] = useState<IBookBySearch[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterKey, setFilterKey] = useState<string | null>('');
    const [filteredBooks, setFilteredBooks] = useState<IBookBySearch[]>([]);
    const [searchParam] = useSearchParams();
    const genre = searchParam.get('genre')

    useEffect(() => {
        const fetchAllBooks = async () => {
            try {
                const { data } = await client.get('/book/all');
                setAllBooks(data.books)
            } catch (error) {
                parseError(error);
            } finally {
                setLoading(false)
            }
        };

        fetchAllBooks();
    }, []);


    useEffect(() => {
        if (filterKey) {
            setFilteredBooks(
                allBooks.filter((book) =>
                    book.genre.toLowerCase() === filterKey.toLowerCase()
                )
            );
        } else {
            setFilteredBooks(allBooks);
        }
    }, [filterKey, allBooks]);

    useEffect(() => {
        if (genre) {
            setFilteredBooks(
                allBooks.filter((book) =>
                    book.genre === genre
                )
            );
        } else {
            setFilteredBooks(allBooks);
        }
    }, [genre, allBooks]);

    if (loading) {
        return <SkeBookList itemsCount={20} />
    }

    return (
        <div className="flex flex-col space-y-10 mt-5 p-5">
            {/* title & filter section  */}
            <div className="flex flex-col md:flex-row justify-between items-center space-y-5">
                {
                    filterKey || genre ? (
                        <h1 className="text-2xl text-slate-700">{genre || filterKey} Collection:</h1>
                    ) : (
                        <h1 className="text-2xl text-slate-700">All Books in Collection:</h1>
                    )
                }
                <div className="w-full md:w-60 flex justify-center">
                    <Autocomplete
                        label="Genre"
                        placeholder="Filter by Genre"
                        selectedKey={filterKey}
                        onSelectionChange={(key) => {
                            setFilterKey(key as string)
                        }}
                    >
                        {genres.map((item) => {
                            return (
                                <AutocompleteItem value={item.name} key={item.name}>
                                    {item.name}
                                </AutocompleteItem>
                            );
                        })}
                    </Autocomplete>
                </div>
            </div>
            {
                !filteredBooks.length && <h1 className="text-2xl w-full flex justify-center text-slate-700 text-center">No Books Found😥</h1>
            }
            {/* book list section  */}
            <div className="grid lg:grid-cols-5 md:grid-cols-3 sm:grid-cols-2 gap-5 mt-5">
                {
                    filteredBooks.map((book) => {
                        return (
                            <Link key={book.id} to={`/book/${book.slug}`} className="mb-5">
                                <div className="flex flex-col items-center">
                                    <img src={book.cover} alt={book.title}
                                        className="w-32 h-[185px] object-contain rounded"
                                    />


                                    <div className="w-full space-y-2 mb-2">
                                        <p className="font-bold line-clamp-1" title={book.title}>{book.title}</p>
                                        <p className="text-sm text-slate-600">Genre: <span className="text-slate-900 font-semibold">{book.genre}</span></p>
                                        <Chip radius="sm" size="sm" color="danger">{calDiscount(book.price)}% Off</Chip>
                                    </div>

                                    <div className="w-full mb-2">
                                        <div className="flex space-x-2">
                                            <p className="font-semibold">{formatPrice(Number(book.price.sale))}</p>
                                            <p className="font-base line-through">{formatPrice(Number(book.price.mrp))}</p>
                                        </div>
                                    </div>

                                    <div className="w-full">
                                        {
                                            book.rating ? <Chip radius="sm" color="warning" variant="solid">
                                                <div className="flex items-center font-semibold text-xs space-x-1">
                                                    <span>{book.rating}</span> <FaStar />
                                                </div>
                                            </Chip> : <span>No Rating</span>
                                        }

                                    </div>

                                </div>
                            </Link>
                        )
                    })
                }
            </div>

            {
                genre && <Link to='/books' className="text-lg font-semibold text-center underline text-yellow-500 hover:text-yellow-600">See all book collection</Link>
            }
        </div>
    )
}

export default AllBooks;