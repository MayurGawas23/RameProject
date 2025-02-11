import React, { useState, useEffect } from "react";
import axios from "axios";
import { parse } from "cookie";
import { useRouter } from "next/router"; // Import useRouter for redirection
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/utils/auth";
import Link from "next/link";
import { StickyNote } from "lucide-react";

const EditorDashboard = ({ papers, token }) => {
    const [selectedPaper, setSelectedPaper] = useState("");
    const [finalDecision, setFinalDecision] = useState("");
    const [message, setMessage] = useState("");
    const [isDecisionSet, setIsDecisionSet] = useState(false); // State to track if the decision is set
    const router = useRouter(); // Initialize useRouter for redirection

    const { user } = useAuth()

    const handleFinalDecisionChange = async (e) => {
        e.preventDefault();

        if (!finalDecision) {
            setMessage("Please select a final decision.");
            return;
        }

        try {
            // Send the final decision to the server
            await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/api/papers/set-final-decision`,
                {
                    paperId: selectedPaper,
                    finalDecision,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setMessage("Final decision set successfully!");
            setIsDecisionSet(true); // Set decision as completed
        } catch (err) {
            setMessage(err.response?.data?.error || err.message || "An error occurred.");
        }
    };

    const handlePublish = (paper) => {
        // Redirect to /papersubmit with the paperId as a query parameter
        router.push(`/publish_paper?paperId=${selectedPaper}`);
    };

    // Function to handle clicking an paper
    const handlePaperClick = (paper) => {
        setSelectedPaper(paper);
        console.log("Selected paper:", paper); // Logs selected article data
    };

    //   const handleReview = () => {
    //     if (!selectedArticle?._id) {
    //       setMessage("Please select an article before reviewing.");
    //       return;
    //     }

    //     router.push(`/editorsdb?articleId=${selectedArticle._id}`);
    //   };

    const handleReview = (paper) => {
        setSelectedPaper(paper);
        router.push(`/editorsdb/reviews/fromreviewer?paperId=${paper._id}`);
    };



    return (
        <div>
            <Header />
            <div className="p-6">




                {message && (
                    <p className={`mb-4 ${message.includes("success") ? "text-green-600" : "text-red-600"}`}>
                        {message}
                    </p>
                )}

                <div>
                    <h3 className="text-xl mb-4">Review from Reviewers</h3>
                    <ul className="border rounded p-2 w-full">
                        {Array.isArray(papers) && papers.length > 0 ? (
                            papers.map((paper) => (

                                <li
                                    key={paper._id}
                                    className={`cursor-pointer p-2 border-b last:border-none flex justify-between items-center px-14 ${selectedPaper?._id === paper._id ? "bg-blue-100" : "hover:bg-gray-100"
                                        }`}
                                >
                                    <div className="flex gap-2">
                                    <StickyNote />
                                    {paper.paperTitle}
                                    </div>
                                    <Button onClick={() => handleReview(paper)} className=''>See Reviews</Button>
                                </li>
                            ))
                        ) : (
                            <li className="p-2 text-gray-500">No assigned paper available</li>
                        )}
                    </ul>

                    <Link href={'/editorsdb'}>Back</Link>


                </div>


            </div>
            <Footer />
        </div>
    );
};

export const getServerSideProps = async (context) => {
    const { req } = context;
    const cookies = parse(req.headers.cookie || "");
    const token = cookies.token;

    if (!token) {
        return {
            props: {
                papers: [],
                initialMessage: "Authentication required. Please log in.",
                token: null,
            },
        };
    }

    try {
        const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/api/papers/papers`,
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );

        return {
            props: {
                papers: response.data,
                token,
            },
        };
    } catch (err) {
        console.error("Error fetching papers:", err.response);
        return {
            props: {
                papers: [],
                initialMessage: err.response?.data?.error || "Failed to fetch papers.",
                token,
            },
        };
    }
};

export default EditorDashboard;
