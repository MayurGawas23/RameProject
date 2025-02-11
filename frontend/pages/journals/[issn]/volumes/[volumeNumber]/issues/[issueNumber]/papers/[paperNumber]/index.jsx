import React from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import { format } from 'date-fns';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import Header from '@/components/Header';

export const getServerSideProps = async (context) => {
  try {
    const { issn, volumeNumber, issueNumber, paperNumber } = context.params;

    console.log(`Fetching Paper: ISSN=${issn}, Volume=${volumeNumber}, Issue=${issueNumber}, Paper=${paperNumber}`);

    // Fetch journal details and specific paper concurrently
    const [paperResponse, journalResponse] = await Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/journals/${issn}/volumes/${volumeNumber}/issues/${issueNumber}/papers/${paperNumber}`),
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/journals/${issn}`)
    ]);

    // Check if both responses are valid
    if (!paperResponse.ok || !journalResponse.ok) {
      throw new Error(`Failed to fetch data. Paper: ${paperResponse.status}, Journal: ${journalResponse.status}`);
    }

    // Parse JSON responses
    const [paperData, journalData] = await Promise.all([
      paperResponse.json(),
      journalResponse.json()
    ]);

    console.log("Paper Data:", paperData);
    console.log("Journal Data:", journalData);

    return {
      props: {
        journal: journalData,
        data: paperData,
        volumeNumber,
        issueNumber
      },
    };
  } catch (error) {
    console.error("Error fetching paper:", error.message);

    return {
      props: {
        paper: null,
        error: error.message || "Failed to fetch paper",
      },
    };
  }
};




const Paper = ({ data, journal, volumeNumber, issueNumber, error }) => {
  const router = useRouter();
  const { paperNumber } = router.query; // Ensure correct query parameter
  console.log(router.query);
  // console.log("pdf", data.pdf);



  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-col ">
        <Link
          href={`/journals/${journal.issn}/volumes`}
          className="text-blue-500 hover:underline  mt-4 inline-flex bg-bleue-200  pl-[80px]"
        >
          <ArrowLeft /> Back
        </Link>
        <div onClick={() => router.push(`/journals/${journal.issn}`)} className="h-[200px] border-b-2 bg-reed-300 mx-auto   flex justify-center items-center gap-10 p-4 cursor-pointer ">
          <div className="h-[170px] w-[120px] p-1 bg-gray-200">
            <img src={journal.coverImg} className="w-full h-full"></img>
          </div>
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold">{journal.journalTitle}</h1>
            <h1 className="font-bold text-zinc-500">ISSN: {journal.issn}</h1>
          </div>
        </div>
      </div>
      <div className="w-[60%] mx-auto flex flex-col ">
        <h1 className='text-2xl font-semibold   '>{data.paperTitle}</h1>
        <h3 className='font-bold font-[roboto] text-lg text-zinc-600 mb-2'> {Array.isArray(data.authors) && data.authors.length > 0
          ? data.authors.map(author => author.name).join(", ")
          : "N/A"}</h3>
        <h2 className=" font-[roboto] font-bold "><span className='text-blue-600'>Volume {volumeNumber} Issue {issueNumber} Paper {paperNumber}</span>, {data.publicationDate ? format(new Date(data.publicationDate), "MMMM yyyy") : "Unknown"}, pp {data.pages} </h2>
        {data ? (
          <div>
            <h2 className="text-xl font-semibold">{data.title}</h2>
            <p className='font-[roboto] '><strong>DOI:</strong> {data.doi}</p>
            <p><strong>Abstract:</strong> {data.abstract}</p>
            <p><strong>Publication Date:</strong>
              {data.publicationDate ? format(new Date(data.publicationDate), "MMMM dd, yyyy") : "Unknown"}
            </p>
            <div className=" w-full bordfer rounded-lg shardow-md bg-whitde">
              <h2 className="text-lg font-semibold ">Authors</h2>
              {data.authors && data.authors.length > 0 ? (
                <ul className="pl-5">
                  {data.authors.map((author, index) => (
                    <li
                      key={index}
                      className="bg-greay-100 flex justify-start gap-10 rounded-lg p-1 items-start"
                    >
                      <p className="w-[250px]"><strong>Name:</strong> {author.name || "N/A"}</p>
                      <p className="w-[300px]"><strong>Email:</strong> {author.email || "--"}</p>
                      <p className="w-[300px]"><strong>Affiliation:</strong> {author.affiliation || "--"}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No authors available.</p>
              )}


            </div>

            <h3 className='font-bold text-lg'>Index Terms:
              {Array.isArray(data.indexTerms) && data.indexTerms.length > 0 ? (
                data.indexTerms.map((term, index) => (
                  <span key={index} className="ml-2 font-medium">{term}{index !== data.indexTerms.length - 1 && ", "}</span>
                ))
              ) : (
                <span> N/A</span>
              )}
            </h3>

            <h3 className='font-bold text-lg'>References:</h3>
            {Array.isArray(data.references) && data.references.length > 0 ? (
              <ol className="ml-4 list-decimal">
                {data.references.map((ref, index) => (
                  <li key={index} className="ml-2 font-medium">{ref}</li>
                ))}
              </ol>
            ) : (
              <span> N/A</span>
            )}

<h3>
  <a
    href={data.pdf}
    target="_blank"
    rel="noopener noreferrer"
    className="text-blue-600 hover:underline font-bold"
  >
    Download PDF
  </a>
</h3>




          </div>
        ) : (
          <p className="text-gray-500">No paper data available.</p>
        )}
      </div>
    </div>
  );
};

export default Paper;
