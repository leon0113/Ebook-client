import { Button } from "@nextui-org/react";
import { AxiosError } from "axios";
import { FC, FormEventHandler, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaRegStar, FaStar } from "react-icons/fa6";
import { useParams } from "react-router-dom";
import client from "../api/client";
import RichEditor from "../components/rich-editor";
import { parseError } from "../utils/helper";

const Rate: FC = () => {
    const { bookId } = useParams();
    const [selectedRating, setSelectedRating] = useState<string[]>([]);
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(false);
    const [pending, setPending] = useState(true);

    const rating = Array(5).fill("");

    const updateRating = (rating: number) => {
        const newRating = Array<string>(rating).fill("selected");
        setSelectedRating(newRating);
    };

    const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();
        if (!selectedRating.length) return toast.error("Please select some star!");

        try {
            setLoading(true)
            await client.post('/review', { bookId, rating: selectedRating.length, content });
            toast.success("Review submitted successfully");
        } catch (error) {
            parseError(error);
        } finally {
            setLoading(false)
        }

    };

    useEffect(() => {
        const fetchReview = async () => {
            try {
                const { data } = await client.get(`/review/${bookId}`);
                setContent(data.content || "");
                updateRating(data.rating)
            } catch (error) {
                if (error instanceof AxiosError) {
                    if (error.response?.status === 404) return
                    else parseError(error)
                }
            } finally {
                setPending(false)
            }
        };
        fetchReview();
    }, [bookId]);

    if (pending) return <div className="p-5 text-center"><p>Please Wait...</p></div>

    return (
        <form onSubmit={handleSubmit} className="p-5 space-y-10">
            {/* Rating bar  */}
            {
                rating.map((_, index) => {
                    return <Button
                        isIconOnly
                        variant="light"
                        color="warning"
                        radius="full"
                        key={index}
                        onClick={() => updateRating(index + 1)}
                    >
                        {
                            selectedRating[index] ? <FaStar size={26} /> : <FaRegStar size={24} />
                        }
                    </Button>
                })
            }
            {/* Rich editor  */}
            <RichEditor placeholder="Write about book...." onChange={setContent} value={content} editable />
            {/* Submit Button  */}
            <Button isLoading={loading} type="submit" color="secondary" radius="md">Submit Review</Button>
        </form>
    )
}

export default Rate;