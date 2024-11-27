import { FC } from "react";
import GenreTitle from "./common/GenreTitle";
import { User } from "@nextui-org/react";
import { FaStar } from "react-icons/fa6";
import { Link } from "react-router-dom";
import RichEditor from "./rich-editor";

interface Props {
    title: string;
    id?: string;
    reviews: iReviewRes[];
}

export interface iReviewRes {
    id: string;
    rating: number;
    date: string;
    content?: string;
    userId: {
        id: string;
        name: string;
        avatar?: {
            url: string;
            id: string;
        };
    };
}



const ReviewSection: FC<Props> = ({ id, title, reviews }) => {
    if (!reviews.length)
        return (
            <div className="pb-20">
                <GenreTitle title={title} />

                <div className="mt-6">
                    <p className="text-xl">
                        Be the first to{" "}
                        <Link to={`/rate/${id}`} className="underline font-semibold">
                            add a review
                        </Link>
                    </p>
                </div>
            </div>
        );

    return (
        <div className="pb-20">
            <GenreTitle title={title} />
            <div className="mt-6 space-y-6">
                {reviews.map((review) => {
                    return (
                        <div key={review.id}>
                            <User
                                name={review.userId.name}
                                avatarProps={{
                                    src: review.userId.avatar?.url,
                                }}
                                description={
                                    <div className="flex items-center space-x-1">
                                        <span className="text-black font-semibold">{review.rating}</span>
                                        <FaStar className="text-yellow-500" />
                                    </div>
                                }
                                className="text-xl font-semibold"
                            />
                            <div className="pl-10">
                                <RichEditor value={review.content} className="" />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ReviewSection;
