import React from 'react';

const PaperCard = ({ paper }) => {
  return (
    <div className="p-4 border rounded-lg shadow-md mb-4">
      <h4 className="text-lg font-semibold">{paper.title}</h4>
      <p><strong>DOI:</strong> {paper.doi}</p>
      <p><strong>Authors:</strong> {paper.authors.join(', ')}</p>
      <p>{paper.abstract}</p>
    </div>
  );
};

export default PaperCard;
