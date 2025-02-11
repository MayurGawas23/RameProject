import Brands from '@/components/Brands';
import Footer from '@/components/Footer';
import ForAuthors from '@/components/ForAuthors';
import Header from '@/components/Header';
import Link from 'next/link';
import React from 'react';

const JoinUs = () => {
  return (
    <div className="w-full min-h-screen flex flex-col">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row h-full w-full">
        {/* Left Section: Join Us Details */}
        <div className="w-full lg:w-[60%] p-4 lg:p-10">
          <h1 className="text-2xl font-bold mb-4">Join Us</h1>
          <h2 className="text-xl font-medium text-gray-800 mb-2">
            APPLY FOR REVIEWER / EDITORIAL BOARD MEMBER
          </h2>
          <p className="mb-6 text-justify">
            Eminent academicians, Industrialists, and Researchers in the
            discipline of Mechanical Engineering, Production Engineering,
            Material Science, Aeronautical Engineering, Thermal Engineering,
            Nanoscience and Nanomaterials, Computer Engineering, Information
            Technology, Electronics, and Telecommunication Engineering are
            invited to join RAME Publishers Journal free-of-charge as members
            of International Advisory Board, Editorial Board, or Reviewers
            Board.
            <br />
            If you are interested in joining RAME Publishers Journal, fill out
            the online form or send a filled Membership Form with your updated
            CV to{' '}
            <span className="font-semibold text-gray-700">
              editor.support@rame.org.in
            </span>
            . We confirm your membership of Editorial Board Member/Reviewer by
            proper review and inform you within 10 to 12 days.
          </p>
          <h2 className="text-xl font-medium text-gray-800 mb-2">
            APPLY FOR EDITORIAL BOARD MEMBER OR REVIEWER:{' '}
            <span className="text-blue-700 hover:underline cursor-pointer">
              Online Form
            </span>
          </h2>
          <h3 className="font-semibold text-gray-700 mb-6">
            Membership Form: For Offline Form
          </h3>
          <ul className="list-disc ml-6 md:ml-10 flex flex-col gap-4 text-lg">
            <li>
              International Journal of Analytical, Experimental, and Finite
              Element Analysis{' '}
              <Link href={'/docs/IJAEFEA_Membership.doc'}>
              <span className="text-blue-700 hover:underline cursor-pointer">
                (click here)
              </span></Link>
            </li>
            <li>
              International Journal of Computational and Electronics Aspects in
              Engineering{' '}
              <Link href={'/docs/IJCEAE_Membership.doc'}>
              <span className="text-blue-700 hover:underline cursor-pointer">
                (click here)
              </span></Link>
            </li>
            <li>
              Journal of Thermal and Fluid Science{' '}
              <Link href={'/docs/JPIE_Membership.doc'}>
              <span className="text-blue-700 hover:underline cursor-pointer">
                (click here)
              </span></Link>
            </li>
            <li>
              Journal of Production and Industrial Engineering{' '}
              <Link href={'/docs/JTFS_Membership.doc'}>
              <span className="text-blue-700 hover:underline cursor-pointer">
                (click here)
              </span></Link>
            </li>
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

export default JoinUs;
