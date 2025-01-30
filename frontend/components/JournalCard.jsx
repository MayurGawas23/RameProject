import React from 'react';
import { Link } from 'react-router-dom';

const JournalCard = ({ journal }) => {
  return (
    <div className="p-4 border rounded-lg shadow-md">
      <h3 className="text-xl font-semibold">{journal.title}</h3>
      <p>ISSN: {journal.issn}</p>
      <p>Publisher: {journal.publisher}</p>
      <Link
        to={`/journals/${journal.issn}`}
        className="text-blue-500 hover:underline"
      >
        View detail
      </Link>
    </div>
  );
};

export default JournalCard;
