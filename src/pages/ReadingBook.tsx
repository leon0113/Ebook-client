import { FC, useEffect, useState } from "react";
import { parseError } from "../utils/helper";
import client from "../api/client";
import { useParams, useSearchParams } from "react-router-dom";
import EpubReader, { Highlight } from "../components/EpubReader";

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
    const [highlights, setHighlights] = useState<Highlight[]>([{ fill: "blue", selection: "epubcfi(/6/8!/4/4[id70268641846480]/4,/1:0,/1:59)" }]);
    const [searchParams] = useSearchParams();
    const title = searchParams.get("title");

    const handleOnHighlight = (data: Highlight) => {
        setHighlights([...highlights, data]);
    }

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
            <EpubReader url={url} title={title || ''} highlights={highlights} onHighlight={handleOnHighlight} />
        </div>
    )
}

export default ReadingBook;