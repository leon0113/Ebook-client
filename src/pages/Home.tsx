import BookByGenre from "../components/BookByGenre"
import Hero from "../components/Hero"

export default function Home() {

    return (
        <div className="space-y-10 px-5 lg:p-0">
            <Hero />
            <BookByGenre genre="Fantasy" />
            <BookByGenre genre="Thriller" />
            <BookByGenre genre="Action" />
        </div>
    )
}
