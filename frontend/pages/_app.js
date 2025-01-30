// In your _app.js or similar
import { useEffect, useState } from 'react';
import { AuthProvider } from '../utils/auth';
import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  // const [isClient, setIsClient] = useState(false);

  // useEffect(() => {
  //   setIsClient(true); // Mark the app as client-side once mounted
  // }, []);

  // if (!isClient) {
  //   return <div>Loading...</div>; // Prevent SSR mismatch
  // }

  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
}

export default MyApp;
