import { Button, Chip, Divider } from "@nextui-org/react";
import { FC, useState } from "react";
import { FaEarthAfrica, FaRegCalendarDays, FaRegFileLines, FaStar } from "react-icons/fa6";
import { PiFilmReelBold } from "react-icons/pi";
import { TbShoppingCartPlus } from "react-icons/tb";
import { Link } from "react-router-dom";
import { IBookDetails } from "../pages/BookPage";
import { calDiscount, formatPrice, parseError } from "../utils/helper";
import RichEditor from "./rich-editor";
import { GoFileDirectoryFill } from "react-icons/go";
import useCart from "../hooks/useCart";
import client from "../api/client";
import useAuth from "../hooks/useAuth";

interface Props {
    book?: IBookDetails
}


const BookDetails: FC<Props> = ({ book }) => {
    const { updateCart, loading } = useCart();
    const { profile } = useAuth();
    const [pending, setPending] = useState(false);

    if (!book) return null;

    const { cover, title, authorId, publicationName, price, rating, id, description, language, fileInfo, genre, publishedAt, slug } = book;

    const handleCartUpdate = () => {
        updateCart({ product: book, quantity: 1 })
    };

    const handleInstantCheckout = async () => {
        try {
            setPending(true);
            const { data } = await client.post("/checkout/instant", { productId: id })
            console.log(data.checkoutUrl);
            if (data.checkoutUrl) {
                window.location.href = data.checkoutUrl
            }
        } catch (error) {
            parseError(error)
        } finally {
            setPending(false)
        }
    };

    const alreadyPurchased = profile?.books?.includes(book.id) || false;

    return (
        <div className="md:flex">
            {/* image  */}
            <div>
                <img src={cover} alt={title} className="w-48 h-80 rounded-md object-cover" />
            </div>
            <div className="pl-0 md:pl-10 pt-8 flex-1">

                <h1 className="sm:text-3xl text-2xl font-semibold">{title}</h1>
                {/* author & publication  */}
                <div>
                    <Link to={`/author/${authorId.id}`}> By  <span className="font-semibold hover:underline hover:text-sky-500">{authorId.name}</span>  </Link>
                    <p>{publicationName}</p>
                </div>
                {/* Price section  */}
                <div className="mt-3 flex items-center space-x-2">
                    <p className="font-semibold">{formatPrice(Number(price.sale))}</p>
                    <p className="line-through italic">{formatPrice(Number(price.mrp))}</p>
                    <Chip color="danger">{calDiscount(price)}% Off</Chip>
                </div>
                {/* Rating section  */}
                <div className="mt-3 flex items-center space-x-2 font-semibold">
                    {
                        rating ?
                            <Chip className="bg-slate-800">
                                <div className="flex space-x-1 items-center text-yellow-400">
                                    <span className="">{rating}</span>
                                    <FaStar className="" />
                                </div>
                            </Chip>
                            : <Chip><span className="text-xs font-light">No Rating</span></Chip>
                    }

                    <Link to={`/rate/${id}`} className="font-normal text-sm hover:underline hover:text-sky-500">Add a Review</Link>
                </div>
                {/* Description  */}
                <div className="mt-6">
                    <RichEditor value={description} className="regular" />
                </div>

                {/* File info  */}
                <div className="flex items-center justify-center sm:justify-normal flex-wrap space-x-6 space-y-2 mt-6 h-10">
                    <div className="flex flex-col items-center justify-center space-y-1">
                        <FaEarthAfrica className="sm:text-2xl text-xl " />
                        <span className="sm:text-xs text-sm truncate">{language}</span>
                    </div>
                    <Divider orientation="vertical" className="h-1/2" />
                    <div className="flex flex-col items-center justify-center space-y-1">
                        <PiFilmReelBold className="sm:text-2xl text-xl" />
                        <span className="sm:text-xs text-sm truncate">{genre}</span>
                    </div>
                    <Divider orientation="vertical" className="h-1/2" />
                    <div className="flex flex-col items-center justify-center space-y-1">
                        <FaRegFileLines className="sm:text-2xl text-xl " />
                        <span className="sm:text-xs text-sm truncate">{language}</span>
                    </div>
                    <Divider orientation="vertical" className="h-1/2" />
                    <div className="flex flex-col items-center justify-center space-y-1">
                        <GoFileDirectoryFill className="sm:text-2xl text-xl " />
                        <span className="sm:text-xs text-sm truncate">{fileInfo.size}</span>
                    </div>
                    <Divider orientation="vertical" className="h-1/2" />
                    <div className="flex flex-col items-center justify-center space-y-1">
                        <FaRegCalendarDays className="sm:text-2xl text-xl " />
                        <span className="sm:text-xs text-sm truncate">{publishedAt}</span>
                    </div>
                </div>
                {/* Cart & Buy button  */}
                <div className="flex items-center space-x-3 mt-20 md:mt-10">
                    {
                        alreadyPurchased ? (
                            <Button
                                as={Link}
                                to={`/read/${slug}`}
                                radius="sm"
                            >
                                Read Book
                            </Button>
                        ) : (
                            <>
                                <Button
                                    startContent={<TbShoppingCartPlus />}
                                    variant="light"
                                    onClick={handleCartUpdate}
                                    isLoading={loading}
                                >
                                    Add to Cart
                                </Button>
                                <Button
                                    variant="flat"
                                    isLoading={loading || pending}
                                    onClick={handleInstantCheckout}
                                >
                                    Buy Now
                                </Button>
                            </>
                        )
                    }
                </div>

            </div>
        </div>
    )
}

export default BookDetails;