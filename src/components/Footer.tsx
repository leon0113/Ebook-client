const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="container mx-auto text-center py-10">
            <p className="text-sm text-slate-900 dark:text-slate-50">
                All rights reserved &copy; {currentYear} by{" "}
                <a
                    href="https://github.com/leon0113"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold underline hover:text-blue-900"
                >
                    Leon
                </a>.
            </p>
        </footer>

    );
};

export default Footer;