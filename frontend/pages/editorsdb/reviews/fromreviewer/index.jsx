import React, { useState, useEffect } from "react";
import axios from "axios";
import { parse } from "cookie";
import { useRouter } from "next/router";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import ReviewedTable from "@/components/ReviewedTable";
import { ArrowLeft } from "lucide-react";

const EditorDashboard = ({ papers, token }) => {
  const router = useRouter();
  const { paperId } = router.query; // Get paper from URL query
  const [selectedPaper, setSelectedPaper] = useState(null);
  const [finalDecision, setFinalDecision] = useState("");
  const [message, setMessage] = useState("");
  const [isDecisionSet, setIsDecisionSet] = useState(false);

  // Fetch selected paper details
  useEffect(() => {
    if (!paperId) return;

    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/api/papers/${paperId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setSelectedPaper(response.data);
      })
      .catch((error) => {
        console.error("Error fetching paper:", error);
      });
  }, [paperId, token]);

  const handleFinalDecisionChange = async (e) => {
    e.preventDefault();

    if (!finalDecision) {
      setMessage("Please select a final decision.");
      return;
    }

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/papers/set-final-decision`,
        { paperId, finalDecision },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage("Final decision set successfully!");
      setIsDecisionSet(true);
    } catch (err) {
      setMessage(err.response?.data?.error || err.message || "An error occurred.");
    }
  };

  const handlePublish = () => {
    if (!paperId) return;
    router.push(`/publish_paper?paperId=${paperId}`);
  };

  const handleReview = (paper) => {
    router.push(`/editorsdb?paperId=${paper._id}`);
  };
 console.log(selectedPaper);
 

  return (
    <div>
      <Header />
      <div className="p-6 w-[70%] mx-auto ">
        <Link href={'/editorsdb'} className="text-blue-700 flex"><ArrowLeft/> Back</Link>
        {/* <h2 className="text-2xl font-bold mb-4">Editor Dashboard</h2> */}
        {message && (
          <p className={`mb-4 ${message.includes("success") ? "text-green-600" : "text-red-600"}`}>
            {message}
          </p>
        )}

<div>
  <h3 className="text-xl mb-4"> Paper Title :  {selectedPaper?.paperTitle} </h3>
  <h3 className="text-xl mb-4"> For Journal :  {selectedPaper?.journalName} </h3>
  
    
  
</div>



{selectedPaper && (
  <div className="mt-6">
    <h4 className="text-lg">Reviews Submitted:</h4>

    {selectedPaper.reviews?.map((review, index) => (
      <div key={index} className="mb-6">
        <h5 className="text-md font-semibold">Review by: {review.reviewer}</h5>
        <ReviewedTable review={review} />
      </div>
    ))}

    <h4 className="mt-6 text-lg">Set Final Decision:</h4>
    <select
      value={finalDecision}
      onChange={(e) => setFinalDecision(e.target.value)}
      className="block w-full mb-4 p-2 border rounded"
    >
      <option value="">-- Select Final Decision --</option>
      <option value="accepted">Accept</option>
      <option value="reject">Reject</option>
      <option value="revise">Revise</option>
    </select>

    <button
      onClick={handleFinalDecisionChange}
      className="bg-blue-500 text-white px-4 py-2 rounded"
    >
      Set Final Decision
    </button>

    {isDecisionSet && finalDecision === "accepted" && (
      <div className="mt-4">
        <button
          onClick={handlePublish}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Publish paper
        </button>
      </div>
    )}
  </div>
)}

      </div>
      <Footer />
    </div>
  );
};

export const getServerSideProps = async (context) => {
  const { req, query } = context;
  const cookies = parse(req.headers.cookie || "");
  const token = cookies.token;
  const { paperId } = query;

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
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/papers/papers`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return {
      props: {
        papers: response.data,
        token,
        paperId: paperId || null, // Pass paperId as prop
      },
    };
  } catch (err) {
    console.error("Error fetching paper:", err.response);
    return {
      props: {
        papers: [],
        initialMessage: err.response?.data?.error || "Failed to fetch paper.",
        token,
        paperId: paperId || null,
      },
    };
  }
};

export default EditorDashboard;
