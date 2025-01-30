import React, { useState } from "react";
import axios from "axios";
import { parse } from "cookie";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

const AssignReviewers = ({ articles, reviewers, initialError }) => {
  const [selectedArticle, setSelectedArticle] = useState("");
  const [selectedReviewers, setSelectedReviewers] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(initialError || "");

  const handleAssign = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!selectedArticle || selectedReviewers.length === 0) {
      setError("Please select an article and at least one reviewer.");
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/articles/assign-reviewers`,
        {
          articletitle: selectedArticle,
          reviewers: selectedReviewers,
        },
        {
          headers: {
            Authorization: `Bearer ${document.cookie
              .split("; ")
              .find((row) => row.startsWith("token="))
              ?.split("=")[1]}`,
          },
        }
      );
      setMessage("Reviewers assigned successfully!");
    } catch (err) {
      setError(err.response?.data?.error || "An error occurred while assigning reviewers.");
    }
  };

  return (
   <div className="">
     <Header/>
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-center">Assign Reviewers</h2>
      {message && <p className="mb-4 text-green-600 text-center">{message}</p>}
      {error && <p className="mb-4 text-red-600 text-center">{error}</p>}

      <form onSubmit={handleAssign} className="max-w-lg mx-auto bg-white p-6 rounded shadow">
        <div className="mb-4">
          <label className="block mb-2 font-medium">Select Article:</label>
          <select
            value={selectedArticle}
            onChange={(e) => setSelectedArticle(e.target.value)}
            className="block w-full mb-3 p-2 border rounded"
          >
            <option value="">-- Select Article --</option>
            {articles.map((article) => (
              <option key={article.title} value={article.title}>
                {article.title}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block mb-2 font-medium">Select Reviewers:</label>
          <select
            multiple
            value={selectedReviewers}
            onChange={(e) =>
              setSelectedReviewers([...e.target.selectedOptions].map((o) => o.value))
            }
            className="block w-full mb-3 p-2 border rounded"
          >
            {reviewers.map((reviewer) => (
              <option key={reviewer.username} value={reviewer.username}>
                {reviewer.username}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Assign Reviewers
        </button>
      </form>
    </div>
    <Footer/>
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
        reviewers: [],
        initialError: "Authentication token not found. Please log in.",
      },
    };
  }

  try {
    const [articlesRes, reviewersRes] = await Promise.all([
      axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/articles/articles`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
      axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users/reviewers`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
    ]);

    return {
      props: {
        articles: articlesRes.data,
        reviewers: reviewersRes.data,
        initialError: "",
      },
    };
  } catch (err) {
    return {
      props: {
        articles: [],
        reviewers: [],
        initialError: err.response?.data?.error || "Failed to fetch data. Please try again.",
      },
    };
  }
};

export default AssignReviewers;
