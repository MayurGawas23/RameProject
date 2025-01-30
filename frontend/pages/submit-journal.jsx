import JournalCoverImg from '@/components/image-upload'
import React, { useState } from 'react'
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";


const SubmitJournal = () => {

    const [imageFile, setImageFile] = useState(null)
    const [uploadedImageUrl, setUploadedImageUrl] = useState('')
    const [imageLoadingState, setImageLoadingState] = useState(false)
    const [formData, setFormData] = useState({
        journalTitle: "",
        issn: "",
        publisher: "",
        country: "",
        website: "",
        volume: "",
        issue: "",
        publicationDate: "",
        paperTitle: "",
        abstract: "",
        keywords: "",
        researchArea: "",
        fullPaper: null,
        authorName: "",
        authorEmail: "",
        affiliation: "",
        coAuthors: "",
        plagiarismCheck: false,
        conflictOfInterest: false,
        copyrightAgreement: false,
      });
    
      // Handle input changes
      const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;
        setFormData({
          ...formData,
          [name]: type === "checkbox" ? checked : type === "file" ? files[0] : value,
        });
      };
    
      // Handle form submission
      const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formData);
        alert("Journal Submitted Successfully!");
      };
    

    return (
        <div>
         <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">Submit a Journal</h2>
      <form onSubmit={handleSubmit} className="grid gap-4">
        
        {/* Journal Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            name="journalTitle"
            placeholder="Journal Title"
            value={formData.journalTitle}
            onChange={handleChange}
            required
          />
          <Input name="issn" placeholder="ISSN (if available)" value={formData.issn} onChange={handleChange} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input name="publisher" placeholder="Publisher" value={formData.publisher} onChange={handleChange} required />
          <Input name="country" placeholder="Publisher's Country" value={formData.country} onChange={handleChange} required />
        </div>

        <Input name="website" placeholder="Journal Website (Optional)" value={formData.website} onChange={handleChange} />

        {/* Volume & Issue */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input name="volume" placeholder="Volume Number" value={formData.volume} onChange={handleChange} required />
          <Input name="issue" placeholder="Issue Number" value={formData.issue} onChange={handleChange} required />
          <Input type="date" name="publicationDate" placeholder="Publication Date" value={formData.publicationDate} onChange={handleChange} required />
        </div>

        {/* Paper Submission */}
        <h3 className="text-lg font-semibold mt-4">Paper Submission</h3>
        <Input name="paperTitle" placeholder="Paper Title" value={formData.paperTitle} onChange={handleChange} required />
        <Textarea name="abstract" placeholder="Abstract" value={formData.abstract} onChange={handleChange} required />
        <Input name="keywords" placeholder="Keywords (comma-separated)" value={formData.keywords} onChange={handleChange} required />
        <Input name="researchArea" placeholder="Research Area/Category" value={formData.researchArea} onChange={handleChange} required />
        <Input type="file" name="fullPaper" accept=".pdf,.doc,.docx" onChange={handleChange} required />

        {/* Author Information */}
        <h3 className="text-lg font-semibold mt-4">Author Information</h3>
        <Input name="authorName" placeholder="Primary Author Name" value={formData.authorName} onChange={handleChange} required />
        <Input name="authorEmail" type="email" placeholder="Primary Author Email" value={formData.authorEmail} onChange={handleChange} required />
        <Input name="affiliation" placeholder="Affiliation (University/Institution)" value={formData.affiliation} onChange={handleChange} required />
        <Textarea name="coAuthors" placeholder="Co-Authors (Names, Emails, Affiliations)" value={formData.coAuthors} onChange={handleChange} />

        {/* Compliance Section */}
        <h3 className="text-lg font-semibold mt-4">Compliance & Ethics</h3>
        <label className="flex items-center space-x-2">
          <input type="checkbox" name="plagiarismCheck" checked={formData.plagiarismCheck} onChange={handleChange} />
          <span>I confirm this paper has passed a plagiarism check.</span>
        </label>

        <label className="flex items-center space-x-2">
          <input type="checkbox" name="conflictOfInterest" checked={formData.conflictOfInterest} onChange={handleChange} />
          <span>I declare no conflict of interest.</span>
        </label>

        <label className="flex items-center space-x-2">
          <input type="checkbox" name="copyrightAgreement" checked={formData.copyrightAgreement} onChange={handleChange} required />
          <span>I agree to the Copyright Transfer Agreement.</span>
        </label>

        {/* Submit Button */}
        <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded">
          Submit Journal
        </Button>
      </form>
    </div>
            <JournalCoverImg imageFile={imageFile} setImageFile={setImageFile} uploadedImageUrl={uploadedImageUrl} setUploadedImageUrl={setUploadedImageUrl} imageLoadingState={imageLoadingState} setImageLoadingState={setImageLoadingState } />
        </div>
    )
}

export default SubmitJournal