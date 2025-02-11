import React, { useState, useEffect } from "react";
import axios from "axios";
import { parse } from "cookie";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Dialog, DialogTitle, DialogContent, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Cookies from "js-cookie";
import { FileText } from "lucide-react";

const AssignReviewers = ({ papers, reviewers, initialError }) => {
  const [selectedPaper, setSelectedPaper] = useState(null);
  const [selectedReviewers, setSelectedReviewers] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(initialError || "");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const tokenFromCookies = Cookies.get("token");
    setToken(tokenFromCookies);
  }, []);

  if (!token) {
    return <div>Please log in to assign reviewers.</div>;
  }

  const handleAssign = async () => {
    setMessage("");
    setError("");

    if (!selectedPaper || selectedReviewers.length === 0) {
      setError("Please select at least one reviewer.");
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/papers/assign-reviewers`,
        {
            paperTitle: selectedPaper,
          reviewers: selectedReviewers,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage("Reviewers assigned successfully!");
      setIsModalOpen(false);
    } catch (err) {
      setError(err.response?.data?.error || "An error occurred while assigning reviewers.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 relative">
      <Header />
      <div className="p-6">
        <h2 className="text-3xl font-bold mb-6 text-center">Assign Reviewers</h2>
        {message && <p className="mb-4 text-green-600 text-center">{message}</p>}
        {error && <p className="mb-4 text-red-600 text-center">{error}</p>}

        {/* paper List */}
        <div className="max-w-4xl mx-auto bg-white p-6 rounded shadow">
          <h3 className="text-xl font-semibold mb-4">papers (Status: Submitted)</h3>
          {papers.filter((paper) => paper.status === "submitted").length === 0 ? (
            <p className="text-gray-600">No submitted papers available.</p>
          ) : (
            <ul className="space-y-4">
              {papers
                .filter((paper) => paper.status === "submitted")
                .map((paper) => (
                  <li key={paper._id} className="p-4 border rounded-lg flex justify-between items-center">
                    <div>
                      <a href={paper.pdf} target="_blank" rel="noopener noreferrer"><FileText/></a>
                      <h4 className="text-lg font-semibold">{paper.paperTitle}</h4>
                      <p className="text-sm text-gray-600">{paper.author.username}</p>
                    </div>
                    <Button
                      onClick={() => {
                        setSelectedPaper(paper.paperTitle);
                        setSelectedReviewers([]);
                        setIsModalOpen(true);
                      }}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                    >
                      Assign Reviewers
                    </Button>
                  </li>
                ))}
            </ul>
          )}
        </div>
      </div>

      {/* Modal Overlay */}
      {isModalOpen && (
        <Dialog
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          className="fixed inset-0 z-50 flex items-center justify-center"
        >
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setIsModalOpen(false)}></div>
          <div className="bg-white rounded-lg w-96 z-60 p-6">
            <DialogTitle>Select Reviewers for "{selectedPaper}"</DialogTitle>
            <DialogContent>
              <DialogDescription>
                Select reviewers for: <strong>{selectedPaper}</strong>
              </DialogDescription>
              <div className="space-y-3">
                {reviewers.map((reviewer) => (
                  <label key={reviewer._id} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      value={reviewer.username}
                      checked={selectedReviewers.includes(reviewer.username)}
                      onChange={(e) => {
                        const value = e.target.value;
                        setSelectedReviewers((prev) =>
                          prev.includes(value)
                            ? prev.filter((r) => r !== value)
                            : [...prev, value]
                        );
                      }}
                    />
                    {reviewer.username} - {reviewer.email}
                  </label>
                ))}
              </div>
              <Button onClick={handleAssign} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2">
                Confirm Assignment
              </Button>
              <Button onClick={() => setIsModalOpen(false)} className="ml-2 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2">
                Cancel
              </Button>
            </DialogContent>
          </div>
            <DialogFooter>
                hi
            </DialogFooter>
        </Dialog>
      )}

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

export default AssignReviewers;
