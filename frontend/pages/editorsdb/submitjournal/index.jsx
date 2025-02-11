import JournalCoverImg from '@/components/file-upload';
import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Plus } from 'lucide-react';
import FileUpload from '@/components/file-upload';

const SubmitJournal = () => {
  const [file, setFile] = useState(null);
    const [uploadedFileUrl, setUploadedFileUrl] = useState("");
    const [fileLoading, setFileLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    journalTitle: "",
    short_title: "",
    issn: "",
    online_issn: "",
    subject: "",
    format: "",
    publisher: "",
    country: "",
    abstract: "",
    language: "",
    doi: "",
    frequency: "",
    description: "",
    topic: "",
    coverImg: "",  // Updated dynamically when uploadedImageUrl changes
    editorialBoard: [
      { name: "", email: "", affiliation: "", profileLink: "", role: "Editor-in-Chief" },
      { name: "", email: "", affiliation: "", profileLink: "", role: "Editorial Board Member" },
      { name: "", email: "", affiliation: "", profileLink: "", role: "Editorial Board Member" }
    ]
  });

  const addEditorialMember = () => {
    setFormData({
      ...formData,
      editorialBoard: [...formData.editorialBoard, { name: "", email: "", affiliation: "", profileLink: "", role: "Editorial Board Member" }]
    });
  };

  const removeEditorialMember = (index) => {
    if (formData.editorialBoard.length > 2) {
      const updatedEditorialBoard = formData.editorialBoard.filter((_, i) => i !== index);
      setFormData({ ...formData, editorialBoard: updatedEditorialBoard });
    }
  };

  const handleEditorialChange = (index, field, value) => {
    const updatedBoard = [...formData.editorialBoard];
    updatedBoard[index][field] = value;
    setFormData({ ...formData, editorialBoard: updatedBoard });
  };

  // Update cover image when uploadedImageUrl changes
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      coverImg: uploadedFileUrl, // Automatically updates coverImg in formData
    }));
  }, [uploadedFileUrl]);

  // Handle input changes
  const handleChange = (e, index = null) => {
    const { name, value } = e.target;
    if (index !== null) {
      const updatedEditorialBoard = [...formData.editorialBoard];
      updatedEditorialBoard[index][name] = value;
      setFormData({ ...formData, editorialBoard: updatedEditorialBoard });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Filter out empty editorial board members
  const filterEmptyEditorialMembers = (board) => {
    return board.filter(member => 
      member.name.trim() !== "" || 
      member.email.trim() !== "" || 
      member.affiliation.trim() !== "" || 
      member.profileLink.trim() !== ""
    );
  };

  // API call to submit journal
  const submitJournal = async () => {
    try {
      const token = Cookies.get("token");
      if (!token) {
        setMessage("You must be logged in to submit an article.");
        return;
      }

      // Filter out empty editorial board members
      const filteredEditorialBoard = filterEmptyEditorialMembers(formData.editorialBoard);

      const payload = {
        ...formData,
        editorialBoard: filteredEditorialBoard
      };

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/journals/submit`, 
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Journal submitted successfully:", response.data);
      alert("Journal submitted successfully!");
    } catch (error) {
      console.error("Error submitting journal:", error);
      alert(error.response?.data?.message || "Error submitting journal. Please try again.");
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.journalTitle || !formData.issn || !formData.publisher) {
      alert("Please fill in all required fields.");
      return;
    }
    submitJournal();  // Call API to submit journal
  };

  return (
    <div>
      <Header />
      <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">Submit a Journal</h2>
        <form onSubmit={handleSubmit} className="grid gap-4">

          {/* Journal Details */}
          <Input name="journalTitle" placeholder="Journal Title *" value={formData.journalTitle} onChange={handleChange} required />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input name="short_title" placeholder="Short Title" value={formData.short_title} onChange={handleChange} />
            <div className="flex gap-2">
              <Input name="issn" placeholder="ISSN *" value={formData.issn} onChange={handleChange} required />
              <Input name="online_issn" placeholder="ONLINE ISSN (if available) *" value={formData.online_issn} onChange={handleChange} required />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input name="subject" placeholder="Subject *" value={formData.subject} onChange={handleChange} required />
            <Input name="language" placeholder="Language *" value={formData.language} onChange={handleChange} required />
            <Input name="format" placeholder="Publication Format *" value={formData.format} onChange={handleChange} required />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input name="publisher" placeholder="Publisher *" value={formData.publisher} onChange={handleChange} required />
            <Input name="country" placeholder="Publisher's Country *" value={formData.country} onChange={handleChange} required />
          </div>

          <Input name="doi" placeholder="Provide a DOI (Optional)" value={formData.doi} onChange={handleChange} />

          <div className="flex">
            <Input name="website" placeholder="Journal Website (Optional)" value={formData.website} onChange={handleChange} />
            <Input name="frequency" placeholder="Frequency of Journal" value={formData.frequency} onChange={handleChange} />
          </div>

          <Textarea name="abstract" rows={4} className="border" placeholder="Journal's Abstract *" value={formData.abstract} onChange={handleChange} required />

          <Textarea name="description" rows={4} className="border" placeholder="Journal's Aim & Scope *" value={formData.description} onChange={handleChange} required />

          <Textarea name="topic" rows={4} className="border" placeholder="Topics covered in Journal (comma separated)" value={formData.topic} onChange={handleChange} />

          <h1>Editorial Board of the Journal</h1>
          <div className="border">
            <div className="">
              <label>Editor-In-Chief</label>
              <div className="flex">
                <Input name="name" placeholder="Full name" value={formData.editorialBoard[0].name} onChange={(e) => handleEditorialChange(0, 'name', e.target.value)} />
                <Input name="email" placeholder="Email" value={formData.editorialBoard[0].email} onChange={(e) => handleEditorialChange(0, 'email', e.target.value)} />
                <Input name="affiliation" placeholder="Affiliation" value={formData.editorialBoard[0].affiliation} onChange={(e) => handleEditorialChange(0, 'affiliation', e.target.value)} />
              </div>
              <Input name="profileLink" placeholder="Profile Link" value={formData.editorialBoard[0].profileLink} onChange={(e) => handleEditorialChange(0, 'profileLink', e.target.value)} />
            </div>

            <label>Editorial Board Members</label>
            <div className="flex flex-col gap-3 p-4">
              {formData.editorialBoard.slice(1).map((member, index) => (
                <div key={index + 1}>
                  <Input name="name" placeholder="Full Name" value={member.name} onChange={(e) => handleEditorialChange(index + 1, 'name', e.target.value)} />
                  <Input name="email" placeholder="Email" value={member.email} onChange={(e) => handleEditorialChange(index + 1, 'email', e.target.value)} />
                  <Input name="affiliation" placeholder="Affiliation" value={member.affiliation} onChange={(e) => handleEditorialChange(index + 1, 'affiliation', e.target.value)} />
                  <Input name="profileLink" placeholder="Profile Link" value={member.profileLink} onChange={(e) => handleEditorialChange(index + 1, 'profileLink', e.target.value)} />
                </div>
              ))}
              <Button type="button" onClick={addEditorialMember}><Plus /> Add Editorial Member</Button>
            </div>
          </div>

          {/* Upload Journal Cover Image */}
          <p className="font-semibold">Upload Journal's Cover Image</p>
          <FileUpload file={file} setFile={setFile} uploadedFileUrl={uploadedFileUrl} setUploadedFileUrl={setUploadedFileUrl} fileLoading={fileLoading} setFileLoading={setFileLoading} />
          {/* Submit Button */}
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded">
            Submit Journal
          </Button>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default SubmitJournal;