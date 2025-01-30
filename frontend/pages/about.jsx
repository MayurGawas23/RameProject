import Brands from "@/components/Brands";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Head from "next/head";

const About = () => {
  return (
   <>
    <Head>

</Head>

<div className="min-h-screen flex flex-col">
  <Header />
  <div className="flex-1 w-full py-10 px-6 md:px-10 lg:px-20 xl:px-40 flex flex-col lg:flex-row overflow-y-auto">
    {/* Left Section */}
    <div className="lg:w-[60%] w-full p-3">
      <h1 className="text-2xl font-bold mb-4">Our Mission</h1>
      <p className="text-base md:text-lg mb-6">
        To provide a peer-reviewed platform for outstanding researchers to exhibit their findings for the furtherance of technology.
      </p>
      <h1 className="text-2xl font-bold mb-4">
        ABOUT RAME Publishers (Research Association of Masters of Engineering)
      </h1>
      <p className="text-base md:text-lg leading-relaxed">
        RAME Publishers (Research Association of Masters of Engineering) is an independent open-access science and engineering-based publisher committed to providing a peer-reviewed platform to outstanding researchers to exhibit their findings for the furtherance of technology. We are devoted to continual innovation to better support the wishes of our communities, ensuring the integrity of the research we publish, and championing the importance of open research.
        <br />
        <br />
        RAME Publishers invites young students, scientists, researchers, and academicians to contribute to our open-access journals and promote their research work as technical papers. All articles published in the journal will be freely available to scientific researchers and innovators globally. We aim to inspire innovators and researchers to bring their contributions in the form of research papers, articles, case studies, review articles, and innovations in the fields of engineering, science, and technology.
      </p>
    </div>
    
    {/* Right Section */}
    <div className="lg:w-[40%] w-full flex justify-center mt-10 lg:mt-0">
      {/* Uncomment ForAuthors if needed */}
      {/* <ForAuthors /> */}
      <Brands />
    </div>
  </div>

  <Footer />
</div>
   </>
  );
};

export default About;
