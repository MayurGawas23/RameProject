import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="z-40 w-full pt-3 bg-[#1F2937] flex flex-col justify-between  text-[#8CA3A4] font-[poppins-regular]    ">
      <div className="flex flex-col lg:flex-row justify-between px-6 lg:px-20 space-y-10 lg:space-y-10 mb-10">
        {/* Support Section */}
        <div className="flex flex-col space-y-2 mt-10">
          <h1 className="font-semibold text-lg text-white">Supports</h1>
          <Link href="#" className="text-sm hover:underline">
            Help Overview
          </Link>
          <Link href="#" className="text-sm hover:underline">
            Frequently Asked Questions (FAQs)
          </Link>
          <Link href="#" className="text-sm hover:underline">
            Privacy Policy
          </Link>
          <Link href="#" className="text-sm hover:underline">
            Terms & Conditions
          </Link>
        </div>

        {/* Policies Section */}
        <div className="flex flex-col space-y-2">
          <h1 className="font-semibold text-lg text-white">Policies</h1>
          <Link href="#" className="text-sm hover:underline">
            Authorship
          </Link>
          <Link href="#" className="text-sm hover:underline">
            Conflicts of Interest
          </Link>
          <Link href="#" className="text-sm hover:underline">
            Copyright & Licensing
          </Link>
          <Link href="#" className="text-sm hover:underline">
            Plagiarism
          </Link>
        </div>

        {/* Download Forms Section */}
        <div className="flex flex-col space-y-2">
          <h1 className="font-semibold text-lg text-white">Download Forms</h1>
          <Link href="#" className="text-sm hover:underline">
            Paper Template
          </Link>
          <Link href="#" className="text-sm hover:underline">
            Copyright Transfer Agreement
          </Link>
          <Link href="#" className="text-sm hover:underline">
            Membership Form
          </Link>
          <Link href="#" className="text-sm hover:underline">
            Author's Guidelines
          </Link>
        </div>

        {/* Contact Section */}
        <div className="flex flex-col space-y-2">
          <h1 className="font-semibold text-lg text-white">Contact</h1>
          <p className="text-sm">
            <span className="font-medium">RAME Publishers,</span>
          </p>
          <p className="text-sm">
            33, Mandarkrupa Soc., Narsala Road,
            <br />
            Nagpur, Maharashtra, India. (440034)
          </p>
          <Link href="#" className="text-sm hover:underline">
            <span className="font-semibold">Email:</span> publisher@rame.org.in
          </Link>
        </div>

        {/* Socials Section */}
        <div className="flex flex-col space-y-3">
          <h1 className="font-semibold text-lg text-white">Socials</h1>
          <div className="flex space-x-4">
            <Link href="#">
              <img
                src="/linkedin.png"
                alt="LinkedIn"
                className="h-6 w-6 hover:scale-110 transition-transform"
              />
            </Link>
            <Link href="#">
              <img
                src="/x.png"
                alt="Twitter"
                className="h-6 w-6 hover:scale-110 transition-transform"
              />
            </Link>
            <Link href="#">
              <img
                src="/facebook.png"
                alt="Facebook"
                className="h-6 w-6 hover:scale-110 transition-transform"
              />
            </Link>
            <Link href="#">
              <img
                src="/youtube.png"
                alt="YouTube"
                className="h-6 w-6 hover:scale-110 transition-transform"
              />
            </Link>
          </div>
        
        </div>
      
      </div>

      {/* Footer Bottom */}
      <div className="w-full text-center py-4 border-t border-[#8CA3A4] text-sm bg-[#1F2937]">
        © 2025 RAME Publishers. All Rights Reserved.
      </div>
      
    </footer>
  );
};

export default Footer;
