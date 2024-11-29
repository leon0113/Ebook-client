/* eslint-disable @typescript-eslint/no-unused-vars */
import { Accordion, AccordionItem } from "@nextui-org/react";
import { FC } from "react";

interface Props {
    data: BookNavList[];
    onClick(href: string): void;
};

type BookNavItem = {
    title: string;
    href: string;
}

export interface BookNavList {
    label: BookNavItem;
    subItems: BookNavItem[];
}


const TableOfContents: FC<Props> = ({ data, onClick }) => {
    return (
        <div className="w-96 bg-slate-300 h-screen overflow-y-scroll fixed top-0 right-0 flex flex-col space-x-3 z-50 p-5 shadow-md">
            {
                data.map(({ label, subItems }) => {
                    if (!subItems.length) {
                        return <div key={label.title}>
                            <p
                                onClick={() => onClick(label.href)}
                                className="py-2 text-lg hover:underline hover:text-slate-700 cursor-pointer"
                            >{label.title}
                            </p>
                        </div>
                    } else {
                        return <Accordion key={label.title} title={label.title}>
                            <AccordionItem title={label.title}>
                                <div className="space-y-3">
                                    {
                                        subItems.map(({ title, href }) => {
                                            return (
                                                <p
                                                    key={title}
                                                    onClick={() => onClick(href)}
                                                    className="pl-6 text-lg hover:underline hover:text-slate-700 cursor-pointer">{title}
                                                </p>
                                            )

                                        })
                                    }
                                </div>
                            </AccordionItem>
                        </Accordion>
                    }
                })
            }
        </div>
    )
}

export default TableOfContents;