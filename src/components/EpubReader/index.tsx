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
import { LocationChangedEvent, RelocatedEvent } from "./types";
import HighlightOption from "./HighlightOption";
import { debounce } from "../../utils/helper";

interface Props {
    url?: string;
    title?: string;
    highlights: Highlight[];
    lastLocation?: string
    onHighlight(data: Highlight): void;
    onHighlightClear(cfi: string): void
    onLocationChanged(location: string): void
}


export type Highlight = {
    selection: string;
    fill: string;
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
};

const applyHighlights = async (rendition: Rendition, highlights: Highlight[]) => {
    highlights.forEach((highlight) => {
        rendition.annotations.remove(highlight.selection, "highlight")
        rendition.annotations.highlight(highlight.selection, undefined, undefined, undefined, { fill: highlight.fill })
    })
}


const EpubReader: FC<Props> = ({ url, title, highlights, onHighlight, onHighlightClear, onLocationChanged, lastLocation }) => {
    const [rendition, setRendition] = useState<Rendition>();
    const [loading, setLoading] = useState(true);
    const [tableOfContent, setTableOfContent] = useState<BookNavList[]>([]);
    const [showToc, setShowToc] = useState(false);
    const [setting, setSetting] = useState({
        fontSize: 22,
    });
    const [page, setPage] = useState({
        pageStart: 0,
        pageEnd: 0,
        totalPage: 0,
    });
    const [showHighlightOptions, setShowHighlightOptions] = useState(false);
    const [selectedCfi, setSelectedCfi] = useState('');

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

    const handleFontSize = (mode: "increase" | "decrease") => {
        if (!rendition) return;
        let { fontSize } = setting;
        if (mode === "increase") {
            fontSize += 2
        } else {
            fontSize -= 2
        }

        rendition.themes.fontSize(fontSize + 'px');
        setSetting({ ...setting, fontSize });
        updatePageCount(rendition);
    };

    const updatePageCount = (rendition: Rendition) => {
        const location = rendition.currentLocation() as unknown as RelocatedEvent;
        const pageStart = location.start.displayed.page;
        const pageEnd = location.end.displayed.page;
        const totalPage = location.end.displayed.total;
        setPage({ pageStart, pageEnd, totalPage })
    };

    const handleHighlightSelection = (color: string) => {
        if (!rendition) return;
        const newHighlight = { fill: color, selection: selectedCfi };
        applyHighlights(rendition, [newHighlight]);
        setShowHighlightOptions(false);
        onHighlight(newHighlight);
    };

    const handleHighlightClear = () => {
        if (!rendition) return;
        rendition.annotations.remove(selectedCfi, "highlight");
        setShowHighlightOptions(false);
        onHighlightClear(selectedCfi)
    }

    useEffect(() => {
        if (!rendition) return;
        rendition.themes.fontSize(setting.fontSize + "px");

        rendition.on("locationChanged", () => {
            applyHighlights(rendition, highlights);
        })
    }, [rendition, setting, highlights]);

    useEffect(() => {
        if (!url) return;
        const book = new Book(url);
        const { width, height } = getElementSize(wrapper)
        const rendition = book.renderTo(container, {
            width,
            height,
        });
        rendition.display(lastLocation);

        rendition.themes.register("light", LightTheme)
        rendition.themes.register("dark", DarkTheme)
        // hide TOC on clicking anywhere inside the book
        rendition.on("click", () => {
            hideToc();
        });
        // Counting book page
        // rendition.on("displayed", () => {
        //     console.log(rendition.currentLocation());
        // });

        rendition.on("displayed", () => {
            updatePageCount(rendition);

        });
        rendition.on("locationChanged", (e: LocationChangedEvent) => {
            onLocationChanged(e.start);
            updatePageCount(rendition);
        });

        const debounceSetShowHighlightOptions = debounce(setShowHighlightOptions, 3000)
        // text selection event
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        rendition.on("selected", (cfi: string) => {
            setShowHighlightOptions(true);
            setSelectedCfi(cfi);
            debounceSetShowHighlightOptions(false);
        });

        rendition.on("markClicked", (cfi: string) => {
            setShowHighlightOptions(true);
            setSelectedCfi(cfi);
            debounceSetShowHighlightOptions(false);
        });

        loadTableOfContent(book).then(setTableOfContent).finally(() => setLoading(false));

        setRendition(rendition);

        return () => {
            if (book)
                book.destroy();
        }
    }, [url, lastLocation]);

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
                        <FontOptions onFontDecrease={() => handleFontSize("decrease")} onFontIncrease={() => handleFontSize("increase")} />
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

            {/* Text Highlight components  */}
            <HighlightOption visible={showHighlightOptions} onSelect={handleHighlightSelection} onClear={handleHighlightClear} />

            {/* pagination  */}
            <div className="h-10 flex justify-center items-center opacity-50">
                <div className="flex-1 text-center">
                    <p>Page {`${page.pageStart} - ${page.totalPage}`}</p>
                </div>
                {
                    page.pageStart === page.pageEnd ? null : (<div className="flex-1 text-center">
                        <p>Page {`${page.pageEnd} - ${page.totalPage}`}</p>
                    </div>)
                }
            </div>
        </div>
    )
}

export default EpubReader;