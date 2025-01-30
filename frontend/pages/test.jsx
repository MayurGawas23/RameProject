import React from 'react'
import Footer from '@/components/Footer';
import Header from '../components/Header';
import { useAuth } from '../utils/auth';
import Link from "next/link"; // Corrected import
import Autoplay from "embla-carousel-autoplay"


import { Card, CardContent } from "@/components/ui/card"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import { ChevronRight } from 'lucide-react';
export default function HomePage() {
    const { user } = useAuth(); // Destructure `user` from the Auth context
    const plugin = React.useRef(
        Autoplay({ delay: 2000, stopOnInteraction: true, loop: true })
    );

    return (
        <div className="w-full h-screen flex flex-col">
            <Header />
            <div className="flex-grow flex flex-col lg:flex-row bg-gray-100">
                {/* Left Content */}
                <div className="lg:w-[72%] w-full p-2">
                    {/* Carousel Section */}
                    <div className="w-full lg:h-[300px] md:h-[300px] sm:h-[100px]  flex  lg:justify-around md:justify-center py-2 px-4 lg:px-[50px] md:px-[50px] mb-8 ">
                        <div className="lg:h-[258px] sm:h-[100px]  mt-4 w-full max-w-[800px] bg-gray-100 shadow-md rounded-sm sm:py-2 ">
                            <Carousel
                                plugins={[plugin.current]}
                                className="w-full h-full rounded-sm"
                                onMouseEnter={plugin.current.stop}
                                onMouseLeave={plugin.current.reset}
                            >
                                <CarouselContent className="rounded-sm h-full">
                                    {["banner0.jpg", "banner2.jpg", "banner1.jpg", "banner3.jpg"].map((src, index) => (
                                        <CarouselItem key={index} className="rounded-sm w-full lg:h-[250px] md:h-[200px] sm:h-[200px] ">
                                            <Card className="h-full w-full border-none rounded-sm">
                                                <CardContent className="flex w-full h-full items-center justify-center p-0">
                                                    <img
                                                        src={src}
                                                        alt={`Slide ${index + 1}`}
                                                        className="w-full h-full rounded-sm"
                                                    />
                                                </CardContent>
                                            </Card>
                                        </CarouselItem>
                                    ))}
                                </CarouselContent>
                            </Carousel>
                        </div>
                        {/* Our Book (Visible only on desktop screens to the right of carousel) */}
                        <div className="hidden md:hidden lg:block ml-12">
                            <h1 className="font-bold mb-4">Our Book</h1>
                            <div className="shadow h-[230px] w-[180px] bg-white rounded-sm">
                                <img
                                    src="RAMEN 2021 COVER PAGE A42.jpg"
                                    alt="Our Book"
                                    className="h-full w-full rounded-sm"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Hero Section */}
                    <div className="text-center mb-8">
                        <h1 className="font-bold text-xl lg:text-2xl mb-2">
                            Your Gateway to Knowledge and Research
                        </h1>
                        <p>
                            Explore our journals, access books, and join global conferences to enhance your research.
                        </p>
                    </div>

                    {/* Featured Sections */}
                    <div className="flex flex-wrap justify-center lg:justify-evenly gap-4">
                        
                        <div className="w-full sm:w-[48%] lg:w-[30%] p-4 bg-white rounded-sm shadow-sm"                            >
                            <h1 className="font-extrabold text-lg mb-2">Journals</h1>
                            <p className="mb-4 text-sm text-gray-600">Stay informed with our peer-reviewed journals, featuring cutting-edge research and scholarly articles across various disciplines.</p>
                            <Link href='journals' className="text-blue-700 text-lg hover:underline cursor-pointer flex items-center gap-1">
                               View Journals <ChevronRight className="relative top-[2px]" />
                            </Link >
                        </div>
                        <div className="w-full sm:w-[48%] lg:w-[30%] p-4 bg-white rounded-sm shadow-sm"                            >
                            <h1 className="font-extrabold text-lg mb-2">Conferences</h1>
                            <p className="mb-4 text-sm text-gray-600">Connect, collaborate, and innovate with leading minds at our conferences. Discover the latest trends and groundbreaking research in your field.</p>
                            <Link href='journals' className="text-blue-700 text-lg hover:underline cursor-pointer flex items-center gap-1">
                               Visit Conferences <ChevronRight className="relative top-[2px]" />
                            </Link >
                        </div>
                        <div className="w-full sm:w-[48%] lg:w-[30%] p-4 bg-white rounded-sm shadow-sm"                            >
                            <h1 className="font-extrabold text-lg mb-2">Books</h1>
                            <p className="mb-4 text-sm text-gray-600">Dive into a world of knowledge with our curated collection of books, spanning diverse subjects and expert insights to fuel your curiosity.</p>
                            <Link href='journals' className="text-blue-700 text-lg hover:underline cursor-pointer flex items-center gap-1">
                               Explore Books <ChevronRight className="relative top-[2px]" />
                            </Link >
                        </div>
                      
                    </div>
                </div>

                {/* Right Content */}
                <div className="lg:w-[28%] w-full bg-gray-100 border-l border-gray-300 px-4 py-6">
                    <div className="flex flex-col gap-8 ">
                        {/* Latest Issues */}
                        <div>
                            <h1 className="font-bold mb-4">Latest Issues</h1>
                            <div className="flex flex-wrap gap-4 justify-around">
                                {[1, 2].map((_, index) => (
                                    <div
                                        key={index}
                                        className="shadow h-[250px] w-[190px] bg-white rounded-sm p-4 flex flex-col justify-between"
                                    >
                                        <h1 className="font-semibold">Volume 10: Issue 4</h1>
                                        <p className="text-sm text-zinc-500">October - December 2024</p>
                                        <img
                                            src="IJAEFEA COVER PAGE NEW.jpg"
                                            alt="Issue Cover"
                                            className="w-10 my-2"
                                        />
                                        <p className="text-sm line-clamp-2">
                                            {index === 0
                                                ? "Journal of Thermal Fluids"
                                                : "International Journal of Computational and Electronic Aspects in Engineering"}
                                        </p>
                                        <h1 className="text-blue-600 hover:underline cursor-pointer flex items-center gap-1">
                                            Explore More <ChevronRight />
                                        </h1>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Latest Conferences */}
                        <div className='mt-8'>
                            <h1 className="font-bold mb-4">Latest Conferences</h1>
                            <div className="shadow h-[190px] w-full bg-white rounded-sm p-4">
                                <h1 className="hover:underline cursor-pointer mb-2">
                                    Second International Conference on Robotics, Automation and Intelligent Computing
                                    (ICRAIC 2K24)
                                </h1>
                                <p className="text-sm text-gray-500 mb-4">18-19 May 2024</p>
                                <h1 className="text-blue-600 hover:underline cursor-pointer flex items-center gap-1">
                                    Explore More <ChevronRight />
                                </h1>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Our Book (Visible only on small screens, above the footer) */}
            <div className="block lg:hidden px-4  py-2">
                <h1 className="font-bold mb-2 text-center">Our Book</h1>
                <div className="shadow h-[250px] w-[190px] mx-auto bg-white rounded-sm">
                    <img
                        src="RAMEN 2021 COVER PAGE A42.jpg"
                        alt="Our Book"
                        className="h-full w-full rounded-sm"
                    />
                </div>
            </div>

            <Footer />
        </div>
    );
}
