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
  title: String,
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
  publicationDate: String,
  metadata: mongoose.Schema.Types.Mixed // Store entire metadata object
});


// Schema for an issue
const issueSchema = new mongoose.Schema({
  issueNumber: Number,
  papers: [paperSchema]
});

// Schema for a volume
const volumeSchema = new mongoose.Schema({
  volumeNumber: Number,
  issues: [issueSchema]
});

// Schema for a journal
const journalSchema = new mongoose.Schema({
  title: String,
  short_title:String,
  abstract: String, 
  startYear: Number,
  issn: String,
  online_issn: String,

  
  editorialBoard: [editorialBoardSchema],
  aimAndScope: {
    description: String,
    aims: [String]
  },
  coverImg: String,
  volumes: [volumeSchema]
});

const JournalModel = mongoose.model('Journal', journalSchema);

module.exports = JournalModel;
