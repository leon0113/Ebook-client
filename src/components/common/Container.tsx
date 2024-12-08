import { FC } from "react";
import Navbar from "./Navbar";
import { useLocation } from "react-router-dom";
import Footer from "../Footer";

interface Props {
    children: React.ReactNode;
}

const Container: FC<Props> = ({ children }) => {
    const { pathname } = useLocation();

    const readingMode = pathname.startsWith("/read/");

    if (readingMode) return children;

    return (
        <div className="min-h-screen max-w-5xl mx-auto flex flex-col">
            <Navbar />
            <div className="flex-1  flex flex-col">
                {children}
            </div>

            <Footer />
        </div>
    )
}

export default Container

