import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

const PaperSubmit = () => {
  const router = useRouter();
  const { paperId } = router.query; // Get paperId from the URL params

  const [journals, setJournals] = useState([]);
  const [selectedISSN, setSelectedISSN] = useState("");
  const [volumes, setVolumes] = useState([]);
  const [selectedVolume, setSelectedVolume] = useState("");
  const [newVolume, setNewVolume] = useState("");
  const [issues, setIssues] = useState([]);
  const [selectedIssue, setSelectedIssue] = useState("");
  const [newIssue, setNewIssue] = useState("");

  // Paper fields
  const [paperTitle, setPaperTitle] = useState("");
  const [authors, setAuthors] = useState([{ name: "", email: "", affiliation: "" }]);
  const [indexTerms, setIndexTerms] = useState("");
  const [abstract, setAbstract] = useState("");
  const [references, setReferences] = useState([""]);
  const [pages, setPages] = useState("");
  const [doi, setDoi] = useState("");
  const [publicationDate, setPublicationDate] = useState("");
  const [pdf, setPdf] = useState("")

  // Fetch all journals on mount
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/journals`)
      .then((res) => res.json())
      .then(setJournals);
  }, []);

  // Fetch volumes when ISSN is selected
  useEffect(() => {
    if (selectedISSN) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/journals/${selectedISSN}/volumes`)
        .then((res) => res.json())
        .then(setVolumes);
    }
  }, [selectedISSN]);

  // Fetch issues when volume is selected (only if it's an existing volume)
  useEffect(() => {
    if (selectedVolume && selectedVolume !== "new" && selectedISSN) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/journals/${selectedISSN}/volumes/${selectedVolume}/issues`)
        .then((res) => res.json())
        .then(setIssues);
    } else {
      setIssues([]); // Reset issues when creating a new volume
    }
  }, [selectedVolume, selectedISSN]);

  // Fetch paper data if vId is available
  useEffect(() => {
    if (paperId) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/papers/${paperId}`)
        .then((res) => res.json())
        .then((data) => {
          // Check if data is correct
          console.log('Fetched paper data:', data);

          // Prefill the form with paper data
          setPaperTitle(data.paperTitle || "");
          setAuthors(data.authors || [{ name: "", email: "", affiliation: "" }]);
          setIndexTerms(data.indexTerms || "");
          setAbstract(data.abstract || "");
          setReferences(data.references || []);
          setPages(data.pages || "");
          setDoi(data.doi || "");
          setPublicationDate(data.publicationDate || "");
          setPdf(data.pdf || "");

          // Pre-select the journal from the paper data
          setSelectedISSN(data.journalISSN || "");
          setSelectedVolume(data.volume || "");
          setSelectedIssue(data.issue || "");
        })
        .catch((error) => console.error("Failed to fetch paper data:", error));
    }
  }, [paperId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let targetVolume = selectedVolume;
    let targetIssue = selectedIssue;

    try {
      console.log("Selected Volume:", selectedVolume);
      console.log("Selected Issue:", selectedIssue);

      // Create new volume if needed
      if (selectedVolume === "new" && newVolume) {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/journals/${selectedISSN}/volumes`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ volumeNumber: newVolume }),
          }
        );
        const data = await res.json();
        targetVolume = data.volumeNumber; // Set targetVolume with the newly created volume
        console.log("New Volume Created:", targetVolume);
      }

      // Create new issue if needed
      if (selectedIssue === "new" && newIssue) {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/journals/${selectedISSN}/volumes/${targetVolume}/issues`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ issueNumber: newIssue }),
          }
        );
        const data = await res.json();
        console.log("New Issue Creation Response:", data); // Log the entire response to check what is returned

        // Check if the issue creation response contains the issueNumber
        if (data && data.issue && data.issue.issueNumber) {
          targetIssue = data.issue.issueNumber; // Set targetIssue with the newly created issue number
          console.log("New Issue Created:", targetIssue);
        } else {
          console.error("Issue creation failed or missing issueNumber:", data);
          return; // Prevent paper submission if issue creation fails
        }
      }

      // Now submit the paper using the targetVolume and targetIssue
      console.log("Submitting paper to volume:", targetVolume, "and issue:", targetIssue);

      const paperData = { paperTitle, authors, indexTerms, abstract, references, pages, doi, publicationDate , pdf };
      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/journals/${selectedISSN}/volumes/${targetVolume}/issues/${targetIssue}/papers`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(paperData),
        }
      );

      alert("Paper submitted successfully!");
    } catch (error) {
      console.error("Submission failed:", error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-6">Submit Paper</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Journal Selection (auto-selected from the paper schema) */}
        <label className="block font-medium">Journal (auto-selected from paper schema):</label>
        <select
          className="w-full border rounded-lg p-2"
          value={selectedISSN}
          onChange={(e) => setSelectedISSN(e.target.value)}
        >
          <option value="">Select Journal</option>
          {journals.map((journal) => (
            <option key={journal.issn} value={journal.issn}>
              {journal.journalTitle} ({journal.issn})
            </option>
          ))}
        </select>

        {/* Volume Selection */}
        <label className="block font-medium">Select Volume:</label>
<select
  className="w-full border rounded-lg p-2"
  value={selectedVolume}
  onChange={(e) => setSelectedVolume(e.target.value)}
  disabled={!selectedISSN}
>
  <option value="">Select Volume</option>
  {/* Only map if volumes exist */}
  {volumes?.length > 0 &&
    volumes.map((volume) => (
      <option key={volume.volumeNumber} value={volume.volumeNumber}>
        Volume {volume.volumeNumber}
      </option>
    ))}
  <option value="new">Create New Volume</option>
</select>


        {selectedVolume === "new" && (
          <input
            type="text"
            className="w-full border p-2 rounded-lg"
            placeholder="New Volume Number"
            value={newVolume}
            onChange={(e) => setNewVolume(e.target.value)}
            required
          />
        )}

        {/* Issue Selection */}
        <label className="block font-medium">Select Issue:</label>
        <select
          className="w-full border rounded-lg p-2"
          value={selectedIssue}
          onChange={(e) => setSelectedIssue(e.target.value)}
          disabled={!selectedVolume}
        >
          <option value="">Select Issue</option>
          {issues.map((issue) => (
            <option key={issue.issueNumber} value={issue.issueNumber}>
              Issue {issue.issueNumber}
            </option>
          ))}
          <option value="new">Create New Issue</option>
        </select>

        {selectedIssue === "new" && (
          <input
            type="text"
            className="w-full border p-2 rounded-lg"
            placeholder="New Issue Number"
            value={newIssue}
            onChange={(e) => setNewIssue(e.target.value)}
            required
          />
        )}

        {/* Paper Details */}
        <input
          type="text"
          className="w-full border rounded-lg p-2"
          placeholder="Title"
          value={paperTitle}
          onChange={(e) => setPaperTitle(e.target.value)}
          required
        />
        <textarea
          className="w-full border rounded-lg p-2"
          placeholder="Abstract"
          value={abstract}
          onChange={(e) => setAbstract(e.target.value)}
          required
        />

        {/* Index Terms */}
        <input
          type="text"
          className="w-full border rounded-lg p-2"
          placeholder="Index Terms"
          value={indexTerms}
          onChange={(e) => setIndexTerms(e.target.value)}
          required
        />

        {/* References */}
        <textarea
          className="w-full border rounded-lg p-2"
          placeholder="References (one per line)"
          value={references.join("\n")}
          onChange={(e) => setReferences(e.target.value.split("\n"))}
        />

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
        >
          Submit Paper
        </button>
      </form>
    </div>
  );
};

export default PaperSubmit;
