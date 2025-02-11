"use client";
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from "gsap/all";
// import { ReactLenis } from "@studio-freight/react-lenis";
import React from 'react';
import Footer from '@/components/Footer';
import Header from '../components/Header';
import { useAuth } from '../utils/auth';
import Link from "next/link";
import Autoplay from "embla-carousel-autoplay";
import Cards from '@/components/Cards';
import { Card, CardContent, CardDescription } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { ChevronRight, MoveRight } from 'lucide-react';
import Head from 'next/head';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

gsap.registerPlugin(useGSAP);
gsap.registerPlugin(ScrollTrigger);

export default function HomePage() {
    const [animationTriggered, setAnimationTriggered] = useState(false);
    const { user } = useAuth();
    const plugin = React.useRef(
        Autoplay({ delay: 2000, stopOnInteraction: true, loop: true }),
    );

    const cards = [
        { title: "Journals", desc: "Stay informed with our peer-reviewed journals, featuring cutting-edge research and scholarly articles across various disciplines.", link: "Explore Journals", route: `/journals` },
        { title: "Books", desc: "Dive into a world of knowledge with our curated collection of books, spanning diverse subjects and expert insights to fuel your curiosity.", link: "View Books", route: `/books` },
        { title: "Conferences", desc: "Connect, collaborate, and innovate with leading minds at our conferences. Share your knowledge in RAME online conferences.", link: "Visit Conferences", route: '/confernces' },
    ];

    const container = useRef();
    const section2Ref = useRef(null);
    const router = useRouter();

    const animateCards = () => {
        const cards = gsap.utils.toArray(".card");

        gsap.set(cards, { opacity: 1 });

        gsap.from(cards, {
            x: 800,
            opacity: 0,
            duration: 1.5,
            stagger: 0.1,
            ease: "power2.out",
            scrub: 2
        });
    };

    const animateHero = () => {
        gsap.from("#hero", {
            scaleX: 0,
            transformOrigin: "0% 100%",
            delay: 0.5,
            duration: 0.8,
            ease: "power2.out",
            perspective: "100px",
            stagger: 0.3
        })
        gsap.from(".herobutton", {
            y: 50,
            duration: 1,
            ease: "power2.out",
            opacity: 0,
            delay: 1.1,
            transformOrigin: "0% 300%",
            perspective: "1110px",
        })
        gsap.from("#slider", {
            opacity: 0,
            duration: 1,
            ease: "power2.out",
            scale: 0,
            transformOrigin: "50% 25%",
            delay: 1.5
        })
    };

    useGSAP(() => {
        animateHero();
    }, { scope: container })

    const animateTest = () => {
        gsap.from("#test", {
            x: -1000,
            duration: 1,
            ease: "power2.out",
            stagger: 0.8,
            opacity: 0,
            ScrollTrigger: {
                trigger: "#test",
                start: "top 10%",
                end: "top 50%",
                markers: true
            }
        });
    };

    const animateTiles = () => {
        gsap.from("#right-tiles", {
            // delay: 1,
            scaleX: 0,
            transformOrigin: "100% 50%",
            duration: 1,
            ease: "power2.out",
            stagger: 0.2
        })
        gsap.from("#left-tile", {
            // delay: 1,
            scaleX: 0,
            transformOrigin: "0% 50%",
            duration: 1,
            ease: "power2.out",
            stagger: 0.2
        })
        gsap.from("#right-text", {
            x: 1000,
            opacity: 0,
            ease: "power2.out",
            duration: 1,
            delay: 1,
            stagger: 0.3
        })
    }

    useGSAP(() => {
        if (!animationTriggered) {
            ScrollTrigger.create({
                trigger: ".cards ",
                start: "top 92%",
                end: "top 0%",
                markers: true,
                onEnter: () => {
                    animateCards();
                    animateTest();
                    animateTiles()
                },

            });
        }
    }, { scope: container });

    const handleExploreClick = () => {
        if (section2Ref.current) {
            section2Ref.current.scrollIntoView({ behavior: "smooth" });
            setTimeout(() => {
                animateCards();
                animateTest();
                animateTiles();
                setAnimationTriggered(true);
            }, 0);
        }
    };

    useEffect(() => {
        if (animationTriggered) {
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        }
    }, [animationTriggered]);


    const IssueCard = () => {
        gsap.to('#issue', {
            y: -350,
            duration: 1,
            ease: "power2.out",
            rotate: "0deg"
        })
    }
    const IssueCardLeave = () => {
        gsap.to('#issue', {
            y: 0,
            duration: 1,
            ease: "power2.out",
            rotate: "-6deg"
        })
    }

    const BookCard = () => {
        gsap.to('#book', {
            y: -180,
            duration: 1,
            ease: "power2.out",
            rotate: "0deg",
            zIndex: 20
        })
    }
    const BookCardLeave = () => {
        gsap.to('#book', {
            y: 0,
            duration: 1,
            ease: "power2.out",
            rotate: "6deg",
            zIndex: 9
        })
    }

    const ConferenceCard = () => {
        gsap.to('#conference', {
            y: -180,
            duration: 1,
            ease: "power2.out",
            rotate: "0deg",
            zIndex: 20
        })
    }
    const ConferenceCardLeave = () => {
        gsap.to('#conference', {
            y: 0,
            duration: 1,
            ease: "power2.out",
            rotate: "18deg",
            zIndex: 7
        })
    }

    const [latestIssues, setLatestIssues] = useState([]);


    useEffect(() => {
        const fetchLatestIssues = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/latest-issues`);
                if (!res.ok) throw new Error("Failed to fetch latest issues");

                const data = await res.json();
                setLatestIssues(data);
            } catch (error) {
                console.error("Error fetching latest issues:", error);
            }
        };

        fetchLatestIssues();
    }, []);

    return (
        <>
            <Head>
                <Head>
                    <title>Home</title>
                    <meta name="description" content="Discover high-quality, peer-reviewed journals, books, and conferences. Stay ahead in research and innovation." />
                    <meta name="keywords" content="peer-reviewed journals, books, research, conferences, publications" />
                    <meta property="og:title" content="Home | Peer-Reviewed Journals & Conferences" />
                    <meta property="og:description" content="Explore our peer-reviewed journals, books, and conferences to advance your research." />
                    <meta property="og:type" content="website" />
                    <meta property="og:url" content="https://yourwebsite.com/" />
                    <meta name="twitter:card" content="summary_large_image" />
                    <meta name="twitter:title" content="Home | Peer-Reviewed Journals & Conferences" />
                    <meta name="twitter:description" content="Explore peer-reviewed journals and books to enhance your research." />
                </Head>
            </Head>
            {/* <ReactLenis root> */}
            <div className="w-full h-full flex flex-col " ref={container}>
                <Header />
                <div className="h-full">
                    <section className='flex flex-col pt-10 h-screen items-center'>
                        <div className="flex flex-col flex-1 items-start justify-center  text-left mb-[10px]  ">
                            <h1 id='hero' className='font-[condensed-medium] text-6xl mb-4'>Your Gateway to Knowledge and Research</h1>
                            <p id='hero' className='text-xl mb-4'>Explore our journals, access books, and join global conferences to enhance your research.</p>
                            <Link href={'#section2'} className='herobutton' >
                                <Button className=" herobutton bg-[#1f7177] hover:bg-[#298b92]" onClick={handleExploreClick}>
                                    Explore US
                                </Button>
                            </Link>
                        </div>
                        <div className="flex-1 w-[50%]">
                            <Carousel id='slider'
                                plugins={[plugin.current]}
                                className="w-full h-full rounded-sm"
                                onMouseEnter={plugin.current.stop}
                                onMouseLeave={plugin.current.reset}
                            >
                                <CarouselContent className="rounded-sm h-full">
                                    {["banner0.jpg", "banner2.jpg", "banner1.jpg", "banner3.jpg"].map((src, index) => (
                                        <CarouselItem key={index} className="rounded-sm w-full lg:h-[250px] md:h-[200px] sm:h-[200px]">
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
                    </section>

                    <section id="section2" ref={section2Ref} className='cards bg-greeen-400  pt-10 w-full mx-auto h-screen gap-4 flex flex-col '>
                        <div className=" flex flex-1 w-full p-10 bg-slatee-400 overflow-x-hidden ">
                            <div id='left-tile' className="  h-full w-[30%] flex flex-col  px-[70px] py-4 items-start">
                                <h3 id='test' className=' font-[condensed-medium] tracking-tighter  text-8xl'>Explore <br></br> <span className='text-8xl font-[condensed-medium]  tracking-tight'> us</span></h3>
                            </div>
                            <div id='right-tile' className="flex flex-3 w-full justify-around items-center bg-grefen-200 gap-2">
                                <div id='right-tiles' onClick={() => router.push('/journals')} className=" overflow-hidden bg-yellfow-300 bfg-[#ffb55a] bg-[#f19525] h-full w-full border flex flex-col justify-between p-10 cursor-pointer ">
                                    <h3 className='font-[condensed-medium] text-6xl relative z-10 text-[#172b2c]'>JOURNALS</h3>
                                    <div className="">
                                        <p className='mb-4 text-whifte text-xl z-10 relative '>Stay informed with our peer-reviewed journals, featuring cutting-edge research and scholarly articles across various disciplines.</p>
                                        <Link href={'/journals'} className=' shadow-lg rounded-sm px-4 text-blue-600 bg-white inline-flex p-2  hover:underline'>Explore Journals<ChevronRight /></Link>
                                    </div>
                                    {/* <div className=" z-1 h-[500px] w-[500px] bg-[#ffb55a] bfg-[#f19525] absolute -top-[350px] -left-[200px]  rounded-full"></div> */}
                                </div>
                                <div id='right-tiles' onClick={() => router.push('/journals')} className="bg-yelflow-300 bg-[#ffa63a] h-full w-full border flex flex-col justify-between p-10 cursor-pointer">
                                    <h3 className='font-[condensed-medium] text-6xl text-[#172b2c]'>BOOKS</h3>
                                    <div className="">
                                        <p className='mb-4 text-whit text-xl z-10 relative'>Dive into a world of knowledge with our curated collection of books, spanning diverse subjects and expert insights to fuel your curiosity.</p>
                                        <Link href={'/books'} className='shadow-lg rounded-sm px-4 text-blue-600 bg-white inline-flex p-2  hover:underline'>View Books<ChevronRight /></Link>
                                    </div>
                                </div>
                                <div id='right-tiles' onClick={() => router.push('/journals')} className="bg-yelfflow-300 bg-[#ffb355] h-full w-full border flex flex-col justify-between p-10 cursor-pointer ">
                                    <h3 className='font-[condensed-medium] text-6xl text-[#172b2c]'>CONFERENCES</h3>
                                    <div className="">
                                        <p className='mb-4 text-whit text-xl z-10 relative'>Connect, collaborate, and innovate with leading minds at our conferences. Share your knowledge in RAME online conferences.</p>
                                        <Link href={'/conferences'} className='shadow-lg rounded-sm px-4 text-blue-600 bg-white inline-flex p-2  hover:underline'>Visit Conferences<ChevronRight /></Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-blfrue-500 flex flex-1 w-full h-[300px] p-10 bg-zeinc-400 overflow-x-hidden ">
                            <div id='right-tile' className="flex flex-3 w-full justify-around items-center bg-grfeen-200 gap-2">
                                <div id='left-tile' onClick={() => router.push('/journals')} className="bg-yellfow-300 bg-[#60ccd4] h-full w-full border flex flex-col justify-between p-10 cursor-pointer ">
                                    <h3 className='font-[condensed-medium] text-6xl text-[#C77f40E]'>AUTHOR'S GUIDELINES</h3>
                                    <div className="flex justify-end ">
                                        <MoveRight className='w-[100px]  text-6xl' />
                                    </div>
                                </div>
                                <div id='left-tile' onClick={() => router.push('/journals')} className="bg-yelflow-300  bg-[#54c9d2] h-full w-full border flex flex-col justify-between p-10 cursor-pointer ">
                                    <h3 className='font-[condensed-medium] text-6xl'>PUBLICATION POLICIES & ETHICS</h3>
                                    <div className="flex justify-end ">
                                        <MoveRight className='w-[100px] - text-6xl' />
                                    </div>
                                </div>
                                <div id='left-tile' onClick={() => router.push('/journals')} className="bg-yelflow-300 bg-[#45b1ba] h-full w-full border flex flex-col justify-between p-10 cursor-pointer ">
                                    <h3 className='font-[condensed-medium] text-6xl'>WORKFLOW</h3>
                                    <div className="flex justify-end ">
                                        <MoveRight className='w-[100px]  text-6xl' />
                                    </div>
                                </div>
                            </div>
                            <div id='right-text' className="  h-full w-[30%] flex flex-col  px-[70px] py-4 items-start">
                                <h3 id='test' className='font-[condensed-medium] tracking-tighter  text-8xl'>Publishing <span className='text-8xl font-[condensed-medium]  tracking-tight'>with us</span></h3>
                                <Button className="mt-8 bg-blue-600 p-8 hover:bg-blue-500 text-lg">Submit an Article </Button>
                            </div>
                        </div>
                    </section>
                    <section id="section3" className='w-full overflow-hidden bdg-[#fff5c4]'>

                        <div className="bg-yellfeow-200 flex gap-2 justify-center items-end  ">

                            <div id='issue' onMouseEnter={IssueCard} onMouseLeave={IssueCardLeave} className=" z-10 h-[600px] w-[400px] relative top-[400px] left-[50px] bg-reswd-500 rounded-lg -rotate-6">
                                <h3 className='relative font-[condensed-medium] text-lg'>Latest Issues</h3>
                                <div className=" border-white border-4 bg-zinc-200 h-full p-1 ">
                                    {latestIssues.map((issue, index) => (
                                        <div
                                            key={index}
                                            className="shadow h-[250px] w-full border bg-white rounded-sm p-4 mb-2 flex flex-col justify-between"
                                        >
                                            {/* Header Section */}
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h5 className="font-semibold">
                                                        Volume {issue.volumeNumber}: Issue {issue.issueNumber}
                                                    </h5>
                                                    <p className="text-sm text-zinc-500">
                                                        {issue.dateRange !== "Unknown Date" ? issue.dateRange : "Date Not Available"}
                                                    </p>
                                                </div>
                                                {issue.journalCover && (
                                                    <img src={issue.journalCover} alt="Journal Cover" className="w-20 my-2 rounded-md shadow" />
                                                )}
                                            </div>

                                            {/* Journal Title */}
                                            <p className="text-sm font-bold mt-2">{issue.journalTitle || "Journal Title Not Available"}</p>

                                            {/* Latest Paper */}
                                            <p className="text-sm italic text-gray-600">
                                                Latest Paper: {issue.latestPaperTitle && issue.latestPaperTitle !== "No papers available"
                                                    ? issue.latestPaperTitle
                                                    : "No recent papers"}
                                            </p>

                                            {/* Explore More */}
                                            <h1 className="text-blue-600 hover:underline cursor-pointer flex items-center gap-1 mt-2">
                                                See More <ChevronRight />
                                            </h1>
                                        </div>
                                    ))}

                                    {/*<div
                                        //    key={index}
                                        className="shadow h-[250px] w-full border bg-white rounded-sm p-4 mb-2 flex flex-col justify-between"
                                    >
                                        <div className="flex justify-between ">
                                        <div className="">
                                        <h5 className="font-semibold">Volume 10: Issue 4</h5>
                                        <p className="text-sm text-zinc-500">October - December 2024</p>
                                        </div>
                                        <img
                                            src="IJAEFEA COVER PAGE NEW.jpg"
                                            alt="Issue Cover"
                                            className="w-20 my-2"
                                        />
                                        </div>
                                        <p className="text-sm line-clamp-2">
                                     
                                            "International Journal of Computational and Electronic Aspects in Engineering"
                                           
                                        </p>
                                        <h1 className="text-blue-600 hover:underline cursor-pointer flex items-center gap-1">
                                            Explore More <ChevronRight />
                                        </h1>
                                    </div>
                                    <div
                                        //    key={index}
                                        className="shadow h-[250px] w-full border bg-white rounded-sm p-4 mb-2 flex flex-col justify-between"
                                    >
                                        <div className="flex justify-between ">
                                        <div className="">
                                        <h5 className="font-semibold">Volume 10: Issue 4</h5>
                                        <p className="text-sm text-zinc-500">October - December 2024</p>
                                        </div>
                                        <img
                                            src="IJAEFEA COVER PAGE NEW.jpg"
                                            alt="Issue Cover"
                                            className="w-20 my-2"
                                        />
                                        </div>
                                        <p className="text-sm line-clamp-2">
                                         
                                                                           
                                            "International Journal of Computational and Electronic Aspects in Engineering"
                                         
                                        </p>
                                        <h3 className="text-blue-600 hover:underline cursor-pointer flex items-center gap-1">
                                            Explore More <ChevronRight />
                                        </h3>
                                    </div>*/}

                                </div>
                            </div>


                            <div id='book' onMouseEnter={BookCard} onMouseLeave={BookCardLeave} className="z-9 h-[400px] w-[300px] relative top-[150px] bg-grefen-500 rounded-lg rotate-6">
                                <h3 className='relative font-[condensed-medium] text-lg'>Our Book</h3>
                                <div className=" border-white border-8 ">
                                    <img src='/RAMEN 2021 COVER PAGE A42.jpg' className='h-full w-full' />

                                </div>
                            </div>


                            <div id='conference' onMouseEnter={ConferenceCard} onMouseLeave={ConferenceCardLeave} className=" h-[400px] w-[400px]  relative right-[50px] rotate-[18deg] top-[200px]  bg-blure-500 rounded-lg">
                                <h3 className='relative font-[condensed-medium] text-lg'>Latest Conferences</h3>
                                <div className=" border-white border-4 bg-blf bg-white ue-600 h-full">
                                    <h3>International Conference on Recent Advances in Mechanical Engineering and Nanomaterials (ICRAMEN-2021)</h3>


                                </div>
                            </div>

                        </div>


                        <div className=" relative z-20">
                            <Footer className="" />
                        </div>
                    </section>
                </div>
            </div>
            {/* </ReactLenis> */}
        </>
    );
}