import Link from "next/link";

export const getServerSideProps = async (context) => {
    const { issn, volumeNumber , issueNumber } = context.params; // Extract the ISSN from the URL
    console.log("issn", issn)
  
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/journals/${issn}/volumes/${volumeNumber}/issues/${issueNumber}/papers`);
      const data = await response.json(); // Parse the response as JSON

  
      // Ensure the data is not null or undefined
      if (!data) {
        return {
          notFound: true, // Return a 404 page if no journal is found
        };
      }
  
      return {
        props: {
          papers: data, // Pass the journal object as a prop
          issn, 
          volumeNumber,
          issueNumber
        },
      };
    } catch (error) {
      console.error('Error fetching journal data:', error.message);
  
      // Return an error page or handle it gracefully
      return {
        props: {
          journal: null,
          error: error.message,
        },
      };
    }
  };

const index = ({papers, issn , volumeNumber, issueNumber}) => {
  console.log("papers", papers)
  return (
    <div>indexing
         <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        Papers in Volume {volumeNumber}, Issue {issueNumber} (ISSN: {issn})
      </h1>
      {papers && papers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {papers.map((paper) => (
            <div key={paper.doi} className="bg-white p-4 rounded shadow">
              <h2 className="text-lg font-semibold mb-2">{paper.title}</h2>
              {console.log("Authors array:", paper.authors)}
              <p className="text-gray-500 mb-2">
  Authors: {Array.isArray(paper.authors) && paper.authors.length > 0
    ? paper.authors.map(author => author.name).join(", ")
    : "N/A"}
</p>

              {paper.abstract && (
                <p className="text-sm text-gray-700 mb-2">{paper.abstract}</p>
              )}
              <p className="text-gray-400 text-sm mb-2">
                Published: {paper.publicationDate || "Unknown"}
              </p>
              <a
                href={`https://doi.org/${paper.doi}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                Read More (DOI)
              </a>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 mt-2">No papers available for this issue.</p>
      )}
      <Link
        href={`/journals/${issn}/volumes`}
        className="text-blue-500 hover:underline block mt-4"
      >
        Back to Issues
      </Link>
    </div>

    </div>
  )
}

export default index