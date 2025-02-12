import Header from "@/components/Header";
import Link from "next/link";
import { format } from "date-fns";
import { ArrowLeft } from "lucide-react";

export const getServerSideProps = async (context) => {
  const { short_title, volumeNumber, issueNumber , paperNumber } = context.params; // Extract the ISSN from the URL
  console.log("issn", short_title)

  try {
     // Run both fetch requests concurrently
     const [papersResponse, journalResponse] = await Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/journals/${short_title}/volumes/${volumeNumber}/issues/${issueNumber}/papers`),
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/journals/${short_title}`)
    ]);

    // Parse both responses as JSON
    const [papersData, journalData] = await Promise.all([
      papersResponse.json(),
      journalResponse.json()
    ]);

    if (!papersData || !journalData) {
      return { notFound: true }; // Return 404 if either dataset is missing
    }



    // Ensure the data is not null or undefined
    // if (!data) {
    //   return {
    //     notFound: true, // Return a 404 page if no journal is found
    //   };
    // }

    return {
      props: {
        // journal,
        journal:journalData,
        papers: papersData, // Pass the journal object as a prop
        short_title,
        volumeNumber,
        issueNumber,
        // journal
        
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

const index = ({ papers, short_title, volumeNumber, issueNumber, paperNumber , journal }) => {
  console.log("papers", papers)
  return (
    <div>
      <Header />
      <Link
            href={`/journals/${short_title}/volume`}
            className="text-blue-500 hover:underline  mt-4 flex p-2 px-[200px]"
          >
           <ArrowLeft/> Back 
          </Link>
        <div className="w-full h-full mx-auto bg-bleue-50">
        <div onClick={()=> router.push(`/journals/${short_title}`)} className="h-[200px] bg-reed-300 w-full  flex justify-center items-center gap-10 p-4 cursor-pointer ">
            <div className="h-[170px] w-[120px] p-1 bg-gray-200">
            <img src={journal.coverImg} className="w-full h-full"></img>
            </div>
          <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">{journal.journalTitle}</h1>
          <h1 className="font-bold text-zinc-500">ISSN: {journal.issn}</h1>
          </div>
          </div>
          {/* <div className="h-[40px] w-full  flex items-center justify-center mb-4  ">
            <Link  href={`/journals/${journal.issn}/editorialboard`}    className="flex gap-2  border-black px-10  text-blue-600 hover:underline cursor-pointer h-full items-center "><Users />Editorial Board</Link>
            <Link href={`/journals/${journal.issn}/aim&scope`} className="flex gap-2  border-black px-10  text-blue-600 hover:underline cursor-pointer  h-full items-center "  ><Telescope />Aim & Scope</Link>
            <Link href={`/journals/${journal.issn}/submitpaper`} className="flex gap-2  border-black px-10  text-blue-600 hover:underline cursor-pointer h-full items-center "   ><BookText />Submit Manuscript</Link>
            <Link href={`/journals/${journal.issn}/volumes`} className="flex gap-2  border-black px-10  text-blue-600 hover:underline cursor-pointer h-full items-center "  ><LibraryBig />Archives</Link>
            <Link href={`/contact`} className="flex gap-2 px-10 text-blue-600 hover:underline  cursor-pointer h-full items-center "  ><Mail />Contact us</Link>
          </div> */}
      <div className="p-6 w-[80%] mx-auto">
        <h1 className="text-2xl font-bold mb-4">
          Papers in Volume {volumeNumber}, Issue {issueNumber} (ISSN: {short_title})
        </h1>
        {papers && papers.length > 0 ? (
          <div className="grid grid-cols-1  gap-6">
            {papers.map((paper) => (
              <div key={paper.doi} className="bg-whitee border-b p-4 rounded shadow">
                <Link href={`/journals/${short_title}/volumes/${volumeNumber}/issues/${issueNumber}/papers/${paper.paperNumber}`} className="text-lg font-semibold mb-2 hover:text-[#3a00a7] hover:underline hover:cursor-pointer ">{paper.paperTitle}</Link>
                {console.log("Authors array:", paper.authors)}
                <p className="text-gray-500 mb-2">
                  Authors: {Array.isArray(paper.authors) && paper.authors.length > 0
                    ? paper.authors.map(author => author.name).join(", ")
                    : "N/A"}
                </p>

                {paper.abstract && (
                  <p className="text-sm text-gray-500 mb-2">Pages: {paper?.pages}</p>
                )}
               

<p className="text-gray-400 text-sm mb-2">
  Published: {paper.publicationDate ? format(new Date(paper.publicationDate), "MMMM dd, yyyy") : "Unknown"}
</p>


                {/* /////////////////////////////////////
              <a
                href={`https://doi.org/${paper.doi}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                Read More (DOI)
              </a>
                ////////////////////////////////////////// */}

              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 mt-2">No papers available for this issue.</p>
        )}
        <Link
          href={`/journals/${short_title}/volumes`}
          className="text-blue-500 hover:underline block mt-4"
        >
          Back to Issues
        </Link>
      </div>

    </div>
    </div>
  )
}

export default index