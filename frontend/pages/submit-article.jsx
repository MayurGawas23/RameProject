import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import Cookies from "js-cookie"; // Client-side cookies library
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const SubmitArticle = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [message, setMessage] = useState("");

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Get token from cookies
      const token = Cookies.get("token");
      if (!token) {
        setMessage("You must be logged in to submit an article.");
        return;
      }

      // Submit article using the API
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/articles/submit`,
        { title, content },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Reset form and navigate to user articles
      setMessage("Article submitted successfully!");
      setTitle("");
      setContent("");
      router.push("/user-articles");
    } catch (err) {
      setMessage(err.response?.data?.error || "An error occurred.");
    }
  };

  return (
   <div className="">
    <Header/>
     <div className="flex justify-center items-center h-screen bg-gray-100">
      <form className="bg-white p-6 shadow-md rounded w-1/2" onSubmit={handleSubmit}>
        <h2 className="text-xl font-bold mb-4">Submit an Article</h2>
        {message && <p className={`mb-4 ${message.includes("successfully") ? "text-green-600" : "text-red-600"}`}>{message}</p>}
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="block w-full mb-3 p-2 border rounded"
          required
        />
        <textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="block w-full mb-3 p-2 border rounded"
          rows="6"
          required
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Submit
        </button>
      </form>
    </div>
    <Footer/>
   </div>
  );
};

export default SubmitArticle;
