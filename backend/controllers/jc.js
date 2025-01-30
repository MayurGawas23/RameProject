const axios = require('axios');

const fetchJournalDetails = async (issn) => {
  try {
    // Fetch journal metadata (already done)
    const journalResponse = await axios.get(`https://api.crossref.org/journals/${issn}`);
    const journalData = journalResponse.data.message;
    
    // Fetch articles for this journal
    const worksResponse = await axios.get(`https://api.crossref.org/journals/${issn}/works`);
    const articles = worksResponse.data.message.items;

    // Organize data by volume, issue, and paper
    const volumes = {};

    articles.forEach((article) => {
      const volume = article.volume;
      const issue = article.issue;
      const paper = {
        title: article.title,
        DOI: article.DOI,
        author: article.author,
        publishedDate: article.published,
      };

      if (!volumes[volume]) {
        volumes[volume] = {};
      }

      if (!volumes[volume][issue]) {
        volumes[volume][issue] = [];
      }

      volumes[volume][issue].push(paper);
    });

    return {
      journal: journalData,
      volumes: volumes,
    };

  } catch (error) {
    console.error('Error fetching journal details:', error.message);
    throw error;
  }
};

module.exports = fetchJournalDetails;
