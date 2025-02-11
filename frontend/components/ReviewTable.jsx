import React from 'react';

const ReviewTable = ({ onRatingChange }) => {
  const criteriaList = [
    "Relevance",
    "Academic Standards",
    "Technical Accuracy",
    "Concise Abstract",
    "Background Info",
    "Methodology",
    "Evidence",
    "Analysis",
    "References",
    "Figures & Tables",
  ];

  return (
    <div className='bg-rewd-500'>
      <label className='font-bold'>Overview:</label>
      <table className="border bg-white mx-autwo">
        <thead>
          <tr className="border h-[50px]">
            <th className="border">Criteria</th>
            <th className="border w-[120px]">Poor</th>
            <th className="border w-[120px]">Below Average</th>
            <th className="border w-[120px]">Average</th>
            <th className="border w-[120px]">Good</th>
            <th className="border w-[120px]">Very Good</th>
          </tr>
        </thead>
        <tbody>
          {criteriaList.map((criteria) => (
            <tr key={criteria} className="h-[50px]">
              <td className="border px-4">{criteria}</td>
              {["poor", "below-average", "average", "good", "very-good"].map((rating) => (
                <td key={rating} className="border p-2 text-center">
                  <input
                    type="radio"
                    name={criteria}
                    value={rating}
                    onChange={() => onRatingChange(criteria, rating)}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReviewTable;
