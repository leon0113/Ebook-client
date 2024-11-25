import { Button } from "@nextui-org/react";
import { FC } from "react";
import { FaArrowRightLong } from "react-icons/fa6";
import { Link } from "react-router-dom";
import Slider from 'react-slick';

const books = [
    {
        title: "The Enchanted Forest",
        slogan: "Discover the magic within.",
        subtitle: "A journey through mystery and wonder.",
        cover: "https://m.media-amazon.com/images/I/91xYwvjIrIL._AC_UF1000,1000_QL80_.jpg",
        slug: ""
    },
    {
        title: "The Startup Hustle",
        slogan: "Grind. Build. Succeed.",
        subtitle: "Lessons from the entrepreneurial trenches.",
        cover: "https://m.media-amazon.com/images/I/91xYwvjIrIL._AC_UF1000,1000_QL80_.jpg",
        slug: ""
    },
    {
        title: "Galactic Voyagers",
        slogan: "To infinity and beyond.",
        subtitle: "Exploring the farthest reaches of space.",
        cover: "https://m.media-amazon.com/images/I/91xYwvjIrIL._AC_UF1000,1000_QL80_.jpg",
        slug: ""
    },
    {
        title: "Cooking with Passion",
        slogan: "Flavor beyond boundaries.",
        subtitle: "A culinary adventure like no other.",
        cover: "https://m.media-amazon.com/images/I/91xYwvjIrIL._AC_UF1000,1000_QL80_.jpg",
        slug: ""
    },
    {
        title: "The Art of Mindfulness",
        slogan: "Find your inner peace.",
        subtitle: "Simple practices for a better life.",
        cover: "https://m.media-amazon.com/images/I/91xYwvjIrIL._AC_UF1000,1000_QL80_.jpg",
        slug: ""
    }
];


const Hero: FC = () => {
    return (
        <div className="overflow-hidden rounded-md p-5 bg-[#eeebe7] dark:bg-[#585858]">
            <Slider
                dots
                infinite
                autoplay
                speed={1000}
                fade
                slidesToShow={1}
                slidesToScroll={1}
                autoplaySpeed={3000}
            >
                {
                    books.map((book) => {
                        return <div key={book.title}>
                            <div className="md:flex justify-between gap-5 ">
                                <div className="flex-1 flex flex-col justify-center p-5">
                                    <div>
                                        <h1 className="lg:text-6xl text-3xl">{book.slogan}</h1>
                                        <p className="md:text-lg mt-3 italic">{book.subtitle}</p>
                                    </div>
                                    <div className="mt-3">
                                        <Button
                                            radius="sm"
                                            // color="danger"
                                            className="text-white bg-black dark:text-white"

                                            variant="solid"

                                            endContent={<FaArrowRightLong />}
                                            as={Link}
                                            to={`/books/${book.slug}`}
                                        >
                                            Learn More
                                        </Button>
                                    </div>
                                </div>
                                <div className="flex-1 flex justify-center items-center p-5">
                                    <img src={book.cover} alt={book.title} className="md:w-48 w-32 rounded-md object-cover shadow-lg rotate-12" />
                                </div>
                            </div>
                        </div>
                    })
                }
            </Slider>
        </div>
    )
}

export default Hero;
