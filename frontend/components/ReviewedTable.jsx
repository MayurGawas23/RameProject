import React from 'react';

const ReviewTable = ({ review }) => {
  if (!review) return <p className="text-gray-500">No review available.</p>;

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

  // Map ratings to readable labels
  const ratingLabels = {
    "poor": "Poor",
    "below-average": "Below Average",
    "average": "Average",
    "good": "Good",
    "very-good": "Very Good"
  };

  return (
    <div className="mt-6 border rounded-lg p-4 bg-gray-100 shadow-md ">
      <h3 className="text-lg font-semibold mb-2">Review by: {review.reviewer}</h3>

      {/* Rating Table */}
      <label className="font-semibold">Overview:</label>
      <table className="border mx-auto w-full mt-2">
        <thead>
          <tr className="border h-[50px] bg-gray-200">
            <th className="border px-4 py-2">Criteria</th>
            <th className="border px-4 py-2">Rating</th>
          </tr>
        </thead>
        <tbody>
          {criteriaList.map((criteria) => {
            const ratingValue = review.reviewRatings?.[criteria]; // Directly fetch rating using the correct key
            return (
              <tr key={criteria} className="h-[50px] border">
                <td className="border px-4 py-2">{criteria}</td>
                <td className="border px-4 py-2 text-center font-semibold">
                  {ratingLabels[ratingValue] || "Not Rated"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Comments & Feedback */}
      <div className="mt-4">
        <p><strong>Comments:</strong> {review.generalComments || "No comments provided"}</p>
        <p><strong>Suggestions:</strong> {review.suggestions || "No suggestions provided"}</p>
        <p><strong>Strengths:</strong> {review.strengths || "No strengths mentioned"}</p>
        <p><strong>Weaknesses:</strong> {review.weaknesses || "No weaknesses mentioned"}</p>
        <p className="mt-2"><strong>Final Decision:</strong> {review.decision || "Pending"}</p>
      </div>
    </div>
  );
};

export default ReviewTable;
