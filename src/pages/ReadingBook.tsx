import { FC, useEffect, useState } from "react";
import { debounce, parseError } from "../utils/helper";
import client from "../api/client";
import { useParams, useSearchParams } from "react-router-dom";
import EpubReader, { Highlight } from "../components/EpubReader";

interface IBookURL {
    settings: {
        highlights: Highlight[];
        lastLocation: string;
    };
    url: string;
};

const updateLastLocation = async (bookId: string, location: string) => {
    await client.post('/history', {
        bookId,
        lastLocation: location,
        highlights: [{ selection: "", fill: '' },],
        removeHighlight: false
    })
};

const debounceUpdateLastLocation = debounce(updateLastLocation, 3000);

const ReadingBook: FC = () => {
    const { slug } = useParams();
    const [url, setUrl] = useState("");
    const [settings, setSettings] = useState<IBookURL['settings']>({ highlights: [], lastLocation: '' });
    const [searchParams] = useSearchParams();
    const title = searchParams.get("title");
    const bookId = searchParams.get("id");

    const handleOnHighlight = async (data: Highlight) => {
        setSettings({ ...settings, highlights: [...settings.highlights, data] });
        try {
            await client.post('/history', {
                bookId, highlights: [data],
            })
        } catch (error) {
            parseError(error)
        }
    };

    const handleOnHighlightClear = async (cfi: string) => {
        try {
            const newHighlights = settings.highlights.filter((h) => h.selection !== cfi);
            setSettings({ ...settings, highlights: newHighlights });
            await client.post('/history', {
                bookId, highlights: [{ selection: cfi, fill: '' },],
                removeHighlight: true
            })
        } catch (error) {
            parseError(error)
        }
    };

    const handleOnLocationChanged = async (location: string) => {
        try {
            if (bookId) {
                debounceUpdateLastLocation(bookId, location)
            }
            // await client.post('/history', {
            //     bookId,
            //     lastLocation: location,
            //     highlights: [{ selection: "", fill: '' },],
            //     removeHighlight: false
            // })
        } catch (error) {
            parseError(error)
        }
    }

    useEffect(() => {
        if (!slug) return;

        const fetchBookUrl = async () => {
            try {
                const { data } = await client.get<IBookURL>(`/book/read/${slug}`);
                // const res = await client.get(data.url, { responseType: 'blob' });
                setUrl(data.url);
                setSettings(data.settings);
            } catch (error) {
                parseError(error)
            }
        };
        fetchBookUrl();
    }, [slug])

    return (
        <div>
            <EpubReader
                url={url}
                title={title || ''}
                highlights={settings.highlights}
                onHighlight={handleOnHighlight}
                onHighlightClear={handleOnHighlightClear}
                onLocationChanged={handleOnLocationChanged}
                lastLocation={settings.lastLocation}
            />
        </div>
    )
}

export default ReadingBook;