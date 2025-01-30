import { useState } from "react";
import { useAuth } from "../utils/auth"; // Import the useAuth hook
import { useRouter } from "next/router";
import Header from "@/components/Header";

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(''); // State to store error message
    const { storeTokenInCookies } = useAuth(); // Get storeTokenInCookies from AuthContext
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic validation
        if (!username || !password) {
            setError("Please fill in both fields");
            return;
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();

        if (response.ok) {
            // Clear any previous errors
            setError('');

            // Store token in cookies upon successful login
            storeTokenInCookies(data.token);
            router.replace('/'); // Redirect to profile page
        } else {
            // Show error message to the user
            setError(data.message || 'Login failed, please try again.');
            console.error('Login failed:', data.message);
        }
    };

    return null
    // (
    //     <>
    //         <Header />
    //         <div>
    //             <h2>Login</h2>
    //             {error && <p style={{ color: 'red' }}>{error}</p>} {/* Display error message */}
    //             <form onSubmit={handleSubmit}>
    //                 <input
    //                     type="text"
    //                     placeholder="Username"
    //                     value={username}
    //                     onChange={(e) => setUsername(e.target.value)}
    //                 />
    //                 <input
    //                     type="password"
    //                     placeholder="Password"
    //                     value={password}
    //                     onChange={(e) => setPassword(e.target.value)}
    //                 />
    //                 <button type="submit">Login</button>
    //             </form>
    //         </div>
    //     </>
    // );
};

export default Login;


