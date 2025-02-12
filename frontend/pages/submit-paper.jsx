import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import Cookies from "js-cookie"; // Client-side cookies library
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FileUpload from "@/components/file-upload";
import { Dialog, DialogTitle, DialogContent, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { parse } from "cookie";
import {useAuth} from '../utils/auth'


const SubmitPaper = ({reviewers}) => {

  const [file, setFile] = useState(null);
     const [uploadedFileUrl, setUploadedFileUrl] = useState("");
     const [fileLoading, setFileLoading] = useState(false);
   const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedReviewers, setSelectedReviewers] = useState([]);

  const [journals, setJournals] = useState([]);
  // const [selectedISSN, setSelectedISSN] = useState(""); // Store the ISSN for selected journal
  const [message, setMessage] = useState("");
  // Paper fields
  const [paperTitle, setPaperTitle] = useState("");
  const [authors, setAuthors] = useState([{ name: "", email: "", affiliation: "" }]);
  const [indexTerms, setIndexTerms] = useState("");
  const [abstract, setAbstract] = useState("");
  const [references, setReferences] = useState([""]);
    const [coauthors, setCoauthors] = useState([{ username: "", email: "", affiliation: "" }]);
  const [pages, setPages] = useState("");
  const [doi, setDoi] = useState("");
  const [publicationDate, setPublicationDate] = useState("");
  const [journalName, setJournalName] = useState(""); // Store the journal name
  const [pdf, setPdf] = useState("")
  const [suggestedreviewers, setSuggestedreviewers] = useState([""]);
 const [type, setType] = useState("")
 const [jshorttitle, setJshorttitle] = useState("")
  const router = useRouter();
  const {user} = useAuth()

  useEffect(() => {
    // Fetch journals list from API
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/journals`)
      .then((res) => res.json())
      .then((data) => setJournals(data));
  }, []);

  const handleAddReference = () => setReferences([...references, ""]);
  const handleAddCoauthor = () => setCoauthors([...coauthors, { username: "", email: "", affiliation: "" }]);

  const handleAssign = () => {
    if (selectedReviewers.length === 0) {
      alert("Please select at least one reviewer.");
      return;
    }
    setIsModalOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Get token from cookies
      const token = Cookies.get("token");
      if (!token) {
        setMessage("You must be logged in to submit an paper.");
        return;
      }

      // Submit paper using the API, including journal info
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/papers/submit`,
        {
          paperTitle,
          abstract,
          indexTerms,
          references,
          pages,
          journalId: jshorttitle, // Assuming selectedISSN is the journal ID
          journalName,
          pdf:uploadedFileUrl ,// Passing the journal name
          suggestedreviewers: selectedReviewers,
          coauthors,
          type
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Reset form and navigate to user paper
      setMessage("Paper submitted successfully!");
      setPaperTitle("");
      setAbstract("");
      setIndexTerms("");
      setReferences([""]);
      setPages("");
      setJournalName(""); // Reset journal name
      setSelectedISSN(""); // Reset selected ISSN
      setPdf("")
      setJshorttitle("")
      setSuggestedreviewers([""])
      setCoauthors([{ username: "", email: "", affiliation: "" }]); // Reset properly
      setType("")
      
      router.push("/user-papers");
    } catch (err) {
      setMessage(err.response?.data?.error || "An error occurred.");
    }
  };

  return (
    <div>
      <Header />
      <div className="flex flex-col justify-center items-center p-10 bg-gray-100">
        <div className="text-left w-[60%]">
          <h2 className="text-xl font-bold mb-4">Submit a Paper</h2>
        </div>
        <div className="bg-blue-400 w-[60%]">
          <form className="bg-white p-6 shadow-md rounded w-full" onSubmit={handleSubmit}>
          {/* Journal Selection */}
          <label className="block font-bold">Select Journal:</label>
          <select
            className="w-full border rounded-lg p-2 mb-4"
            value={jshorttitle}
            onChange={(e) => {
              const selectedJournal = journals.find(
                (journal) => journal.short_title === e.target.value
              );
              setJshorttitle(e.target.value);
              setJournalName(selectedJournal ? selectedJournal.journalTitle : ""); // Set the journal name
            }}
          >
            <option value="">Select Journal</option>
            {journals.map((journal) => (
              <option key={journal.short_title} value={journal.short_title}>
                {journal.journalTitle} ({journal.short_title})
              </option>
            ))}
          </select>
          
          {message && <p className={`mb-4 ${message.includes("successfully") ? "text-green-600" : "text-red-600"}`}>{message}</p>}
          
          <h1>Author:{user.username}</h1>
                        <h2>Author's Email: {user.email}</h2>
                        <h2>Author's Affiliation: {user.affiliation}</h2>
                        <h2>Author's WhatsAPP No: {user.mobno}</h2>

          {/* Paper Details */}
          <input type="text" className="w-full border rounded-lg p-2 mb-4" placeholder="Paper Title" value={paperTitle} onChange={(e) => setPaperTitle(e.target.value)} required />

          
          <label className="mb-2 block font-medium">Type of Manuscript</label>

<div className="flex gap-2 my-2">
    <input
        type="radio"
        id="research"
        name="manuscriptType"
        value="Research Paper"
        checked={type === "Research Paper"}
        onChange={(e) => setType(e.target.value)}
    />
    <label htmlFor="research">Research Paper</label>
</div>

<div className="flex gap-2 mb-4">
    <input
        type="radio"
        id="review"
        name="manuscriptType"
        value="Review Paper"
        checked={type === "Review Paper"}
        onChange={(e) => setType(e.target.value)}
    />
    <label htmlFor="review">Review Paper</label>
</div>

          <textarea className="w-full border rounded-lg p-2 mb-4" placeholder="Abstract" value={abstract} onChange={(e) => setAbstract(e.target.value)} required />

          {/* Index Terms */}
          <input type="text" className="w-full border rounded-lg p-2 " placeholder="Index Terms" value={indexTerms} onChange={(e) => setIndexTerms(e.target.value)} required />
            {/* Co-Auhtors */}
            <h3 className="font-bold">Add Co-Authors</h3>
            {coauthors.map((coa, index) => (
    <div key={index} className="space-y-2 mb-4">
        <input
            type="text"
            className="w-full border p-2"
            placeholder="Co-author Name"
            value={coa.username}
            onChange={(e) => {  
                const newCoauthors = [...coauthors];
                newCoauthors[index].username = e.target.value;
                setCoauthors(newCoauthors);
            }}
        />
        <input
            type="email"
            className="w-full border p-2"
            placeholder="Co-author Email"
            value={coa.email}
            onChange={(e) => {
                const newCoauthors = [...coauthors];
                newCoauthors[index].email = e.target.value;
                setCoauthors(newCoauthors);
            }}
        />
        <input
            type="text"
            className="w-full border p-2"
            placeholder="Co-author Affiliation"
            value={coa.affiliation}
            onChange={(e) => {
                const newCoauthors = [...coauthors];
                newCoauthors[index].affiliation = e.target.value;
                setCoauthors(newCoauthors);
            }}
        />
    </div>
))}
           <button type="button" onClick={handleAddCoauthor} className="bg-blue-500 text-white px-2 py-1 rounded mb-4">+ Add Co-authors</button><br></br>
           
          {/* References */}
          <h3 className="font-bold mt-4">References</h3>
          {references.map((ref, index) => (
            <input key={index} type="text" className="w-full border p-2 mb-2" value={ref} onChange={(e) => {
              const newReferences = [...references];
              newReferences[index] = e.target.value;
              setReferences(newReferences);
            }} />
          ))}
          <button type="button" onClick={handleAddReference} className="bg-blue-500 text-white px-2 py-1 rounded mb-4">+ Add References</button><br></br>
        
         <label htmlFor="" className="font-bold">Suggest Two Reviewers</label><br></br>
         <button type="button" onClick={() => setIsModalOpen(true)} className="bg-blue-500 text-white px-2 mb-4 py-1 rounded">+ Add Reviewers</button>
      
            <input type="text" className="w-full border rounded-lg p-2 mb-4" placeholder="Pages" value={pages} onChange={(e) => setPages(e.target.value)} required />
            <FileUpload file={file} setFile={setFile} uploadedFileUrl={uploadedFileUrl} setUploadedFileUrl={setUploadedFileUrl} fileLoading={fileLoading} setFileLoading={setFileLoading} />
            <button type="submit" className="w-full mt-4 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700">Submit Paper</button>
          </form>          
      </div>
      {isModalOpen && (
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            {/* <DialogTitle>Select Reviewers  </DialogTitle> */}
            <DialogContent>
            <h1 className="font-bold ">Select Reviewers</h1>
              <div className="space-y-3">
                {reviewers.map((reviewer) => (
                  <label key={reviewer._id} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      value={reviewer.username}
                      checked={selectedReviewers.includes(reviewer.username)}
                      onChange={(e) => {
                        const value = e.target.value;
                        setSelectedReviewers((prev) => prev.includes(value) ? prev.filter((r) => r !== value) : [...prev, value]);
                      }}
                    />
                    {reviewer.username} - {reviewer.email}
                  </label>
                ))}
              </div>
              <button onClick={handleAssign} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2">Confirm Assignment</button>
            </DialogContent>
          </Dialog>
        )}
      </div>
      
      {/* <Footer /> */}
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
        reviewers: [],
        initialError: "Authentication token not found. Please log in.",
      },
    };
  }

  try {
    const [papersRes, reviewersRes] = await Promise.all([
      axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/papers/papers`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
      axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users/reviewers`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
    ]);

    return {
      props: {
        papers: papersRes.data,
        reviewers: reviewersRes.data,
        initialError: "",
      },
    };
  } catch (err) {
    return {
      props: {
        papers: [],
        reviewers: [],
        initialError: err.response?.data?.error || "Failed to fetch data. Please try again.",
      },
    };
  }
};

export default SubmitPaper;
