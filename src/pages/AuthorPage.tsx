import { Link, User } from "@nextui-org/react";
import { FC, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import client from "../api/client";
import { IRecommendedBooks } from "../components/Recommended";
import RecommendedBooks from "../components/RecommendedBooks";
import RichEditor from "../components/rich-editor";
import { parseError } from "../utils/helper";



interface AuthorInfo {
    id: string;
    name: string;
    about: string;
    avatar: string
    socialLinks: {
        id: string,
        value: string
    }[];
    books: IRecommendedBooks[];
}

const AuthorPage: FC = () => {
    const [fetching, setFetching] = useState(true);
    const [authorInfo, setAuthorInfo] = useState<AuthorInfo>();
    const { id } = useParams();

    useEffect(() => {
        if (!id) return;

        const fetchAuthorInfo = async () => {
            try {
                const { data } = await client.get(`/author/${id}`);
                setAuthorInfo(data);
            } catch (error) {
                parseError(error);
            } finally {
                setFetching(false);
            }
        };

        fetchAuthorInfo();
    }, [id]);

    if (fetching)
        return (
            <div className="text-center pt-10, animate-pulse">
                <p>Loading...</p>
            </div>
        );

    return (
        <div className="p-5 lg:p-0">
            <User name={<p className="text-2xl font-semibold">{authorInfo?.name}</p>}
                avatarProps={{
                    src: `${authorInfo?.avatar}`
                }}
                className="text-2xl"
            />

            <div className="py-6 pl-10">
                <h1 className="font-semibold text-lg">Social Links:</h1>

                <div className="flex items-center space-x-2">
                    {authorInfo?.socialLinks?.map(({ id, value }) => {
                        const { host } = new URL(value);
                        return (
                            <div key={id}>
                                <Link
                                    className="font-semibold underline text-sky-600 hover:text-sky-900"
                                    href={value}
                                    target="_blank"
                                >
                                    {host}
                                </Link>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="pl-10 mt-3">
                <RichEditor value={authorInfo?.about} className="regular" />
            </div>

            <div className="mt-6">
                <RecommendedBooks data={authorInfo?.books || []} title="Related Books" />
            </div>
        </div>
    );
};

export default AuthorPage;