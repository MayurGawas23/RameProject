import Brands from "@/components/Brands";
import Footer from "@/components/Footer";
import ForAuthors from "@/components/ForAuthors";
import Header from "@/components/Header";

const Policy = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row h-full w-full">
        {/* Left Section: Policies */}
        <div className="w-full lg:w-[60%] p-4 lg:p-10">
          <h1 className="font-black text-3xl mb-8">Publication Policies</h1>
          <h2 className="font-bold text-xl mb-6">
            Authors can check publication policies of RAME Publishers as follows:
          </h2>
          <ul className="ml-4 md:ml-8 list-disc text-base md:text-lg space-y-4">
            <li className="hover:underline cursor-pointer">Authorship Policy</li>
            <li className="hover:underline cursor-pointer">Conflicts of Interest Policy</li>
            <li className="hover:underline cursor-pointer">Copyright and Licensing Policy</li>
            <li className="hover:underline cursor-pointer">Open Access Policy</li>
            <li className="hover:underline cursor-pointer">Peer Review Policy</li>
            <li className="hover:underline cursor-pointer">Plagiarism Policy</li>
            <li className="hover:underline cursor-pointer">Archiving Policy</li>
            <li className="hover:underline cursor-pointer">Terms of Service</li>
            <li className="hover:underline cursor-pointer">Privacy Policy</li>
            <li className="hover:underline cursor-pointer">Cancellation/Refund Policy</li>
          </ul>
        </div>

        {/* Right Section: ForAuthors & Brands */}
        <div className="w-full lg:w-[40%] flex flex-col items-center px-4 lg:px-10 pt-10 gap-10">
          <ForAuthors />
          <Brands />
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Policy;
