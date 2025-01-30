import Footer from "@/components/Footer";
import Header from "@/components/Header";
import axios from "axios";
import Link from "next/link";

const Index = (props) => {
  console.log(props)
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 w-[80%]">
          {props.journals.slice(0, 6).map((journal) => ( // Limit displayed journals to 6 for better fit
            <div
              key={journal.issn}
              className="bg-white p-4 h-[200px] rounded shadow-md flex"
            >
              <div className="w-[18%] bg-red-300 p-1">
              <img src={journal.coverImg} className="h-full w-full"></img>
              </div>
              <div className="w-[80%] bg-blue-50">
              <h2 className="text-lg font-semibold text-center">{journal.title}</h2>
              <p className="text-sm text-gray-600 text-center">{journal.issn}</p>
              {/* <img src={journal.coverImg} className="text-sm text-gray-600 text-center"></img> */}

              <Link
                href={`/journals/${journal.issn}`} className="text-blue-500 hover:underline text-sm text-center block mt-2"              >
                View Details
              </Link>
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
