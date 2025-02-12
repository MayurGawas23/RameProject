import Footer from "@/components/Footer";
import Header from "@/components/Header";
import axios from "axios";
import { ArrowUpRight, ArrowUpToLine } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";

const Index = (props) => {

  const router = useRouter()
  console.log(props)
  return (
    <div className="w-full h-screen flex flex-col ">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <h1 className="text-2xl font-bold text-center  sticky top-0 p-4  ">
        Our Journals
      </h1>
      <div className="flex-grow p-4 flex flex-col items-center">

        {/* Journals Grid (2 Columns) */}
        <div className="grid lg:grid-cols-1 sm:grid-cols-1 gap-8 w-[70%]  ">
          {props.journals.map((journal) => ( // Limit displayed journals to 6 for better fit
            <div
              key={journal.short_title}
              className="bg-zih nc-200 p-4 border bg-white rounded shadow-md flex  justify-start items-center cursor-pointer"
              onClick={() => router.push(`/journals/${journal.short_title}`)}
            >
              <div className="h-[250px] bg-inc-200 p-1 flex justify-start items-start w-[20%] transition hover:scale-[1.05]">
                <div className="h-full w-auto bg-white border-2 border-zinc-400 p-1">
                  <img src={journal.coverImg} className="h-full w-auto cursor-pointer"></img>
                </div>
              </div>
              <div className=" bg-ziwnc-300  w-full h-full p-4">
                <h2 className="text-2xl font-semibold mb-2 ">{journal.journalTitle}</h2>
                <p className="text-lg text-gray-600 - font-black mb-4">ISSN: {journal.issn}</p>
                <p className="line-clamp-2 mb-2 mr-[120px]"><span className="font-bold">{journal.short_title}</span> {journal.abstract}</p>
                <p className="text-sm text-gray-600  font-black">Start Year: {journal.start_year}</p>
                {/* <img src={journal.coverImg} className="text-sm text-gray-600 text-center"></img> */}

              <div className="mt-4 border-t p-2 flex justify-around">
              <Link
                  href={`/journals/${journal.short_title}`} className="text-blue-600 hover:underline text-m flex  mt-2"              >
                  View Details<ArrowUpRight className="w-5"/>
                </Link>
                <Link
                  href={`/journals/${journal.short_title}/aim&scope`} className="text-blue-600 hover:underline text-m flex  mt-2"              >
                  Aim & Scope<ArrowUpRight className="w-5"/>
                </Link>
                <Link
                  href={`/journals/${journal.short_title}/volumes`} className="text-blue-600 hover:underline text-m flex  mt-2"              >
                  Archives<ArrowUpRight className="w-5"/>
                </Link>
                <Link
                  href={`/journals/${journal.short_title}/submitpaper`} className="text-blue-600 hover:underline text-m flex  mt-2"              >
                  Submit a Paper<ArrowUpRight className="w-5"/>
                </Link>
              </div>
              </div>
            </div>
          ))}
        </div>


      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export const getServerSideProps = async () => {

  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/api/journals`
  );
  return {
    props: {
      journals: response.data,
    },
  };
};

export default Index;
