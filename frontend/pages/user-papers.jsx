import React from "react";
import axios from "axios";
import { parse } from "cookie"; // To parse cookies from the request headers
import Footer from "@/components/Footer";
import Header from "@/components/Header";

const UserPapers = ({ papers, error }) => {
  return (
    <div className="">
        <Header/>
        <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">My Papers</h1>
      {error && <p className="text-red-500">{error}</p>}
      {papers && papers.length > 0 ? (
        <ul className="space-y-4">
          {papers.map((paper) => (
            <li
              key={paper._id}
              className="border p-4 rounded-lg shadow hover:bg-gray-100"
            >
              <h2 className="text-xl font-semibold">{paper.paperTitle}</h2>
              {/* <p className="text-gray-700">{paper.content}</p> */}
              <p className="text-gray-500 text-sm">
                Status: {paper.status}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-700">No paper found.</p>
      )}
    </div>
    <Footer/>
    </div>
  );
};

export const getServerSideProps = async (context) => {
  const { req } = context;
  const cookies = parse(req.headers.cookie || ""); // Parse cookies from the request
  const token = cookies.token; // Get the token from the cookies

  if (!token) {
    return {
      props: {
        papers: [],
        error: "You must be logged in to view your paper.",
      },
    };
  }

  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/papers/user-papers`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  
    console.log("Fetched papers:", response.data); // Debugging log
  
    return {
      props: {
        papers: response.data,
        error: null,
      },
    };
  } catch (err) {
    console.error("Error fetching papers:", err.response?.data || err.message);
    return {
      props: {
        papers: [],
        error: err.response?.data?.error || "Failed to fetch papers.",
      },
    };
  }
  
};

export default UserPapers;
