import Link from "next/link";

export const getServerSideProps = async (context) => {
// const context = context.params
// console.log("context", context.params)

    const { issn } = context.params; // Extract the ISSN from the URL
    console.log("issn", issn)
  
    try {
      const data = await(await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/journals/${issn}/volumes`)).json();
    //   const data = await response.json(); // Parse the response as JSON
  
      // Ensure the data is not null or undefined
      if (!data) {
        return {
          notFound: true, // Return a 404 page if no journal is found
        };
      }
    //   console.log("issues",issues)
      return {
        props: {
          volume: data, // Pass the journal object as a prop
          issn
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
  

const index = ({volume, issn,  error}) => {
    console.log("volume", volume)
    
  return (
    <div>index

<div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Volumes for ISSN: {issn}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {volume.map((volume) => (
          <div key={volume.volumeNumber} className="bg-white p-4 rounded shadow">
            <h2 className="text-xl font-semibold mb-2">Volume {volume.volumeNumber}</h2>
            {volume.issues && volume.issues.length > 0 ? (
  <ul className="mt-2 space-y-1">
    {volume.issues.map((issue, index) => (
      <li key={issue.issueNumber || index}>
        <Link
          href={`/journals/${issn}/volumes/${volume.volumeNumber}/issues/${issue.issueNumber}/papers`}
          className="text-blue-500 hover:underline"
        >
          Issue {issue.issueNumber}
        </Link>
      </li>
    ))}
  </ul>
) : (
  <p className="text-gray-500 mt-2">No issues available</p>
)}

          </div>
        ))}
      </div>
    </div>
    <Link
        href={`/journals/${issn}/`}
        className="text-blue-500 hover:underline block mt-4"
      >
        Back to journal
      </Link>
    </div>
  )
}

export default index