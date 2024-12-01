import { Button } from "@nextui-org/react";
import clsx from "clsx";
import { FC } from "react";
import { MdOutlineClear } from "react-icons/md";

interface Props {
    visible?: boolean;
    onClear(): void;
    onSelect(color: string): void;
};

const colorOptions = ["red", "blue", "yellow"];

const HighlightOption: FC<Props> = ({ visible, onClear, onSelect }) => {
    return (
        <div className={clsx(visible ? "bottom-0" : "-bottom-14", "h-14 fixed z-50 left-0 right-0 flex items-center justify-center space-x-3 dark:bg-book-dark bg-gray-100 transition-all")}>
            {
                colorOptions.map((color, index) => {
                    return (
                        <button
                            onClick={() => onSelect(color)}
                            key={index}
                            className="w-6 h-6 rounded-full"
                            style={{ backgroundColor: color }}
                        ></button>
                    )
                })
            }

            <Button onClick={onClear} isIconOnly variant="light">
                <MdOutlineClear size={24} />
            </Button>
        </div>
    )
}

export default HighlightOption;