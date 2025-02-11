import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import axios from "axios";
import Link from "next/link";
import { useState } from "react";

const Index = (props) => {
  const [selectedPaper, setSelectedPaper] = useState(null);
  console.log(props);

  const handlePaperClick = (journal) => {
    setSelectedPaper(journal);
    console.log("Selected journal:", journal); // Logs selected journal data
  };

  return (
    <div className="w-full h-screen flex flex-col">
    {/* Header */}
    <Header />

    {/* Main Content */}
    <div className="flex-grow bg-gray-100 p-4 flex flex-col items-center">
      <h1 className="text-2xl font-bold text-center mb-4 flex-shrink-0">
        Journals
      </h1>

      {/* Journals Grid (2 Columns) */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-8 w-[80%] ">
        {props.journals.map((journal) => ( // Limit displayed journals to 6 for better fit
          <div
            key={journal.issn}
            className="bg-zinc-200 p-4  rounded shadow-md flex flex-col justify-center items-center"
          >
            <div className="h-[250px] bg-zinc-200 p-1 flex justify-center items-center w-full transition hover:scale-[1.05]">
            <div className="h-full w-auto bg-white p-1">
            <img src={journal.coverImg} className="h-full w-auto cursor-pointer"></img>
            </div>
            </div>
            <div className=" bg-zinc-200 w-full p-2">
            <h2 className="text-lg font-semibold text-center">{journal.journalTitle}</h2>
            <p className="text-sm text-gray-600 text-center font-black">{journal.issn}</p>
            <p className="text-sm text-gray-600 text-center font-black">{journal.start_year}</p>
              </div>

              {/* Edit Button */}
              <Link href={`/editorsdb/edjournals/${journal.issn}`} >
                <Button className="text-white bg-blue-500 hover:bg-blue-600 mt-2">
                  Edit Journal Details
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

// Fetch Journals
export const getServerSideProps = async () => {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/journals`);
    return {
      props: {
        journals: response.data,
      },
    };
  } catch (error) {
    console.error("Error fetching journals:", error);
    return {
      props: {
        journals: [],
      },
    };
  }
};

export default Index;
