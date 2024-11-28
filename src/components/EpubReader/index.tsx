/* eslint-disable @typescript-eslint/no-unused-vars */
import { FC, useEffect, useState } from "react";
import { Book, Rendition } from 'epubjs'
import Navigator from "./Navigator";
import LoadingIndicator from "./LoadingIndicator";
import TableOfContents, { BookNavList } from "./TableOfContents";

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
};

const loadTableOfContent = async (book: Book) => {
    const [nav, spine] = await Promise.all([book.loaded.navigation, book.loaded.spine]);


    const { toc } = nav;
    const navLabels: BookNavList[] = []

    toc.forEach((item) => {
        if (item.subitems?.length) {
            navLabels.push({
                label: { title: item.label, href: item.href },
                subItems: item.subitems.map(({ label, href }) => {
                    return {
                        title: label,
                        href
                    }
                })
            })
        } else {
            navLabels.push({
                label: { title: item.label, href: item.href },
                subItems: []
            })
        }
    })

    return navLabels;
}

const EpubReader: FC<Props> = ({ url }) => {
    const [rendition, setRendition] = useState<Rendition>();
    const [loading, setLoading] = useState(true);
    const [tableOfContent, setTableOfContent] = useState<BookNavList[]>([]);

    useEffect(() => {
        if (!url) return;
        const book = new Book(url);
        const { width, height } = getElementSize(wrapper)
        const rendition = book.renderTo(container, {
            width,
            height,
        });
        rendition.display();

        loadTableOfContent(book).then(setTableOfContent).finally(() => setLoading(false));

        setRendition(rendition);

        return () => {
            if (book)
                book.destroy();
        }
    }, [url])

    return (
        <div className="h-screen">
            <LoadingIndicator visible={loading} />
            <div id={wrapper} className="h-full relative group">
                <div id={container} />

                <Navigator side='left' onClick={() => rendition?.prev()} className="opacity-0 group-hover:opacity-100" />
                <Navigator side='right' onClick={() => rendition?.next()} className="opacity-0  group-hover:opacity-100" />
            </div>
            {/* ex data : [{ label: { title: "", href: "" }, subItems: [{ title: "", href: "" }] }] */}
            <TableOfContents data={tableOfContent} />

        </div>
    )
}

export default EpubReader;