import React, { useState, useEffect } from "react";
import axios from "axios";
import { parse } from "cookie";
import { useRouter } from "next/router"; // Import useRouter for redirection
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/utils/auth";
import Link from "next/link";
import { Archive, BookA, ClipboardCheck, FileText, Globe, Users, Users2 } from "lucide-react";

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
    console.log("Selected paper:", paper); // Logs selected paper data
  };

  //   const handleReview = () => {
  //     if (!selectedArticle?._id) {
  //       setMessage("Please select an paper before reviewing.");
  //       return;
  //     }

  //     router.push(`/editorsdb?articleId=${selectedArticle._id}`);
  //   };

  const handleReview = (paper) => {
    setSelectedPaper(paper);
    router.push(`/editorsdb/fromreviewer?paperId=${paper._id}`);
  };

  const links = [
    { href: 'editorsdb/submitjournal', label: 'Submit A Journal', icon: <BookA /> },
    { href: 'editorsdb/edjournals', label: 'Manage Journals', icon: <FileText /> },
    { href: '', label: 'Manage Reviewers', icon: <Users /> },
    { href: '/editorsdb/assign-reviewers', label: 'Assign Reviewers', icon: <ClipboardCheck /> },
    { href: 'editorsdb/reviews', label: 'Reviews from Reviewer', icon: <Globe /> },
    { href: '', label: 'Manage Published Papers', icon: <Archive /> },
    { href: '/editorsdb/editorialboardmembers', label: 'Editorial Board Members', icon: <Users2 /> },
  ];



  return (
    <div>
      <Header />
      <div className="p-6 w-[70%] mx-auto">
        <h2 className="text-3xl font-bold mb-4">Editor Dashboard</h2>

        <h1 className="font-black text-2xl capitalize mb-8">Welcome, <span className="text-green-700">{user.username}</span></h1>

        <div className=" grid  grid-cols-1 gap-8  place-items-center  w-full">
        {links.map((link, index) => (
      <Link 
        key={index} 
        href={link.href} 
        className="text-2xl font-bold w-full  bg-white shadow-md flex p-2 gap-4   items-center border"
      >
        {link.icon}
        {link.label}
      </Link>
    ))}


        </div>


        {message && (
          <p className={`mb-4 ${message.includes("success") ? "text-green-600" : "text-red-600"}`}>
            {message}
          </p>
        )}



      </div>
      {/* <Footer /> */}
    </div >
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
