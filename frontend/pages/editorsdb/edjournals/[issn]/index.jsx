import JournalCoverImg from "@/components/file-upload";
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { Plus } from "lucide-react";
import FileUpload from "@/components/file-upload";

const EditJournal = ({ journal }) => {
  const router = useRouter();
  const { issn } = router.query;

  const [formData, setFormData] = useState({
    journalTitle: journal?.journalTitle || "",
    website: journal?.website || "",
    aimAndScope: {
      description: journal?.aimAndScope?.description || "",
      topics: journal?.aimAndScope?.topics || [],
    },
    editorialBoard: journal?.editorialBoard || [],
    coverImg: journal?.coverImg || "",
    short_title: journal?.short_title || "",
    issn: journal?.issn || "",
    online_issn: journal?.online_issn || "",
    subject: journal?.subject || "",
    language: journal?.language || "",
    format: journal?.format || "",
    publisher: journal?.publisher || "",
    country: journal?.country || "",
    doi: journal?.doi || "",
    frequency: journal?.frequency || "",
    abstract: journal?.abstract || "",
  });

  const [file, setFile] = useState(null);
  const [uploadedFileUrl, setUploadedFileUrl] = useState(journal?.coverImg || "");
  const [fileLoading, setFileLoading] = useState(false);
  const [editCover, setEditCover] = useState(false);
  const [showEditorialForm, setShowEditorialForm] = useState(false);
  const [newMember, setNewMember] = useState({
    name: "",
    email: "",
    affiliation: "",
    profileLink: "",
    role: "Editorial Board Member",
  });

  useEffect(() => {
    if (journal) {
      setFormData({
        journalTitle: journal.journalTitle || "",
        website: journal.website || "",
        aimAndScope: {
          description: journal.aimAndScope?.description || "",
          topics: journal.aimAndScope?.topics || [],
        },
        editorialBoard: journal.editorialBoard || [],
        coverImg: journal.coverImg || "",
        short_title: journal.short_title || "",
        issn: journal.issn || "",
        online_issn: journal.online_issn || "",
        subject: journal.subject || "",
        language: journal.language || "",
        format: journal.format || "",
        publisher: journal.publisher || "",
        country: journal.country || "",
        doi: journal.doi || "",
        frequency: journal.frequency || "",
        abstract: journal.abstract || "",
      });
    }
  }, [journal]);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      coverImg: uploadedFileUrl,
    }));
  }, [uploadedFileUrl]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "description" || name === "topics") {
      setFormData({
        ...formData,
        aimAndScope: {
          ...formData.aimAndScope,
          [name]: name === "topics" ? value.split(",") : value,
        },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleNewMemberChange = (e) => {
    const { name, value } = e.target;
    setNewMember({ ...newMember, [name]: value });
  };

  const addEditorialMember = (e) => {
    e.preventDefault();
    setFormData({
      ...formData,
      editorialBoard: [...formData.editorialBoard, newMember],
    });
    setNewMember({
      name: "",
      email: "",
      affiliation: "",
      profileLink: "",
      role: "Editorial Board Member",
    });
    setShowEditorialForm(false);
  };

  const removeEditorialMember = (index) => {
    const updatedBoard = formData.editorialBoard.filter((_, i) => i !== index);
    setFormData({ ...formData, editorialBoard: updatedBoard });
  };

  const updateJournal = async () => {
    try {
      const token = Cookies.get("token");
      if (!token) {
        alert("You must be logged in to edit a journal.");
        return;
      }

      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/journals/${issn}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Journal updated successfully!");
      router.push("/editorsdb/edjournals");
    } catch (error) {
      alert(error.response?.data?.message || "Error updating journal. Please try again.");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateJournal();
  };

  return (
    <div>
      <Header />
      <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">Edit Journal</h2>
        <form onSubmit={handleSubmit} className="grid gap-4">
          {/* Journal Cover Section */}
          <div className="flex bg-blue-200 p-4 h-[190px] rounded-md">
            {!editCover ? (
              <div className="flex flex-col items-center space-y-2">
                {formData.coverImg === "null" || !formData.coverImg ? (
                  <p>No Cover Available</p>
                ) : (
                  <img src={formData.coverImg} alt="journal cover" className=" h-28 object-cover rounded-sm shadow" />
                )}
                <Button type="button" onClick={() => setEditCover(true)}>
                  Edit Cover
                </Button>
              </div>
            ) : (
              <>
                <div className="flex justify-between w-full px-2">
                  <img src={formData.coverImg} alt="journal cover" className=" h-28 object-cover rounded-sm shadow" />
                  <div className="flex flex-col items-center space-y-2">
                  <FileUpload file={file} setFile={setFile} uploadedFileUrl={uploadedFileUrl} setUploadedFileUrl={setUploadedFileUrl} fileLoading={fileLoading} setFileLoading={setFileLoading} />

                    <Button type="button" onClick={() => setEditCover(false)}>
                      Done
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>

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

          <Textarea name="abstract" rows={8} className="border" placeholder="Journal's Abstract *" value={formData.abstract} onChange={handleChange} required />

          <Textarea name="description" rows={5} placeholder="Description" value={formData.aimAndScope?.description} onChange={handleChange} />

          <Input name="topics" placeholder="Topics (comma-separated)" value={formData.aimAndScope?.topics.join(",")} onChange={handleChange} />

          <h1>Editorial Board of the Journal</h1>
          <div className="border">
            {/* Existing Members in List Format */}
            <ul className="list-disc pl-5">
              {formData.editorialBoard.map((member, index) => (
                <li key={index}>
                  {member.name} ({member.role})
                </li>
              ))}
            </ul>

            {/* Add New Member Form */}
            {showEditorialForm && (
              <div className="border p-4 rounded-md mb-2">
                <Input
                  name="name"
                  placeholder="Full Name"
                  value={newMember.name}
                  onChange={handleNewMemberChange}
                />
                <Input
                  name="email"
                  placeholder="Email"
                  value={newMember.email}
                  onChange={handleNewMemberChange}
                />
                <Input
                  name="affiliation"
                  placeholder="Affiliation"
                  value={newMember.affiliation}
                  onChange={handleNewMemberChange}
                />
                <Input
                  name="profileLink"
                  placeholder="Profile Link"
                  value={newMember.profileLink}
                  onChange={handleNewMemberChange}
                />
                <select
                  name="role"
                  value={newMember.role}
                  onChange={handleNewMemberChange}
                  className="mt-2 p-2 border rounded"
                >
                  <option value="Editorial Board Member">Editorial Board Member</option>
                  <option value="Editor-in-Chief">Editor-in-Chief</option>
                </select>
                <Button type="button" onClick={addEditorialMember} className="mt-2 bg-blue-500 text-white">
                  Save Member
                </Button>
              </div>
            )}

            <Button onClick={() => setShowEditorialForm(true)} type="button" className="mt-4">
              <Plus /> Add Editorial Members
            </Button>
          </div>

          {/* Submit Button */}
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded">
            Save Changes
          </Button>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export const getServerSideProps = async (context) => {
  const { issn } = context.params;

  if (!issn) {
    return {
      props: { journal: null },
    };
  }

  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/journals/${issn}`);
    return {
      props: {
        journal: response.data,
      },
    };
  } catch (error) {
    console.error("Error fetching journal:", error.response?.data || error.message);
    return {
      props: {
        journal: null,
      },
    };
  }
};

export default EditJournal;