import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import Cookies from "js-cookie"; // Client-side cookies library
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import JournalCoverImg from "@/components/file-upload";

const SubmitArticle = () => {

  const [imageFile, setImageFile] = useState(null)
  const [uploadedImageUrl, setUploadedImageUrl] = useState("")
  const [imageLoadingState, setImageLoadingState] = useState(false)

  const [journals, setJournals] = useState([]);
  const [selectedISSN, setSelectedISSN] = useState(""); // Store the ISSN for selected journal
  const [content, setContent] = useState("");
  const [message, setMessage] = useState("");
  // Paper fields
  const [title, setTitle] = useState("");
  const [authors, setAuthors] = useState([{ name: "", email: "", affiliation: "" }]);
  const [indexTerms, setIndexTerms] = useState("");
  const [abstract, setAbstract] = useState("");
  const [references, setReferences] = useState([""]);
  const [pages, setPages] = useState("");
  const [doi, setDoi] = useState("");
  const [publicationDate, setPublicationDate] = useState("");
  const [journalName, setJournalName] = useState(""); // Store the journal name

  const router = useRouter();

  useEffect(() => {
    // Fetch journals list from API
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/journals`)
      .then((res) => res.json())
      .then((data) => setJournals(data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Get token from cookies
      const token = Cookies.get("token");
      if (!token) {
        setMessage("You must be logged in to submit an article.");
        return;
      }

      // Submit article using the API, including journal info
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/articles/submit`,
        {
          title,
          abstract,
          indexTerms,
          references,
          pages,
          journalId: selectedISSN, // Assuming selectedISSN is the journal ID
          journalName, // Passing the journal name
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Reset form and navigate to user articles
      setMessage("Article submitted successfully!");
      setTitle("");
      setAbstract("");
      setIndexTerms("");
      setReferences([""]);
      setPages("");
      setJournalName(""); // Reset journal name
      setSelectedISSN(""); // Reset selected ISSN
      router.push("/user-articles");
    } catch (err) {
      setMessage(err.response?.data?.error || "An error occurred.");
    }
  };

  return (
    <div className="">
      <Header />

      <div className="flex justify-center items-center h-screen bg-gray-100">
        <form className="bg-white p-6 shadow-md rounded w-1/2" onSubmit={handleSubmit}>
          <h2 className="text-xl font-bold mb-4">Submit an Article</h2>
          
          {/* Journal Selection */}
          <label className="block font-medium">Select Journal:</label>
          <select
            className="w-full border rounded-lg p-2"
            value={selectedISSN}
            onChange={(e) => {
              const selectedJournal = journals.find(
                (journal) => journal.issn === e.target.value
              );
              setSelectedISSN(e.target.value);
              setJournalName(selectedJournal ? selectedJournal.title : ""); // Set the journal name
            }}
          >
            <option value="">Select Journal</option>
            {journals.map((journal) => (
              <option key={journal.issn} value={journal.issn}>
                {journal.title} ({journal.issn})
              </option>
            ))}
          </select>
          
          {message && <p className={`mb-4 ${message.includes("successfully") ? "text-green-600" : "text-red-600"}`}>{message}</p>}
          
          {/* Paper Details */}
          <input type="text" className="w-full border rounded-lg p-2" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
          <textarea className="w-full border rounded-lg p-2" placeholder="Abstract" value={abstract} onChange={(e) => setAbstract(e.target.value)} required />

          {/* Index Terms */}
          <input type="text" className="w-full border rounded-lg p-2" placeholder="Index Terms" value={indexTerms} onChange={(e) => setIndexTerms(e.target.value)} required />

          {/* References */}
          <textarea className="w-full border rounded-lg p-2" placeholder="References (one per line)" value={references.join("\n")} onChange={(e) => setReferences(e.target.value.split("\n"))} />

          {/* Pages */}
          <input type="text" className="w-full border rounded-lg p-2" placeholder="Pages" value={pages} onChange={(e) => setPages(e.target.value)} required />

          <JournalCoverImg imageFile={imageFile} setImageFile={setImageFile} uploadedImageUrl={uploadedImageUrl} setUploadedImageUrl={setUploadedImageUrl} imageLoadingState={imageLoadingState} setImageLoadingState={setImageLoadingState} />

          {/* Submit Button */}
          <button type="submit" className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700">
            Submit Paper
          </button>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default SubmitArticle;
