import { FC, useEffect, useState } from "react";
import { parseError } from "../utils/helper";
import client from "../api/client";
import { useParams } from "react-router-dom";
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
            <EpubReader url={url} />
        </div>
    )
}

export default ReadingBook;