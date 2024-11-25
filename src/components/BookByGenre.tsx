import { Chip } from "@nextui-org/react";
import { FC, useEffect, useState } from "react";
import { FaStar } from "react-icons/fa6";
import { Link } from "react-router-dom";
import client from "../api/client";
import { calDiscount, formatPrice, parseError } from "../utils/helper";
import GenreTitle from "./common/GenreTitle";
import SkeBookList from "./skeletons/SkeBookList";

interface Props {
    genre: string
}

interface IBookByGenre {
    id: string;
    title: string;
    cover?: string;
    slug: string;
    genre: string;
    rating?: string;
    language: string;
    price: {
        mrp: string;
        sale: string;
    };
}

const BookByGenre: FC<Props> = ({ genre }) => {

    const [books, setBooks] = useState<IBookByGenre[]>([]);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        try {
            const fetchBookByGenre = async (genre: string) => {
                const { data } = await client.get(`/book/by-genre/${genre}`);
                setBooks(data.books);
            }

            fetchBookByGenre(genre);
        } catch (error) {
            parseError(error)
        } finally {
            setLoading(false);
        }
    }, [genre]);

    if (loading) {
        return <SkeBookList />
    }

    return (
        <div>
            <GenreTitle title={genre} />
            <div className="grid lg:grid-cols-5 md:grid-cols-3 sm:grid-cols-2 gap-5 mt-5">
                {
                    books.map((book) => {
                        return (
                            <Link key={book.id} to={`/book/${book.slug}`} >
                                <div className="flex flex-col items-center space-y-2">
                                    <img src={book.cover} alt={book.title}
                                        className="w-32 h-[185px] object-contain rounded border"
                                    />

                                    <div className="w-full space-y-2">
                                        <p className="font-bold line-clamp-2">{book.title}</p>
                                        <Chip radius="sm" size="sm" color="danger">{calDiscount(book.price)}% Off</Chip>
                                    </div>

                                    <div className="w-full">
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
}

export default BookByGenre;