  import Footer from "@/components/Footer";
  import Header from "@/components/Header";
  import Link from "next/link";
  import { format } from "date-fns";
  import { ArrowLeft, BookText, LibraryBig, Mail, Telescope, Users } from "lucide-react";
import { useRouter } from "next/router";

  export const getServerSideProps = async (context) => {
  // const context = context.params
  // console.log("context", context.params)

      const { issn } = context.params; // Extract the ISSN from the URL
      console.log("issn", issn)

    
      try {
        const data = await(await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/journals/${issn}/volumes`)).json();
                  // await(await fetch)(`${process.env.NEXT_PUBLIC_API_URL}/api/journals/${issn}`)
        
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
            // journal:data,
            journal: data, // Pass the journal object as a prop
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
    

    const Index = ({  journal,issn }) => {
      console.log(journal.volumes)

      const router = useRouter()
      return (
        <div className="grid min-h-screen grid-rows-[auto_1fr_auto] ">
          <Header />
          <Link
            href={`/journals/${issn}`}
            className="text-blue-500 hover:underline  mt-4 flex p-2 px-[200px]"
          >
           <ArrowLeft/> Back 
          </Link>
        <div className="w-full h-full mx-auto bg-bleue-50">
        <div onClick={()=> router.push(`/journals/${issn}`)} className="h-[200px] bg-reed-300 w-full  flex justify-center items-center gap-10 p-4 cursor-pointer ">
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
          <main className="p-6 w-[60%] mx-auto">
          
            <h1 className="text-2xl font-bold mb-4">Volumes of ISSN: {issn}</h1>
            <div className="grid grid-cols-1 gap-6">
              {journal.volumes.map((vol) => (
                <div key={vol.volumeNumber} className="bg-white p-4 rounded shadow">
                  <h2 className="text-xl font-semibold mb-2 border-b">Volume {vol.volumeNumber}</h2>
                  {vol.issues && vol.issues.length > 0 ? (
                    <ul className="mt-2 space-y-2">
                      {vol.issues.map((issue) => {
                        let firstPaperDate = null;
                        let lastPaperDate = null;
    
                        if (issue.papers?.length > 0) {
                          const sortedPapers = issue.papers
                            .filter((paper) => paper.publicationDate)
                            .sort((a, b) => new Date(a.publicationDate) - new Date(b.publicationDate));
    
                          if (sortedPapers.length > 0) {
                            firstPaperDate = new Date(sortedPapers[0].publicationDate);
                            lastPaperDate = new Date(sortedPapers[sortedPapers.length - 1].publicationDate);
                          }
                        }
    
                        return (
                          <li key={issue.issueNumber} className="flex items-center justify-between">
                            <Link
                              href={`/journals/${issn}/volumes/${vol.volumeNumber}/issues/${issue.issueNumber}/papers`}
                              className="text-blue-500 hover:underline"
                            >
                              Issue {issue.issueNumber}
                            </Link>
                            <span className="text-gray-600 text-sm">
                              {firstPaperDate && lastPaperDate
                                ? firstPaperDate.getFullYear() === lastPaperDate.getFullYear()
                                  ? format(lastPaperDate, "MMMM yyyy")
                                  : `${format(firstPaperDate, "MMMM yyyy")} - ${format(lastPaperDate, "MMMM yyyy")}`
                                : " "}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  ) : (
                    <p className="text-gray-500 mt-2">No issues available</p>
                  )}
                </div>
              ))}
            </div>
   
          </main>
          <Footer />
        </div>
        </div>
      );
    };
    
    export default Index;
