import React, { useState, useEffect } from "react";
import axios from "axios";
import { parse } from "cookie";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/router";

const SubmitReview = ({ papers, initialMessage, token }) => {
  const [selectedPaper, setSelectedPaper] = useState(null);
  const [message, setMessage] = useState(initialMessage || "");
  const router = useRouter();

  console.log("Papers received:", papers); // Debugging

  // Function to handle clicking an Papers
  const handlePapersClick = (paper) => {
    setSelectedPaper(paper);
    console.log("Selected Paper:", paper); // Logs selected article data
  };

  // Function to handle review submission
  // const handleReview = () => {
  //   if (!selectedArticle) {
  //     setMessage("Please select an article before reviewing.");
  //     return;
  //   }

    
    // Navigate to submit-review-copy with article data in query params
  //   router.push({
  //     pathname: "/submit-review-copy",
  //     query: { article: JSON.stringify(selectedArticle) },
  //   });
  // };

  const handleReview = (paper) => {
    setSelectedPaper(paper);
    router.push(`/editorsdb/fromreviewer?paperId=${paper._id}`);
  };

  return (
    <div>
      <Header />
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Submit a Review</h2>
        {message && (
          <p className={`mb-4 ${message.includes("success") ? "text-green-600" : "text-red-600"}`}>
            {message}
          </p>
        )}
        
        <label className="block mb-2">Select Paper:</label>
          <ul className="border rounded p-2 w-full">
  {Array.isArray(papers) && papers.length > 0 ? (
    papers.map((paper) => (
      <li
        key={paper._id}
        className={`cursor-pointer p-2 border-b last:border-none flex justify-between items-center px-14 ${
          selectedPaper?._id === paper._id ? "bg-blue-100" : "hover:bg-gray-100"
        }`}
      >
        {paper.title}
        <Button onClick={() => handleReview(paper)}>See Reviews</Button>
      </li>
    ))
  ) : (
    <li className="p-2 text-gray-500">No assigned paper available</li>
  )}
</ul>
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
      },
    };
  }

  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/papers/assigned-papers`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    console.log("Fetched papers:", response.data);

    return {
      props: {
        papers: Array.isArray(response.data) ? response.data : [],
        initialMessage: "",
        token,
      },
    };
  } catch (err) {
    console.error("Error fetching papers:", err.response?.data);

    return {
      props: {
        papers: [],
        initialMessage: err.response?.data?.error || "Failed to fetch assigned papers.",
      },
    };
  }
};
export default SubmitReview;
