import { Button } from "@nextui-org/react";
import { FC } from "react";
import { FaArrowRightLong } from "react-icons/fa6";
import { Link } from "react-router-dom";
import Slider from 'react-slick';

const books = [
    {
        title: "The Enchanted Forest",
        slogan: "Discover the magic within. Explore",
        subtitle: "A journey through mystery and wonder.",
        cover: "https://marketplace.canva.com/EAFaQMYuZbo/1/0/1003w/canva-brown-rusty-mystery-novel-book-cover-hG1QhA7BiBU.jpg",

    },
    {
        title: "The Startup Hustle",
        slogan: "Grind. Build. Succeed. Happiness inside.",
        subtitle: "Lessons from the entrepreneurial trenches.",
        cover: "https://i.pinimg.com/736x/a1/f8/87/a1f88733921c820db477d054fe96afbb.jpg",

    },
    {
        title: "Galactic Voyagers",
        slogan: "To infinity and beyond. Face the Fear",
        subtitle: "Exploring the farthest reaches of space.",
        cover: "https://d1csarkz8obe9u.cloudfront.net/posterpreviews/art-book-cover-design-template-34323b0f0734dccded21e0e3bebf004c_screen.jpg?ts=1637015198",

    },
    {
        title: "Cooking with Passion",
        slogan: "Flavor beyond boundaries.",
        subtitle: "A culinary adventure like no other.",
        cover: "https://skyryedesign.com/wp-content/uploads/2016/04/56c6f9b7efad5-cover-books-design-illustrations.jpg",

    },
    {
        title: "The Art of Mindfulness",
        slogan: "Find your inner peace. Flavor beyond",
        subtitle: "Simple practices for a better life.",
        cover: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTQ6I3qh_LXrv3cekXyKNfj2co8QR98K0brUA&s",

    }
];


const Hero: FC = () => {
    return (
        <div className="overflow-hidden rounded-md p-5 bg-[#eeebe7] dark:bg-[#585858]">
            <Slider
                // dots
                infinite
                autoplay
                speed={2000}
                fade
                slidesToShow={1}
                slidesToScroll={1}
                autoplaySpeed={4000}
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
                                            to={`/books`}
                                        >
                                            Explore More
                                        </Button>
                                    </div>
                                </div>
                                <div className="flex-1 flex justify-center items-center p-5">
                                    <img src={book.cover} alt={book.title} className="md:w-48 w-32 h-60 md:h-80 rounded-md object-cover shadow-lg rotate-12" />
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
