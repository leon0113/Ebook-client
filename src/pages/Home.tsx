import { Link } from "react-router-dom"
import BookByGenre from "../components/BookByGenre"
import Hero from "../components/Hero"

export default function Home() {

    return (
        <div className="space-y-10 px-5 lg:p-0 mb-20">
            <Hero />
            <BookByGenre genre="Fantasy" />
            <BookByGenre genre="Thriller" />
            <BookByGenre genre="Fiction" />

            <Link to='/books' className="text-xl font-semibold flex justify-center underline text-yellow-500 hover:text-yellow-600">See all book collection</Link>
        </div>
    )
}
