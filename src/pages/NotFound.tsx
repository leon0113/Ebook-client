import { Link } from "react-router-dom"

function NotFound() {
    return (
        <div className="flex-1 flex flex-col space-y-5 justify-center items-center">
            <h1 className="text-6xl font-bold opacity-50">404</h1>
            <h2 className="text-4xl font-semibold">No page found</h2>
            <Link className="text-xl text-sky-500" to='/'>Go To Home</Link>
        </div>
    )
}

export default NotFound