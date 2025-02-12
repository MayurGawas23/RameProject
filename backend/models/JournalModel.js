const mongoose = require('mongoose');

// Schema for authors
const authorSchema = new mongoose.Schema({
  name: String,
  email: String,
  affiliation: String
});

// Schema for editorial board members
const editorialBoardSchema = new mongoose.Schema({
  name: String,
  role: { type: String, enum: ['Editor-in-Chief', 'Editorial Board Member'] },
  affiliation: String,
  email: String,
  profileLink: String
});

// Schema for a paper
const paperSchema = new mongoose.Schema({
  paperNumber: Number,
  paperTitle: String,
  authors: [{
    name: String,
    email: String,
    affiliation: String
  }],
  indexTerms: String,
  abstract: String,
  references: [String],
  pages: String,
  doi: String,  // Ensure DOI is stored
  publicationDate: { type: Date, default: Date.now }, 
  indexTerms:[String],
  pdf:String,
  metadata: mongoose.Schema.Types.Mixed, // Store entire metadata object
  type:String
}, { timestamps: true }); // 


// Schema for an issue
const issueSchema = new mongoose.Schema({
  issueNumber: Number,
  papers: [paperSchema]
}, { timestamps: true });

// Schema for a volume
const volumeSchema = new mongoose.Schema({
  volumeNumber: Number,
  fromToDate:String,
  issues: [issueSchema]
}, { timestamps: true });

// Schema for a journal
const journalSchema = new mongoose.Schema({
  journalName: String,
  short_title:{type:String, unique:true},
  issn: String,
  online_issn: String,
  subject: String,
  format: String,
  publisher: String,
  country: String,
  abstract: String,
  language: String,
  doi: String,
  frequency: String,
  start_year: String,
  website: String, // ✅ Added website

  editorialBoard: [editorialBoardSchema],
  aimAndScope: {
    description: String, // ✅ Ensure this matches the controller
    topics: [String], // ✅ Array type to store topics
  },
  coverImg: String,
  volumes: [volumeSchema],
});

const JournalModel = mongoose.model('Journal', journalSchema);

module.exports = JournalModel;
