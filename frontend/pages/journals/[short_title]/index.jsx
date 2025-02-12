import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { ArrowLeft, BookText, LibraryBig, Mail, Telescope, Users } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";

// pages/journals/[issn].js

// pages/journals/[issn].js

export const getServerSideProps = async (context) => {
  const { short_title } = context.params;  // This should be something like '2583-0961'

  // Check if `issn` is a valid journal, and prevent matching static assets
  // if (!issn || issn.includes('.')) {
  //   return {
  //     notFound: true, // Don't process requests for static assets (like .png files)
  //   };
  // }

  // Logs the correct journal ISSN like '2583-0961'

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/journals/${short_title}`);
    const data = await response.json();
    console.log(data)

    if (!data) {
      return {
        notFound: true,
      };
    }

    return {
      props: {
        journal: data,
      },
    };
  } catch (error) {
    console.error('Error fetching journal data:', error.message);
    return {
      props: {
        journal: null,
        error: error.message,
      },
    };
  }
};



const JournalDetails = ({ journal, error }) => {

  const router = useRouter()
  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!journal) {
    return <div>No journal found.</div>;
  }

  return (
    <div className="w-full ">
      <Header />
      <div className="flex-col w-full h-full ">
      <Link
            href={`/journals/`}
            className="text-blue-500 hover:underline  mt-4 flex p-2 px-[200px]"
          >
           <ArrowLeft/> Back 
          </Link>
        <div className="w-full h-full mx-auto bg-bleue-50">
        <div onClick={()=> router.push(`/journals/${journal.short_title}`)} className="h-[200px] bg-reed-300 w-full  flex justify-center items-center gap-10 p-4 cursor-pointer ">
            <div className="h-[170px] w-[120px] p-1 bg-gray-200">
            <img src={journal.coverImg} className="w-full h-full"></img>
            </div>
          <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">{journal.journalTitle}</h1>
          <h1 className="font-bold text-zinc-500">ISSN: {journal.issn}</h1>
          </div>
          </div>
          <div className="h-[40px] w-full  flex items-center justify-center mb-4  ">
            <Link  href={`/journals/${journal.short_title}/editorialboard`}    className="flex gap-2  border-black px-10  text-blue-600 hover:underline cursor-pointer h-full items-center "><Users />Editorial Board</Link>
            <Link href={`/journals/${journal.short_title}/aim&scope`} className="flex gap-2  border-black px-10  text-blue-600 hover:underline cursor-pointer  h-full items-center "  ><Telescope />Aim & Scope</Link>
            <Link href={`/journals/${journal.short_title}/submitpaper`} className="flex gap-2  border-black px-10  text-blue-600 hover:underline cursor-pointer h-full items-center "   ><BookText />Submit Manuscript</Link>
            <Link href={`/journals/${journal.short_title}/volumes`} className="flex gap-2  border-black px-10  text-blue-600 hover:underline cursor-pointer h-full items-center "  ><LibraryBig />Archives</Link>
            <Link href={`/contact`} className="flex gap-2 px-10 text-blue-600 hover:underline  cursor-pointer h-full items-center "  ><Mail />Contact us</Link>
          </div>
 
          <div className="w-[80%] mx-auto border-t-2 p-4 px-[100px]">
            {/* <h2>{journal.journalTitle}</h2> */}
            {/* <p><strong>ISSN:</strong> {journal.issn}</p> */}
            <p className="leading-[30px] mb-4"><strong>{journal.journalTitle} ({journal.short_title})</strong> {journal.abstract}</p>
            <p><strong>{journal.short_title} Features:</strong> </p>
           <div className="leading-[30px]">
           <li><span className="font-bold">Plagiarism:</span> All submitted paper is check by well known iThenticate Plagiarism software.</li>
            <li><span className="font-bold">DOI:</span> After acceptance, a worldwide unique DOI Number is assigned to paper which is indexed by Crossref.</li>
            <li><span className="font-bold">Open Access:</span> jtfs is part of online open access, which allows authors to access published article anytime and anywhere. All articles can be accessed for free.</li>
           </div>
     <div className="p-2 mb-8">
     <h1 className="font-semibold text-lg mb-2">Journal information</h1>
            <h1 className=" p-2 ">Title: {journal.journalTitle}</h1>
            <h1 className="p-2 border-b bg-zinc-200">Short Title : {journal.short_title}</h1>
            <h1 className=" p-2 ">ISSN: {journal.issn}</h1>
            <h1 className="p-2 border-b bg-zinc-200">Frequency: </h1>
            <h1 className=" p-2 ">Publisher: {journal.publisher} , {journal.country}</h1>
            <h1 className="p-2 border-b bg-zinc-200">Editor in Chief: </h1>
            <h1 className=" p-2 ">Starting year: </h1>
            <h1 className="p-2 border-b bg-zinc-200">Subject : {journal.subject}</h1>
            <h1 className=" p-2 ">Language: {journal.language} </h1>
            <h1 className="p-2 border-b bg-zinc-200">Publication Format</h1>

            <h1 className=" p-2  ">Email Id: </h1>
            <h1 className="p-2 border-b bg-zinc-200">website</h1>
     </div>

     <Link href={'/copyright'} className="font-medium text-lg mb-2 text-blue-600 hover:underline cursor-pointer">Copyright & Licensing</Link>

            {/* Add more fields as needed */}
          </div>
      <Footer />
         
        </div>
     
      </div>
    </div>
  );
};

export default JournalDetails;



