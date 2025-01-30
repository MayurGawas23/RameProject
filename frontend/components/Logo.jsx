import { useRouter } from "next/router";

const Logo = () => {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push('/')}
      className="cursor-pointer flex items-center justify-center gap-2 px-5 hover:opacity-90"
      aria-label="Navigate to home"
    >
      {/* Logo Image */}
      <div>
        <img
          src="/ramelogo.png"
          alt="RAME Publishers Logo"
          className="w-20 sm:w-24 md:w-28 h-auto" // Adjust image size responsively
        />
      </div>

      {/* Logo Text */}
      <div>
        <h1 className="tracking-wider text-sm sm:text-base md:text-2xl font-semibold text-[#145E63]">
          <span className="text-[#C7740E] text-2xl sm:text-3xl md:text-5xl font-extrabold">
            RAME
          </span>
          PUBLISHERS
        </h1>

        {/* Tagline with Decorative Line */}
        <div className="flex items-center justify-center my-1">
          <div className="border-t-2 border-[#C7740E] flex-grow"></div>
          <span className="px-2 text-[#145E63] text-[9px] sm:text-[10px] font-semibold">
            A better space for quality research
          </span>
          <div className="border-t-2 border-[#C7740E] flex-grow"></div>
        </div>
      </div>
    </div>
  );
};

export default Logo;
