import React from 'react';
import { Link } from 'react-router-dom';

const IssueCard = ({ issue, journalId, volumeNumber }) => {
  return (
    <div className="p-4 border rounded-lg shadow-md mb-4">
      <h4 className="text-lg font-semibold">Issue {issue.issueNumber}</h4>
      <Link
        to={`/journals/${journalId}/volumes/${volumeNumber}/issues/${issue.issueNumber}/papers`}
        className="text-blue-500 hover:underline"
      >
        View Papers
      </Link>
    </div>
  );
};

export default IssueCard;
