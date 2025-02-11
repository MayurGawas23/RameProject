import React, { useState, useEffect } from "react";
import axios from "axios";
import { parse } from "cookie";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ReviewTable from "@/components/ReviewTable";
import { useRouter } from "next/router";
import { DownloadCloud, FileText } from "lucide-react";

const SubmitReview = ({ papers, initialMessage, token, context }) => {
  const [selectedPaper, setSelectedPaper] = useState(null);
  const [generalComments, setGeneralComments] = useState("");
  const [strengths, setStrengths] = useState("");
  const [weaknesses, setWeaknesses] = useState("");
  const [suggestions, setSuggestions] = useState("");

  const [decision, setDecision] = useState("");
  const [message, setMessage] = useState(initialMessage || "");
  // const [article, setArticle] = useState(null);


  const router = useRouter();
  const { paperId } = router.query;

  const { paper } = router.query; // G
  console.log(router.query);

  // console.log("title", selectedArticle.title )

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

  const [reviewRatings, setReviewRatings] = useState({});

  // Function to handle rating selection
  const handleRatingChange = (criteria, rating) => {
    setReviewRatings((prevRatings) => ({
      ...prevRatings,
      [criteria]: rating,
    }));
  };


  // const { articleId } = router.query;

  // useEffect(() => {
  //   if (articleId) {
  //     // Fetch the article from the API using articleId
  //     axios
  //       .get(`${process.env.NEXT_PUBLIC_API_URL}/api/articles/${articleId}`, {
  //         headers: { Authorization: `Bearer ${token}` },
  //       })
  //       .then((response) => {
  //         setSelectedArticle(response.data);
  //       })
  //       .catch((error) => {
  //         console.error("Error fetching article data:", error);
  //         setMessage("Error fetching article data.");
  //       });
  //   }
  // }, [articleId, token]);

  // useEffect(() => {
  //   if (article) {
  //     try {
  //       const parsedArticle = JSON.parse(article);
  //       setSelectedArticle(parsedArticle);
  //       console.log("Received Article:", parsedArticle); // Debugging
  //     } catch (error) {
  //       console.error("Error parsing article data:", error);
  //       router.push("/submit-review-copy"); // Redirect if data is corrupted
  //     }
  //   } else {
  //     router.push("/submit-review-copy"); // Redirect if no article is selected
  //   }
  // }, [article, router]);

  // Debugging: Check articles before rendering
  // console.log("Articles received:", articles);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!selectedPaper) {
      setMessage("Please select an paper.");
      return;
    }

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/papers/submit-review`,
        {
          paperId: selectedPaper?._id,
          generalComments,
          strengths,
          weaknesses,
          suggestions,
          reviewRatings, // Sending the review ratings
          decision,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Submitting review with data:", {
        paperId: selectedPaper?._id,
        generalComments,
        strengths,
        weaknesses,
        suggestions,
        reviewRatings,
        decision
      });


      setMessage("Review submitted successfully!");
      setSelectedPaper(null);
      setGeneralComments("");
      setStrengths("");
      setWeaknesses("");
      setSuggestions("");
      setDecision("");
      setReviewRatings({});
    } catch (err) {
      console.error("Error during submission:", err);
      setMessage(err.response?.data?.error || "An error occurred.");
    }
  };

  return (
    <div>
      <Header />
      <div className=" w-[60%]  mx-auto">

        {/* <h1>For Journal {title}</h1> */}

        {/* <h1>Paper Title {selectedPaper?.paperTitle}</h1> */}
        <h1></h1>

        <div className=" ">
          <h2 className="text-2xl font-bold mb-4">Submit a Review</h2>
          {message && (
            <p className={`mb-4 ${message.includes("success") ? "text-green-600" : "text-red-600"}`}>
              {message}
            </p>
          )}
          <form onSubmit={handleSubmit}>
            {/* <label className="block mb-2">Select Paper:</label> */}
            <div>
              <h3 className=" mb-4 rounded  w-full bg-ble-100 text-lg font-semibold"> Paper Title: <span>{selectedPaper?.paperTitle}</span> </h3>
              <h3 className=" mb-4 rounded  w-full bg-ble-100 text-lg font-semibold"> For Journal: <span>{selectedPaper?.journalName} ({selectedPaper?.journalISSN})</span> </h3>
              <label htmlFor="" className="font-bold text-lg ">View Paper</label>
              <div className="border w-20 h-20 bg-white flex items-center justify-center">
                <a href={selectedPaper?.pdf} target="_blank" rel="noopener noreferrer"><FileText className="w-10 h-10 " /></a>
              </div>
            </div>

            <ReviewTable onRatingChange={handleRatingChange} />





            <label className="block mb-2"> General Comments:</label>
            <textarea
              value={generalComments}
              onChange={(e) => setGeneralComments(e.target.value)}
              className="block w-full mx-auto mb-3 p-2 border rounded"
              rows="4"
            />

            <label className="block mb-2"> Strength of Paper:</label>
            <textarea
              value={strengths}
              onChange={(e) => setStrengths(e.target.value)}
              className="block w-full mx-auto mb-3 p-2 border rounded"
              rows="4"
            />

            <label className="block mb-2"> Weakness of Paper:</label>
            <textarea
              value={weaknesses}
              onChange={(e) => setWeaknesses(e.target.value)}
              className="block w-full mx-auto mb-3 p-2 border rounded"
              rows="4"
            />

            <label className="block mb-2"> Suggestions for Improvement:</label>
            <textarea
              value={suggestions}
              onChange={(e) => setSuggestions(e.target.value)}
              className="block w-full mx-auto mb-3 p-2 border rounded"
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
      `${process.env.NEXT_PUBLIC_API_URL}/api/papers/assigned-papers`, // Use correct route
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    console.log("Fetched papers:", response.data); // Debugging

    return {
      props: {
        papers: Array.isArray(response.data) ? response.data : [], // Ensure it's an array
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
