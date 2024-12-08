import { Chip } from "@nextui-org/react";
import { FC } from "react";
import { FaStar } from "react-icons/fa6";
import { Link, useLocation } from "react-router-dom";
import { calDiscount, formatPrice } from "../utils/helper";
import GenreTitle from "./common/GenreTitle";
import { IRecommendedBooks } from "./Recommended";

interface Props {
    data: IRecommendedBooks[];
    title: string;
}

const RecommendedBooks: FC<Props> = ({ title, data }) => {

    const { pathname } = useLocation();

    return (
        <div>
            <GenreTitle title={title} />
            <div className="grid lg:grid-cols-5 md:grid-cols-3 sm:grid-cols-2 gap-5 mt-5">
                {
                    data.map((book) => {
                        return (
                            <Link key={book.id} to={`/book/${book.slug}`} >
                                <div className="flex flex-col items-center space-y-2">
                                    <img src={book.cover} alt={book.title}
                                        className="w-32 h-[185px] object-contain rounded border"
                                    />

                                    <div className="w-full space-y-2 mb-2">
                                        <p className="font-bold line-clamp-1" title={book.title}>{book.title}</p>
                                        {
                                            pathname.includes('/author') && <p className="text-sm text-slate-600">Genre: <span className="text-slate-900 font-semibold">{book.genre}</span></p>
                                        }
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

export default RecommendedBooks;