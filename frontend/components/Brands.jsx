const Brands = () => {
  return (
    <div className="w-full lg:w-[40%] h-auto lg:h-[500px] flex items-center justify-center flex-col py-6 lg:py-0">
      <div className="text-xl font-bold mb-4 text-gray-800">Publishing with</div>
      <div className="flex flex-col gap-6 content-evenly h-auto lg:h-[400px] border bg-white p-6 rounded-lg shadow-md">
        <img
          src="crossref.jpg"
          alt="CrossRef Logo"
          className="w-[200px] mx-auto"
          loading="lazy"
        />
        <img
          src="Open-Access-logo1.png"
          alt="Open Access Logo"
          className="w-[200px] mx-auto"
          loading="lazy"
        />
        <img
          src="scholar_logo_md_2011.gif"
          alt="Google Scholar Logo"
          className="w-[200px] mx-auto"
          loading="lazy"
        />
        <img
          src="88x31.png"
          alt="DOAJ Logo"
          className="w-[150px] mx-auto"
          loading="lazy"
        />
      </div>
    </div>
  );
};

export default Brands;
