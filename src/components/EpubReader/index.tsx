import { FC, useEffect } from "react";
import { Book } from 'epubjs'

interface Props {
    url?: object
}

const container = "epub_container";
const wrapper = "epub_wrapper";

const getElementSize = (id: string) => {
    const elem = document.getElementById(id);
    let width = 0;
    let height = 0;
    if (elem) {
        const result = elem.getBoundingClientRect();
        width = result.width;
        height = result.height;
    }
    return { width, height };
}

const EpubReader: FC<Props> = ({ url }) => {

    useEffect(() => {
        if (!url) return;
        const book = new Book(url);
        const { width, height } = getElementSize(wrapper)
        const rendition = book.renderTo(container, {
            width,
            height,
        });
        rendition.display();

        rendition.on("rendered", () => {
            rendition.next()
        })
    }, [url])

    return (
        <div className="h-screen">
            <div id={wrapper} className="h-full">
                <div id={container} />
            </div>
        </div>
    )
}

export default EpubReader;