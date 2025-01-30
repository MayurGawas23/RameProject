import { useState, useEffect } from 'react';
import { useAuth } from '../utils/auth';
import Header from '../components/Header';
import ForAuthors from '@/components/ForAuthors';
import Brands from '@/components/Brands';
import Footer from '@/components/Footer';

const Contact = ({ user }) => {
  const [contact, setContact] = useState({ email: '', message: '' });

  useEffect(() => {
    if (user && user.email) {
      setContact({ email: user.email, message: '' });
    }
  }, [user]);

  const handleInput = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setContact({ ...contact, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(`Email: ${contact.email} Message: ${contact.message}`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <div className="flex-1 py-10 px-4 md:px-10 lg:px-20 xl:px-40 flex flex-col lg:flex-row gap-10">
        {/* Left Section: Contact Details */}
        <div className="lg:w-[60%] w-full space-y-6">
          <div>
            <h1 className="font-bold text-2xl mb-4">For Any Kind of Editorial Support</h1>
            <p>General Enquiry, Conference Support, To check Plagiarism, Special Issue Enquiry</p>
            <p>
              Email us to our editorial team at{' '}
              <span className="text-blue-600 hover:underline cursor-pointer">editor.support@rame.org.in</span>
            </p>
          </div>
          <div>
            <h1 className="font-bold text-xl">Address</h1>
            <p>Dr. Manoj A. Kumbhalkar</p>
            <p>Publisher, RAME Publishers, India</p>
            <p>(Research Association of Masters of Engineering)</p>
            <p>33, Mandarkrupa Soc., Narsala Road, Nagpur-440034, Maharashtra, India</p>
            <p className="text-blue-600 hover:underline cursor-pointer">
              Email: publisher@rame.org.in
            </p>
          </div>
          <div>
            <p>RAME Publishers, India</p>
            <p>A-907, Megh Sparsh, Pune-Bangalore Highway, Ambegaon (Kh), Pune-411046, Maharashtra, India</p>
            <p>Email: publisher@rame.org.in</p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:w-[40%] w-full flex flex-col items-center justify-center">
          <div className="max-w-md w-full p-6 bg-white border border-gray-300 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Contact Us</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                  value={contact.email}
                  onChange={handleInput}
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows="4"
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                  value={contact.message}
                  onChange={handleInput}
                ></textarea>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-md shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

// SSR with getServerSideProps
export async function getServerSideProps() {
  const user = { email: 'user@example.com' }; // Replace with actual user data fetching logic
  return { props: { user } };
}

export default Contact;
