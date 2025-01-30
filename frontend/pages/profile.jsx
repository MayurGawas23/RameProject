import Header from "@/components/Header";
import Cookies from "cookies";

export async function getServerSideProps(context) {
  const cookies = new Cookies(context.req, context.res);
  const token = cookies.get("token");

  if (!token) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/profile`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch user data");
    }

    const data = await response.json();

    return {
      props: {
        user: data.userData, // Pass user data to the page
      },
    };
  } catch (error) {
    console.error("Error fetching user data:", error);
    return {
      props: {
        user: null,
      },
    };
  }
}

export default function Profile({ user }) {
  if (!user) {
    return <p>Loading...</p>;
  }

  return (
      <div>
        <Header/>
      <h1>Welcome, {user.username}!</h1>
      <p>Email: {user.email}</p>
      <p>Role: {user.role}</p>
    </div>
  );
}
