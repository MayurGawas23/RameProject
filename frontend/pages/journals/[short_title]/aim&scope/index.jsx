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




 

const index = ({journal , error}) => {

    const router =useRouter()

    console.log(journal.aimAndScope)
    if (error) {
        return <div>Error: {error}</div>;
      }
    
      if (!journal) {
        return <div>No journal found.</div>;
      }
  return (
    <div className="w-full ">
    <Header />
    <div className="flex flex-col w-full h-full">
    <Link
            href={`/journals/`}
            className="text-blue-500 hover:underline  mt-4 flex p-2 px-[200px]"
          >
           <ArrowLeft/> Back 
          </Link>
      <div className="w-full h-full mx-auto bg-bleue-50">
        <div onClick={()=> router.push(`/journals/${journal.short_title}`)} className="h-[200px] w-full  flex justify-center items-center gap-10 p-4 cursor-pointer ">
          <div className="h-[170px] w-[120px] p-1 bg-gray-200">
          <img src={journal.coverImg} className="w-full h-full"></img>
          </div>
        <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">{journal.journalTitle}</h1>
        <h1 className="font-bold text-zinc-500">ISSN: {journal.issn}</h1>
        </div>
        </div>
        <div className="h-[40px] w-full  flex items-center justify-center mb-4">
        <Link  href={`/journals/${journal.short_title}/editorialboard`}    className="flex gap-2  border-black px-10  text-blue-600 hover:underline cursor-pointer h-full items-center "><Users />Editorial Board</Link>
            <Link href={`/journals/${journal.short_title}/aim&scope`} className="flex gap-2  border-black px-10  text-blue-600 hover:underline cursor-pointer  h-full items-center "  ><Telescope />Aim & Scope</Link>
            <Link href={`/journals/${journal.short_title}/submitpaper`} className="flex gap-2  border-black px-10  text-blue-600 hover:underline cursor-pointer h-full items-center "   ><BookText />Submit Manuscript</Link>            <Link href={`/journals/${journal.issn}/volumes`} className="flex gap-2  border-black px-10  text-blue-600 hover:underline cursor-pointer h-full items-center "  ><LibraryBig />Archives</Link>
            <Link href={`/contact`} className="flex gap-2 px-10 text-blue-600 hover:underline  cursor-pointer h-full items-center "  ><Mail />Contact us</Link>
        </div>

        <div className="w-[70%] mx-auto border-t-2 p-4 px-[100px]">
          <h1 className="text-2xl font-semibold mb-4 ">Aim and Scope</h1>
            <h1 className="leading-[30px] mb-8">{journal.aimAndScope.description}</h1>

        
  <h1 className="text-xl font-semibold mb-4">Topics Covered:</h1>
  <ul className="list-disc pl-5">
    {journal.aimAndScope.topics.map((topic, index) => (
      <li key={index} className="text-gray-700 ml-4">
        {topic}
      </li>
    ))}
  </ul>

            </div>
            </div>
            </div>
            </div>
  )
}

export default index