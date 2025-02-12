const mongoose = require("mongoose");

const paperSchema = new mongoose.Schema({
  journalISSN: { type: String, ref: 'Journal',  },  // Reference to Journal

  // Optionally, you can store the journal name as well if required
  journalName: { type: String, required: true },
  jshorttitle:{type:String},
  paperTitle: { type: String, required: true },
  
  // Author Information
  author: {
    username: { type: String, required: true },
    email: { type: String, required: true },
    affiliation: { type: String },
    mobno:{type: String}
  },

  indexTerms: [String],
  abstract: String,
  references: [String],
  pages: String,
  doi: String,  // Ensure DOI is stored
  suggestedreviewers: [{type: String, ref:"User"}],
  publicationDate: String,
  pdf:String,
  coauthors: [{
    username: { type: String },
    email: { type: String },
    affiliation: { type: String },
   
  }],
  type:String,
  metadata: mongoose.Schema.Types.Mixed,

  // Submission Status
  status: { 
    type: String, 
    enum: ["submitted", "under_review", "accepted", "rejected", "revision"], 
    default: "submitted" 
  },

  // Reviews (Embedded)
  reviews: [
    {
      reviewer: { type: String, ref: "User", required: true },
      comments: { type: String },
      decision: { type: String, enum: ["accept", "reject", "revise"], required: true },
      submittedAt: { type: Date, default: Date.now },

         // New fields for ratings
         generalComments: { type: String },  
         strengths: { type: String },  
         weaknesses: { type: String },  
         suggestions: { type: String },

         reviewRatings: {
          type: Object,
          default: {},
        }
   
    //      reviewRatings: {
    //        originality: { type: String },
    //        significance: { type: String },
    //        clarity: { type: String },
    //        methodology: { type: String },
    //        references: { type: String }
    // }
  }
  ],

  // Assigned Reviewers
  reviewers: [{ type: String, ref: "User" }],

  // Final Decision (Only for Editors)
  finalDecision: {
    type: String,
    enum: ['accepted', 'rejected', 'revision' , 'pending'], // Ensure valid values here
    default: 'pending', // default value (optional)
  },
});

// Ensure "status" remains "under_review" for authors
paperSchema.methods.getAuthorView = function() {
  return {
    journal: this.journalName, // Add journal name for author view
    paperTitle: this.paperTitle,
    author: this.author,
    indexTerms: this.indexTerms,
    abstract: this.abstract,
    references: this.references,
    pages: this.pages,
    doi: this.doi,
    publicationDate: this.publicationDate,
    metadata: this.metadata,
    status: "under_review", // Always show under_review to authors
  };
};

// Ensure reviewers only see their assigned reviews
paperSchema.methods.getReviewerView = function(reviewerId) {
  return {
    journal: this.journalName, // Add journal name for reviewer view
    paperTitle: this.paperTitle,
    author: this.author,
    indexTerms: this.indexTerms,
    abstract: this.abstract,
    references: this.references,
    pages: this.pages,
    doi: this.doi,
    publicationDate: this.publicationDate,
    metadata: this.metadata,
    status: "under_review",
    reviews: this.reviews.filter(review => review.reviewer.toString() === reviewerId),
  };
};

// Editors get full access, including the final decision
paperSchema.methods.getEditorView = function() {
  return this.toObject(); // Return full paper data
};

const PaperModel = mongoose.model("Paper", paperSchema);
module.exports = PaperModel;
