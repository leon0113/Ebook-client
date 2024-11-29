import { FC, useEffect, useState } from "react";
import { parseError } from "../utils/helper";
import client from "../api/client";
import { useParams, useSearchParams } from "react-router-dom";
import EpubReader from "../components/EpubReader";

interface IBookURL {
    settings: {
        highlights: string[];
        lastLocation: string;
    };
    url: string;
}

const ReadingBook: FC = () => {
    const { slug } = useParams();
    const [url, setUrl] = useState<object>();
    const [searchParams] = useSearchParams();

    const title = searchParams.get("title");

    useEffect(() => {
        if (!slug) return;

        const fetchBookUrl = async () => {
            try {
                const { data } = await client.get<IBookURL>(`/book/read/${slug}`);
                const res = await client.get(data.url, { responseType: 'blob' });
                setUrl(res.data);
            } catch (error) {
                parseError(error)
            }
        };
        fetchBookUrl();
    }, [slug])

    return (
        <div>
            <EpubReader url={url} title={title || ''} />
        </div>
    )
}

export default ReadingBook;