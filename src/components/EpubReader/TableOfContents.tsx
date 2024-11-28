import { FC } from "react";

interface Props {
    data: BookNavList[]
};

type BookNavItem = {
    title: string;
    href: string;
}

export interface BookNavList {
    label: BookNavItem;
    subItems: BookNavItem[];
}


const TableOfContents: FC<Props> = ({ data }) => {
    return (
        <div>
            {
                data.map(({ label, subItems }) => {
                    if (!subItems.length) {
                        return <div>
                            <p>{label.title}</p>
                        </div>
                    } else {
                        return <div>
                            {
                                subItems.map(({ title, href }) => {
                                    return <div>
                                        <p>{title}</p>
                                    </div>
                                })
                            }
                        </div>
                    }
                })
            }
        </div>
    )
}

export default TableOfContents;