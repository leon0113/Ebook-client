import { Divider } from "@nextui-org/react";


export default function GenreTitle({ title }: { title: string }) {
    return (
        <div>
            <p className="dark:bg-white dark:text-black bg-black text-white p-1 inline-block font-semibold rounded-t-md">
                {title}
            </p>
            <Divider className="dark:bg-white bg-black" />
        </div>
    )
}
