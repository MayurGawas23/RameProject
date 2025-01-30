import React from "react";
import axios from "axios";
import { parse } from "cookie"; // To parse cookies from the request headers
import Footer from "@/components/Footer";
import Header from "@/components/Header";

const UserArticles = ({ articles, error }) => {
  return (
    <div className="">
        <Header/>
        <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">My Articles</h1>
      {error && <p className="text-red-500">{error}</p>}
      {articles && articles.length > 0 ? (
        <ul className="space-y-4">
          {articles.map((article) => (
            <li
              key={article._id}
              className="border p-4 rounded-lg shadow hover:bg-gray-100"
            >
              <h2 className="text-xl font-semibold">{article.title}</h2>
              <p className="text-gray-700">{article.content}</p>
              <p className="text-gray-500 text-sm">
                Status: {article.status}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-700">No articles found.</p>
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
        articles: [],
        error: "You must be logged in to view your articles.",
      },
    };
  }

  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/articles/user-articles`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return {
      props: {
        articles: response.data,
        error: null,
      },
    };
  } catch (err) {
    return {
      props: {
        articles: [],
        error: err.response?.data?.error || "Failed to fetch articles.",
      },
    };
  }
};

export default UserArticles;
