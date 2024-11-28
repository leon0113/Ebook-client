import { FC, useEffect } from "react";
import { Book } from 'epubjs'

interface Props {
    url?: object
}

const container = "epub_container";

const EpubReader: FC<Props> = ({ url }) => {
    console.log(url);

    useEffect(() => {
        if (!url) return;
        const book = new Book(url);
        const rendition = book.renderTo(container, {
            width: 800,
            height: 600,
        });
        rendition.display()
    }, [url])

    return (
        <div>
            <div id={container} />
        </div>
    )
}

export default EpubReader;