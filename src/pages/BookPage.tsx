import { FC, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import client from "../api/client";
import { parseError } from "../utils/helper";
import BookDetails from "../components/BookDetails";
import SkeBookDetails from "../components/skeletons/SkeBookDetails";
import ReviewSection, { iReviewRes } from "../components/ReviewSection";

export interface IBookDetails {
    id: string;
    title: string;
    cover?: string;
    authorId: {
        id: string;
        name: string;
        slug: string;
    };
    slug: string;
    description: string;
    genre: string;
    rating?: string;
    language: string;
    publishedAt: string;
    publicationName: string
    price: {
        mrp: string;
        sale: string;
    };
    fileInfo: {
        id: string;
        size: string;
    }
}


const BookPage: FC = () => {
    const { slug } = useParams();
    const [bookDetails, setBookDetails] = useState<IBookDetails>();
    const [loading, setLoading] = useState(true);
    const [reviews, setReviews] = useState<iReviewRes[]>([])

    const fetchBookReviews = async (id: string) => {
        const { data } = await client.get(`/review/library/${id}`);
        return data.reviews;
    };

    useEffect(() => {
        const fetchBookDetails = async () => {
            try {
                const { data } = await client.get(`/book/details/${slug}`);
                setBookDetails(data.book);
                const reviews = await fetchBookReviews(data.book.id);
                setReviews(reviews)
            } catch (error) {
                parseError(error);
            } finally {
                setLoading(false);
            }
        };


        fetchBookDetails();

    }, [slug]);

    if (loading) return <div className="p-5 lg:p-0"><SkeBookDetails /></div>

    return (
        <div className="p-5 lg:p-0 space-y-10">
            <BookDetails book={bookDetails} />
            <ReviewSection id={bookDetails?.id} reviews={reviews} title={`${bookDetails?.title} Reviews`} />
        </div>
    )
}

export default BookPage;