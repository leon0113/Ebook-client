import { Button } from "@nextui-org/react";
import clsx from "clsx";
import { FC, ReactNode } from "react";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";

interface Props {
    side: 'left' | 'right';
    onClick(): void;
    className?: string;
}

const Navigator: FC<Props> = ({ side, onClick, className }) => {

    let icon: ReactNode = <></>;
    let classedBySide = '';

    if (side === 'left') {
        icon = <FaAngleLeft />
        classedBySide = "left-0 pl-5"
    };

    if (side === 'right') {
        icon = <FaAngleRight />
        classedBySide = "right-0 pr-5"
    }

    return (
        <div className={clsx("fixed top-1/2 transition", classedBySide, className)}>
            <Button
                radius="full"
                variant="bordered"
                isIconOnly
                className=""
                onClick={onClick}
            >
                {icon}
            </Button>
        </div>
    )
}

export default Navigator;