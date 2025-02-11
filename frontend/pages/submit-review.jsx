import React, { useState, useEffect } from "react";
import axios from "axios";
import { parse } from "cookie";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

const SubmitReview = ({ articles, initialMessage, token }) => {
  const [selectedArticle, setSelectedArticle] = useState("");
  const [comments, setComments] = useState("");
  const [decision, setDecision] = useState("");
  const [message, setMessage] = useState(initialMessage || "");

  // Debugging: Check articles before rendering
  console.log("Articles received:", articles);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!selectedArticle) {
      setMessage("Please select an article.");
      return;
    }

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/articles/submit-review`,
        {
          articleId: selectedArticle,
          comments,
          decision,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage("Review submitted successfully!");
      setSelectedArticle("");
      setComments("");
      setDecision("");
    } catch (err) {
      console.error("Error during submission:", err);
      setMessage(err.response?.data?.error || "An error occurred.");
    }
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
        <form onSubmit={handleSubmit}>
          <label className="block mb-2">Select Article:</label>
          <select
            value={selectedArticle}
            onChange={(e) => setSelectedArticle(e.target.value)}
            className="block w-full mb-3 p-2 border rounded"
          >
            <option value="">-- Select Article --</option>
            {Array.isArray(articles) && articles.length > 0 ? (
              articles.map((article) => (
                <option key={article._id} value={article._id}>
                  {article.title}
                </option>
              ))
            ) : (
              <option disabled>No assigned articles available</option>
            )}
          </select>

          <label className="block mb-2">Comments:</label>
          <textarea
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            className="block w-full mb-3 p-2 border rounded"
            rows="4"
          />

          <label className="block mb-2">Decision:</label>
          <select
            value={decision}
            onChange={(e) => setDecision(e.target.value)}
            className="block w-full mb-3 p-2 border rounded"
          >
            <option value="">-- Select Decision --</option>
            <option value="accept">Accept</option>
            <option value="reject">Reject</option>
            <option value="revise">Revise</option>
          </select>

          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
            Submit Review
          </button>
        </form>
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
        articles: [],
        initialMessage: "Authentication required. Please log in.",
      },
    };
  }

  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/articles/assigned-articles`, // Use correct route
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    console.log("Fetched articles:", response.data); // Debugging

    return {
      props: {
        articles: Array.isArray(response.data) ? response.data : [], // Ensure it's an array
        initialMessage: "",
        token,
      },
    };
  } catch (err) {
    console.error("Error fetching articles:", err.response?.data);

    return {
      props: {
        articles: [],
        initialMessage: err.response?.data?.error || "Failed to fetch assigned articles.",
      },
    };
  }
};
export default SubmitReview;
