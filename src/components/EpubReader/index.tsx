/* eslint-disable @typescript-eslint/no-unused-vars */
import { FC, useEffect, useState } from "react";
import { Book, Rendition } from 'epubjs'
import Navigator from "./Navigator";
import LoadingIndicator from "./LoadingIndicator";
import TableOfContents, { BookNavList } from "./TableOfContents";
import { Button } from "@nextui-org/react";
import { IoMenu } from "react-icons/io5";
import ThemeOptions from "./ThemeOptions";
import FontOptions from "./FontOptions";
import { MdOutlineStickyNote2 } from "react-icons/md";

interface Props {
    url?: object;
    title?: string;
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

const filterHref = (spineHrefList: string[], href: string) => {
    const filteredHref = spineHrefList.find((spineHref) => {
        const regex = new RegExp("[^/]+/([^/]+.xhtml)");
        const list = regex.exec(spineHref);
        if (list) {
            if (href.startsWith(list[1])) {
                return true;
            }
        }
    });

    return filteredHref || href;
};

const loadTableOfContent = async (book: Book) => {
    const [nav, spine] = await Promise.all([book.loaded.navigation, book.loaded.spine]);

    //handling spine case
    let spineHref: string[] = [];

    if (!Array.isArray(spine)) {
        const { spineByHref } = spine as { spineByHref: { [key: string]: number } };
        const entries = Object.entries(spineByHref);
        entries.sort((a, b) => a[1] - b[1])
        spineHref = entries.map(([key]) => key);
    }

    // handling Navigation case
    const { toc } = nav;
    const navLabels: BookNavList[] = [];

    toc.forEach((item) => {
        if (item.subitems?.length) {
            navLabels.push({
                label: { title: item.label, href: filterHref(spineHref, item.href) },
                subItems: item.subitems.map(({ label, href }) => {
                    return {
                        title: label,
                        href: filterHref(spineHref, href)
                    }
                })
            })
        } else {
            navLabels.push({
                label: { title: item.label, href: filterHref(spineHref, item.href) },
                subItems: []
            })
        }
    })
    return navLabels;
};

const LightTheme = {
    body: {
        color: "#000 !important",
        background: "#fff !important",
    },
    a: {
        color: "#283df7 !important",
    }
};

const DarkTheme = {
    body: {
        color: "#f8f8ea !important",
        background: "#2B2B2B !important",
    },
    a: {
        color: "#b6bdf7 !important",
    }
};


const selectTheme = (rendition: Rendition, mode: "light" | "dark") => {
    if (mode === 'light') {
        document.documentElement.classList.remove("dark");
    } else {
        document.documentElement.classList.add("dark");
    }

    rendition.themes.select(mode)
}


const EpubReader: FC<Props> = ({ url, title }) => {
    const [rendition, setRendition] = useState<Rendition>();
    const [loading, setLoading] = useState(true);
    const [tableOfContent, setTableOfContent] = useState<BookNavList[]>([]);
    const [showToc, setShowToc] = useState(false);

    const handleNavigation = (href: string) => {
        rendition?.display(href)
    };

    const toggleToc = () => {
        setShowToc(!showToc);
    };
    const hideToc = () => {
        setShowToc(false);
    };

    const handleThemeSelection = (mode: "light" | "dark") => {
        if (!rendition) return;

        selectTheme(rendition, mode)
    };

    useEffect(() => {
        if (!url) return;
        const book = new Book(url);
        const { width, height } = getElementSize(wrapper)
        const rendition = book.renderTo(container, {
            width,
            height,
        });
        rendition.display();

        rendition.themes.register("light", LightTheme)
        rendition.themes.register("dark", DarkTheme)
        // hide TOC on clicking anywhere inside the book
        rendition.on("click", () => {
            hideToc();
        })

        loadTableOfContent(book).then(setTableOfContent).finally(() => setLoading(false));

        setRendition(rendition);

        return () => {
            if (book)
                book.destroy();
        }
    }, [url])

    return (
        <div className="h-screen flex flex-col group dark:bg-book-dark dark:text-book-dark">
            <LoadingIndicator visible={loading} />

            <div className="flex items-center h-14 shadow-md opacity-0 group-hover:opacity-100 transition">
                <div className="pl-5 max-w-3xl md:pl-0 md:mx-auto">
                    <h1 className="line-clamp-1 font-semibold text-lg">{title}</h1>
                </div>

                <div className="flex items-center justify-center">
                    <div className="flex items-center justify-center gap-2">
                        <ThemeOptions onThemeSelect={handleThemeSelection} />
                        <FontOptions />
                        <Button isIconOnly variant="light">
                            <MdOutlineStickyNote2 size={30} />
                        </Button>

                        <Button onClick={toggleToc} variant="light" isIconOnly>
                            <IoMenu size={30} />
                        </Button>
                    </div>
                </div>
            </div>

            <div id={wrapper} className="h-full relative">
                <div id={container} />

                <Navigator side='left' onClick={() => {
                    rendition?.prev();
                    hideToc()
                }}
                    className="opacity-0 group-hover:opacity-100" />
                <Navigator side='right' onClick={() => {
                    rendition?.next();
                    hideToc()
                }}
                    className="opacity-0  group-hover:opacity-100" />
            </div>

            {/* ex data : [{ label: { title: "", href: "" }, subItems: [{ title: "", href: "" }] }] */}
            <TableOfContents visible={showToc} data={tableOfContent} onClick={handleNavigation} />

        </div>
    )
}

export default EpubReader;