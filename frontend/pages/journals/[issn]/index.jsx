import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { BookText, LibraryBig, Mail, Telescope, Users } from "lucide-react";
import Link from "next/link";

// pages/journals/[issn].js

// pages/journals/[issn].js

export const getServerSideProps = async (context) => {
  const { issn } = context.params;  // This should be something like '2583-0961'

  // Check if `issn` is a valid journal, and prevent matching static assets
  if (!issn || issn.includes('.')) {
    return {
      notFound: true, // Don't process requests for static assets (like .png files)
    };
  }

  console.log("ISSN:", issn);  // Logs the correct journal ISSN like '2583-0961'

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/journals/${issn}`);
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
  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!journal) {
    return <div>No journal found.</div>;
  }

  return (
    <div className="w-full h-screen">
      <Header />
      <div className="flex w-full h-full">
        <div className="w-[80%] h-full bg-blue-50">
          <div className="h-[200px] w-full bg-yellow-200 flex justify-center items-center gap-10 p-4 border-b border-black ">
            <div className="h-[170px] w-[120px] p-1 bg-white">
            <img src={journal.coverImg} className="w-full h-full"></img>
            </div>
            <h1 className="text-3xl font-bold">{journal.title}</h1>
          </div>
          <div className="h-[100px] w-full bg-gray-300 flex items-center justify-around">
            <h1      className="flex gap-2"><Users />Editorial Board</h1>
            <h1 className="flex gap-2"><Telescope />Aim & Scope</h1>
            <h1 className="flex gap-2"><BookText />Submit Manuscript</h1>
            <Link href={`/journals/${journal.issn}/volumes`} className="flex gap-2"><LibraryBig />Archives</Link>
            <h1 className="flex gap-2"><Mail />Contact us</h1>
          </div>

          <div>
            <h2>{journal.title}</h2>
            <p><strong>ISSN:</strong> {journal.issn}</p>
            <p><strong>{journal.title}({journal.short_title})</strong> {journal.abstract}</p>
            <p><strong>{journal.short_title} Features:</strong> </p>
            <li>Plagiarism:All submitted paper is check by well known iThenticate Plagiarism software.</li>
            <li>DOI: After acceptance, a worldwide unique DOI Number is assigned to paper which is indexed by Crossref.</li>
            <li>Open Access: jtfs is part of online open access, which allows authors to access published article anytime and anywhere. All articles can be accessed for free.</li>
            <h1>Journal information</h1>
            <h1>Title: {journal.title}</h1>
            <h1>Short title : {journal.short_title}</h1>
            <h1>ISSN: {journal.issn}</h1>
            <h1>Frequency: </h1>
            <h1>Publisher: {journal.publisher} , India</h1>
            <h1>Editor in Chief: </h1>
            <h1>Statring year: </h1>
            <h1>Subject : </h1>
            <h1>Language: </h1>
            <h1>Publication Format</h1>

            <h1>Email Id: </h1>
            <h1>website</h1>

            {/* Add more fields as needed */}
          </div>
          <Link
            href={`/journals/`}
            className="text-blue-500 hover:underline block mt-4"
          >
            Back to all journals
          </Link>
        </div>
        <div className="w-[25%] h-full bg-red-300">

        </div>
      </div>
      <Footer />
    </div>
  );
};

export default JournalDetails;



