const JournalModel = require('../models/JournalModel');
const axios = require('axios')
const { fetchJournalData } = require('../utils/crossref');
const { imageUploadutil, imageUploadUtil} = require('../utils/fileUpload')

// Controller to submit a journal
module.exports.submitJournal = async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }

    const newJournal = new JournalModel({
      title,
      content,
      author: req.user._id, // Attach the logged-in user's ID
    });

    const savedJournal = await newJournal.save();
    res.status(201).json({ message: 'Journal submitted successfully', journal: savedJournal });
  } catch (error) {
    res.status(500).json({ message: 'Error submitting journal', error: error.message });
  }
};

// Controller to fetch journals of the logged-in user
module.exports.getMyJournals = async (req, res) => {
  try {
    const journals = await JournalModel.find({ author: req.user._id });
    res.status(200).json({ journals });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching journals', error: error.message });
  }
};

// Controller to fetch all journals (Admin only)
module.exports.getAllJournals = async (req, res) => {
  try {
    const journals = await JournalModel.find().populate('author', 'email'); // Populate user email
    res.status(200).json({ journals });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching all journals', error: error.message });
  }
};

// Controller to update a journal by ID
module.exports.updateJournal = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;

    const journal = await JournalModel.findOneAndUpdate(
      { _id: id, author: req.user._id }, // Ensure only the journal owner can update
      { title, content },
      { new: true }
    );

    if (!journal) {
      return res.status(404).json({ message: 'Journal not found or unauthorized' });
    }

    res.status(200).json({ message: 'Journal updated successfully', journal });
  } catch (error) {
    res.status(500).json({ message: 'Error updating journal', error: error.message });
  }
};

// Controller to delete a journal by ID (Admin only)
module.exports.deleteJournal = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedJournal = await JournalModel.findByIdAndDelete(id);

    if (!deletedJournal) {
      return res.status(404).json({ message: 'Journal not found' });
    }

    res.status(200).json({ message: 'Journal deleted successfully', journal: deletedJournal });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting journal', error: error.message });
  }
};

module.exports.fetchJournals = async (req, res) => {
  const { issn, title } = req.query;

  if (!issn && !title) {
    return res.status(400).json({ message: 'Please provide an ISSN or title to search for journals.' });
  }

  try {
    const query = issn ? `issn=${issn}` : `query=${title}`;
    const url = `https://api.crossref.org/journals?${query}`;

    const response = await axios.get(url);

    const journals = response.data.message.items.map((journal) => ({
      title: journal.title,
      publisher: journal.publisher,
      issn: journal.ISSN,

      volumes: journal.volumes || [], // Assuming volumes and issues are in the API response
    }));

    res.status(200).json({ journals });
  } catch (error) {
    console.error('Error fetching journals:', error.message);
    res.status(500).json({ message: 'Error fetching journals', error: error.message });
  }
};





// Controller to fetch journal data by ISSN and store it in MongoDB
module.exports.fetchAndSaveJournalData = async (req, res) => {
  const { issn } = req.params;

  try {
    // Fetch journal data from CrossRef
    const journalData = await fetchJournalData(issn);

    // Check if the journal already exists in the database
    const existingJournal = await JournalModel.findOne({ issn: journalData.ISSN });

    if (existingJournal) {
      return res.status(200).json(existingJournal); // Return the existing journal if found
    }

    // Create a new journal document
    const newJournal = new JournalModel({
      title: journalData.title,
      issn: journalData.ISSN,
      publisher: journalData.publisher,
      description: journalData.description || 'No description available',
      journalUrl: journalData.URL || 'No URL available'
    });

    // Save the journal to the database
    await newJournal.save();

    res.status(201).json(newJournal);  // Return the created journal
  } catch (error) {
    console.error('Error in fetchAndSaveJournalData:', error.message);
    res.status(500).json({ message: 'Error saving journal data', error: error.message });
  }
}

// Controller to fetch all journals from the database
//   module.exports.getAllJournals = async (req, res) => {
//       try {
//           const journals = await JournalModel.find();
//           res.status(200).json(journals);  // Return the list of journals
//       } catch (error) {
//           console.error('Error in getAllJournals:', error.message);
//           res.status(500).json({ message: 'Error fetching journals', error: error.message });
//       }
//   }



//////////////////////////////////////////////////////////////////////////////

// Delay function for retries
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Fetch DOI Metadata with Retry
async function fetchArticleDataByDOI(doi, retries = 5, delayMs = 1000) {
  const apiUrl = `https://api.crossref.org/works/${doi}`;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await axios.get(apiUrl);
      return response.data.message; // Return article metadata
    } catch (error) {
      if (error.response && error.response.status === 429) {
        const waitTime = delayMs * 2 ** attempt; // Exponential backoff
        console.warn(`429 Too Many Requests. Retrying in ${waitTime}ms (Attempt ${attempt + 1}/${retries})`);
        await delay(waitTime);
      } else {
        console.error(`Error fetching DOI ${doi}:`, error.message);
        return null; // Exit on non-retryable errors
      }
    }
  }
  console.error(`Failed to fetch metadata for DOI ${doi} after ${retries + 1} attempts.`);
  return null;
}

// Save metadata to database
async function saveToDatabase(metadata) {
  if (!metadata) return;

  const { 'container-title': journalTitle, ISSN, volume, issue, title, DOI } = metadata;

  if (!DOI) {
    console.warn(`Skipping paper with missing DOI: ${title}`);
    return;
  }

  const journalTitleString = Array.isArray(journalTitle) ? journalTitle[0] : journalTitle || "Unknown Journal";

  let journal = await JournalModel.findOne({ title: journalTitleString });

  if (!journal) {
    journal = new JournalModel({
      title: journalTitleString,
      short_title: metadata.short_title || "shorttitle",
      issn: (ISSN && ISSN.length > 0) ? ISSN[0] : "N/A",
      online_issn: (ISSN && ISSN.length > 1) ? ISSN[1] : "N/A",
      abstract: metadata.abstract || "null",
      volumes: [],
      coverImg: metadata.cover_img || "null"
    });
  }

  let volumeEntry = journal.volumes.find(v => v.volumeNumber === parseInt(volume));
  if (!volumeEntry) {
    volumeEntry = { volumeNumber: parseInt(volume) || 0, issues: [] };
    journal.volumes.push(volumeEntry);
  }

  let issueEntry = volumeEntry.issues.find(i => i.issueNumber === parseInt(issue));
  if (!issueEntry) {
    issueEntry = { issueNumber: parseInt(issue) || 0, papers: [] };
    volumeEntry.issues.push(issueEntry);
  }

  const authors = metadata.author ? metadata.author.map(a => ({
    name: `${a.given || ''} ${a.family || ''}`.trim(),
    email: a.email || "N/A",
    affiliation: Array.isArray(a.affiliation) ? a.affiliation.join(", ") : (a.affiliation || "N/A")
  })) : [];

  if (!issueEntry.papers.find(p => p.doi === DOI)) {
    issueEntry.papers.push({
      doi: DOI,
      title: Array.isArray(title) ? title[0] : title || "Untitled Paper",
      authors: authors,
      abstract: metadata.abstract || "null",
      publicationDate: metadata.published?.['date-parts']?.[0]?.join('-') || null,
      references: metadata.reference || [],
      pages: metadata.page || '',
      metadata: JSON.parse(JSON.stringify(metadata)) // Store full metadata safely
    });
  }

  try {
    await journal.save();
    console.log(`Saved paper with DOI: ${DOI}`);
  } catch (error) {
    console.error(`Error saving paper DOI=${DOI}:`, error.message);
  }
}

// Fetch and save multiple DOIs
module.exports.fetchAndSaveDOIs = async (req, res) => {
  const { dois } = req.body;

  if (!Array.isArray(dois) || !dois.length) {
    return res.status(400).json({ error: 'Please provide an array of DOIs.' });
  }

  const results = [];
  for (const doi of dois) {
    const metadata = await fetchArticleDataByDOI(doi);
    if (metadata) {
      await saveToDatabase(metadata);
      results.push({ doi, status: 'success' });
    } else {
      results.push({ doi, status: 'failed' });
    }
  }

  res.json({ results });
};


// Get all journals
exports.getAllJournals = async (req, res) => {
  try {
    const journals = await JournalModel.find({}, 'title issn publisher short_title coverImg');
    console.log(journals)
    res.json(journals);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching journals', details: error.message });
  }
};

// Get a specific journal by ISSN
exports.getJournalByISSN = async (req, res) => {
  try {
    const { issn } = req.params;
    const journal = await JournalModel.findOne({ issn }, 'title issn publisher volumes abstract short_title coverImg');
    if (!journal) return res.status(404).json({ error: 'Journal not found' });
    res.json(journal);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching journal', details: error.message });
  }
};

// Get volumes of a journal
exports.getVolumesByISSN = async (req, res) => {
  try {
    const { issn } = req.params;
    const journal = await JournalModel.findOne({ issn }, 'volumes');
    if (!journal) return res.status(404).json({ error: 'Journal not found' });
    res.json(journal.volumes);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching volumes', details: error.message });
  }
};

// Get issues of a specific volume
exports.getIssuesByVolume = async (req, res) => {
  try {
    const { issn, volumeNumber } = req.params;
    const journal = await JournalModel.findOne({ issn }, 'volumes');
    if (!journal) return res.status(404).json({ error: 'Journal not found' });

    const volume = journal.volumes.find(v => v.volumeNumber === parseInt(volumeNumber));
    if (!volume) return res.status(404).json({ error: 'Volume not found' });

    res.json(volume.issues);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching issues', details: error.message });
  }
};

// Get papers of a specific issue
exports.getPapersByIssue = async (req, res) => {
  try {
    const { issn, volumeNumber, issueNumber } = req.params;
    const journal = await JournalModel.findOne({ issn }, 'volumes');
    if (!journal) return res.status(404).json({ error: 'Journal not found' });

    const volume = journal.volumes.find(v => v.volumeNumber === parseInt(volumeNumber));
    if (!volume) return res.status(404).json({ error: 'Volume not found' });

    const issue = volume.issues.find(i => i.issueNumber === parseInt(issueNumber));
    if (!issue) return res.status(404).json({ error: 'Issue not found' });

    res.json(issue.papers);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching papers', details: error.message });
  }
};

module.exports.handleImageUpload = async (req, res) => {
  try {
    // Check if a file was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    // Convert file buffer to Base64
    const b64 = req.file.buffer.toString("base64");
    const url = `data:${req.file.mimetype};base64,${b64}`;

    // Upload to Cloudinary
    const result = await imageUploadUtil(url);

    res.json({
      success: true,
      result,
    });
  } catch (error) {
    console.error("Upload Error:", error);

    res.status(500).json({
      success: false,
      message: "Error occurred during image upload",
    });
  }
};

