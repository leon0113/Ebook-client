import { FC } from "react";
import Navbar from "./Navbar";

interface Props {
    children: React.ReactNode;
}

const Container: FC<Props> = ({ children }) => {
    return (
        <div className="min-h-screen max-w-5xl mx-auto flex flex-col">
            <Navbar />
            <div className="flex-1 border-2 flex flex-col">
                {children}
            </div>
        </div>
    )
}

export default Container

