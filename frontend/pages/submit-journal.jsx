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

const SubmitJournal = () => {
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState('');
  const [imageLoadingState, setImageLoadingState] = useState(false);
  
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
      // { name: "", email: "", affiliation: "", profileLink: "", role: "Editorial Board Member" }
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
      coverImg: uploadedImageUrl, // Automatically updates coverImg in formData
    }));
  }, [uploadedImageUrl]);

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


  // API call to submit journal
  const submitJournal = async () => {
    try {

       const token = Cookies.get("token");
            if (!token) {
              setMessage("You must be logged in to submit an article.");
              return;
            }
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/journals/submit`, 
        formData,
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
          <Input name="name" placeholder="Full name" value={formData.name} onChange={handleChange} />
          <Input name="email" placeholder="Email" value={formData.email} onChange={handleChange} />
          <Input name="affiliation" placeholder="Affiliation" value={formData.affiliation} onChange={handleChange} />
          </div>
          <Input name="profile_link" placeholder="Profile Link" value={formData.profile_link} onChange={handleChange} />

       </div >

       <label>Editorial Board Members</label>
          <div className="flex flex-col gap-3 p-4">
          {formData.editorialBoard.map((member, index) => (
          <div key={index}>
            <Input name="name" placeholder="Full Name" value={member.name} onChange={(e) => handleEditorialChange(index, 'name', e.target.value)} />
            <Input name="email" placeholder="Email" value={member.email} onChange={(e) => handleEditorialChange(index, 'email', e.target.value)} />
            <Input name="affiliation" placeholder="Affiliation" value={member.affiliation} onChange={(e) => handleEditorialChange(index, 'affiliation', e.target.value)} />
            <Input name="profileLink" placeholder="Profile Link" value={member.profileLink} onChange={(e) => handleEditorialChange(index, 'profileLink', e.target.value)} />
          </div>
        ))}
        <Button onClick={addEditorialMember}><Plus /> Add Editorial Member</Button>
      </div>
      </div>

          {/* Upload Journal Cover Image */}
          <p className="font-semibold">Upload Journal's Cover Image</p>
          <JournalCoverImg 
            imageFile={imageFile} 
            setImageFile={setImageFile} 
            uploadedImageUrl={uploadedImageUrl} 
            setUploadedImageUrl={setUploadedImageUrl} 
            imageLoadingState={imageLoadingState} 
            setImageLoadingState={setImageLoadingState} 
          />

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
