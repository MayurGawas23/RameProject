import { useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../utils/auth"; // Import the useAuth hook
import axios from "axios";

const Register = () => {
    const { storeTokenInCookies } = useAuth(); // Use storeTokenInCookies from AuthContext
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    // Handle user registration
    const handleRegister = async (e) => {
        e.preventDefault();

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/register`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email , username, password }),
      });

      const data = await response.json();
      console.log(data)
      
      if (response.ok) {
          // Store token in cookies upon successful login
          storeTokenInCookies(data.token);
          router.push('/')
      } else {
          console.error('Registration failed:', data.message);
      }
  };

    return (
        <div>
            <h2>Register</h2>
            <form onSubmit={handleRegister}>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Register</button>
            </form>
            {error && <p>{error}</p>} {/* Display error message if any */}
        </div>
    );
};

export default Register;
