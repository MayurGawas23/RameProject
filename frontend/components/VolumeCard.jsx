import React from 'react';
import { Link } from 'react-router-dom';

const VolumeCard = ({ volume, journalId }) => {
  return (
    <div className="p-4 border rounded-lg shadow-md mb-4">
      <h4 className="text-lg font-semibold">Volume {volume.volumeNumber}</h4>
      <Link
        to={`/journals/${journalId}/volumes/${volume.volumeNumber}/issues`}
        className="text-blue-500 hover:underline"
      >
        View Issues
      </Link>
    </div>
  );
};

export default VolumeCard;
