import React, { useState, useEffect } from "react";
import axios from "axios";
import { parse } from "cookie";
import { useRouter } from "next/router"; // Import useRouter for redirection
import Footer from "@/components/Footer";
import Header from "@/components/Header";

const EditorDashboard = ({ papers, token }) => {
  const [selectedPaper, setSelectedPaper] = useState("");
  const [finalDecision, setFinalDecision] = useState("");
  const [message, setMessage] = useState("");
  const [isDecisionSet, setIsDecisionSet] = useState(false); // State to track if the decision is set
  const router = useRouter(); // Initialize useRouter for redirection

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
  
  
  return (
    <div>
      <Header />
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Editor Dashboard</h2>
        {message && (
          <p className={`mb-4 ${message.includes("success") ? "text-green-600" : "text-red-600"}`}>
            {message}
          </p>
        )}
        
        <div>
          <h3 className="text-xl mb-4">Papers to Review</h3>
          <select
            value={selectedPaper}
            onChange={(e) => setSelectedPaper(e.target.value)}
            className="block w-full mb-4 p-2 border rounded"
          >
            <option value="">-- Select Paper --</option>
            {papers.map((paper) => (
              <option key={paper._id} value={paper._id}>
                {paper.title}
              </option>
            ))}
          </select>
        </div>

        {selectedPaper && (
          <div>
            <h4 className="text-lg">Reviews Submitted:</h4>
            {papers
              .find((paper) => paper._id === selectedPaper)
              ?.reviews.map((review, index) => (
                <div key={index} className="border p-4 mb-4">
                  <p><strong>Reviewer:</strong> {review.reviewer}</p>
                  <p><strong>Comments:</strong> {review.comments}</p>
                  <p><strong>Decision:</strong> {review.decision}</p>
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

            {/* Show Publish button only after final decision is set and it's "accept" */}
            {isDecisionSet && finalDecision === "accepted" && (
              <div className="mt-4">
                <button
                  onClick={handlePublish}
                  className="bg-green-500 text-white px-4 py-2 rounded"
                >
                  Publish Paper
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
