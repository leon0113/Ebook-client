import { FC, useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import client from "../api/client";
import { Chip } from "@nextui-org/react";
import { calDiscount, formatPrice, parseError } from "../utils/helper";
import { FaStar } from "react-icons/fa";
import Loading from "../components/common/Loading";

export interface IBookBySearch {
    id: string;
    title: string;
    cover?: string;
    slug: string;
    genre: string;
    rating?: string;
    price: {
        mrp: string;
        sale: string;
    };
}

const Search: FC = () => {
    const [searchParam] = useSearchParams();
    const title = searchParam.get('title');

    const [results, setResults] = useState<IBookBySearch[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSearchBooks = async () => {
            try {
                const { data } = await client.get(`/search/books?title=${title}`);
                setResults(data.results);
            } catch (error) {
                parseError(error)
            } finally {
                setLoading(false);
            }
        }

        fetchSearchBooks();
    }, [title]);

    if (loading) return <Loading />

    return (
        <div className="flex flex-col space-y-10 mt-10 p-5">
            <h1 className="text-2xl text-slate-700">Search Results For: <span className="text-3xl text-slate-800 font-semibold">{title}</span></h1>
            {
                !results.length && <h1 className="text-2xl text-slate-600 text-center">Sorry, No books found 😪</h1>
            }
            <div className="grid lg:grid-cols-5 md:grid-cols-3 sm:grid-cols-2 gap-5 mt-5">
                {
                    results.map((book) => {
                        return (
                            <Link key={book.id} to={`/book/${book.slug}`} className="mb-5">
                                <div className="flex flex-col items-center">
                                    <img src={book.cover} alt={book.title}
                                        className="w-32 h-[185px] object-contain rounded"
                                    />


                                    <div className="w-full space-y-2 mb-2">
                                        <p className="font-bold line-clamp-1" title={book.title}>{book.title}</p>
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
        </div>
    )
};


export default Search;