import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSetState } from "@mantine/hooks";

const PaperSubmit = () => {
  const router = useRouter();
  const { paperId } = router.query; // Get paperId from the URL params
  console.log(paperId)

  const [journals, setJournals] = useState([]);
  // const [selectedISSN, setSelectedISSN] = useState("");
  const [volumes, setVolumes] = useState([]);
  const [selectedVolume, setSelectedVolume] = useState("");
  const [newVolume, setNewVolume] = useState("");
  const [issues, setIssues] = useState([]);
  const [selectedIssue, setSelectedIssue] = useState("");
  const [newIssue, setNewIssue] = useState("");
  const [selectedShortTitle, setSelectedShortTitle] = useState("");
  // const [selectedJournalName, setSelectedJournalName] = useState("")

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

  // console.log(selectedISSN);
  // console.log(SelectedShort_title);
  
  

  // Fetch volumes when ISSN is selected
  useEffect(() => {
    if (selectedShortTitle) {
      console.log("Fetching volumes for:", selectedShortTitle);
      
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/journals/${selectedShortTitle}`)
        .then((res) => res.json())
        .then((data) => {
          console.log("Fetched Journal Data:", data);
          
          if (data.volumes) {
            console.log("Extracted Volumes:", data.volumes);
            setVolumes(data.volumes); // Extract volumes array
          } else {
            console.error("No volumes found in response!");
            setVolumes([]);
          }
        })
        .catch((error) => console.error("Error fetching volumes:", error));
    }
  }, [selectedShortTitle]);
  
  

  // Fetch issues when volume is selected (only if it's an existing volume)
  useEffect(() => {
    if (selectedVolume && selectedVolume !== "new" && selectedShortTitle) {
      console.log(`Fetching issues for ${selectedShortTitle}, Volume: ${selectedVolume}`);
      
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/journals/${selectedShortTitle}/volumes/${selectedVolume}/issues`)
        .then((res) => res.json())
        .then((data) => {
          console.log("Fetched Issues:", data);
          setIssues(data); // Ensure issues are correctly stored
        })
        .catch((error) => console.error("Error fetching issues:", error));
    } else {
      setIssues([]); // Reset issues when creating a new volume
    }
  }, [selectedVolume, selectedShortTitle]);
  


  // Fetch paper data if vId is available
  useEffect(() => {
    if (paperId) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/papers/${paperId}`)
        .then((res) => res.json())
        .then((data) => {
          console.log("Fetched paper data:", data);
  
          setPaperTitle(data.paperTitle || "");
          setAuthors(data.authors || [{ name: "", email: "", affiliation: "" }]);
          setIndexTerms(data.indexTerms || "");
          setAbstract(data.abstract || "");
          setReferences(data.references || []);
          setPages(data.pages || "");
          setDoi(data.doi || "");
          setPublicationDate(data.publicationDate || "");
          setPdf(data.pdf || "");
  
          // Ensure journal selection matches short_title
          if (data.jshorttitle) {
            setSelectedShortTitle(data.jshorttitle);
          }
  
          // Auto-select volume and issue
          if (data.volume) {
            setSelectedVolume(data.volume);
          }
          if (data.issue) {
            setSelectedIssue(data.issue);
          }
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
          `${process.env.NEXT_PUBLIC_API_URL}/api/journals/${selectedShortTitle}/volumes`,
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
          `${process.env.NEXT_PUBLIC_API_URL}/api/journals/${selectedShortTitle}/volumes/${targetVolume}/issues`,
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
  `${process.env.NEXT_PUBLIC_API_URL}/api/journals/${selectedShortTitle}/volumes/${targetVolume}/issues/${targetIssue}/papers`,
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
  value={selectedShortTitle}  // Ensure this is controlled by state
  onChange={(e) => setSelectedShortTitle(e.target.value)}
>
  <option value="">Select Journal</option>
  {journals.map((journal) => (
    <option key={journal.issn} value={journal.short_title}>
      {journal.journalTitle} ({journal.short_title})
    </option>
  ))}
</select>



        {/* Volume Selection */}
        <label className="block font-medium">Select Volume:</label>
<select
  className="w-full border rounded-lg p-2"
  value={selectedVolume}
  onChange={(e) => setSelectedVolume(e.target.value)}
  disabled={!selectedShortTitle}
>
  <option value="">Select Volume</option>
  {volumes.length > 0 ? (
    volumes.map((volume) => (
      <option key={volume.volumeNumber} value={volume.volumeNumber}>
        Volume {volume.volumeNumber}
      </option>
    ))
  ) : (
    <option disabled>No volumes available</option>
  )}
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
  {issues.length > 0 ? (
    issues.map((issue) => (
      <option key={issue.issueNumber} value={issue.issueNumber}>
        Issue {issue.issueNumber}
      </option>
    ))
  ) : (
    <option disabled>No issues available</option>
  )}
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
