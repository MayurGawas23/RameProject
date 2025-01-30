const axios = require('axios');

async function fetchJournalData(issn) {
    try {
        const url = `http://api.crossref.org/journals/${issn}`;
        const response = await axios.get(url);
        
        // Log the full response to inspect the structure
        console.log('Full Response:', response.data);

        // Check if response.data.message exists
        if (response.data && response.data.message) {
            const journalData = response.data.message;

            // Check if the necessary fields are present
            if (journalData.title && journalData.publisher) {
                console.log('Journal Data:', journalData);
                return journalData;  // Return the journal data
            } else {
                console.error('Missing key journal data (title or publisher)');
                throw new Error('Missing key journal data (title or publisher)');
            }
        } else {
            // If message is not found
            console.error('Invalid response format:', response.data);
            throw new Error('Invalid response format or no data available');
        }
    } catch (error) {
        console.error('Error fetching journal data from CrossRef:', error.message);
        throw error;
    }
}

module.exports = {
    fetchJournalData
};
