import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { useAuth } from '../utils/auth';
import { useEffect, useState } from 'react';
import Logo from './Logo';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { LogOut, Menu, User } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Avatar, AvatarFallback } from './ui/avatar';
import { DropdownMenuItem } from '@radix-ui/react-dropdown-menu';
import { useRouter } from 'next/router';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog"
import { Label } from './ui/label';
import { Input } from './ui/input';
import Register from '@/pages/register';


const Header = () => {

  const { isLoggedIn, user} = useAuth()
  const [isRegister, setIsRegister] = useState(false); // Toggle between Login/Register
  const { storeTokenInCookies } = useAuth(); // Use auth context
  const router = useRouter();

  // Form states
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullname, setFullname] = useState("");
  const [mobno, setMobno] = useState("");
  const [affiliation, setAffiliation] = useState("");
  const [error, setError] = useState("");

  // Handle form submission (Login or Register)
  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = isRegister
      ? `${process.env.NEXT_PUBLIC_API_URL}/users/register`
      : `${process.env.NEXT_PUBLIC_API_URL}/users/login`;

    const body = isRegister
      ? { username, email, password , affiliation, mobno, fullname }
      : { username, password };

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (response.ok) {
      storeTokenInCookies(data.token);
      router.push("/");
    } else {
      setError(data.message || "Something went wrong");
    }
  };

  // State to handle hydration mismatch (client-side check)
  const [isClient, setIsClient] = useState(false);
useEffect(() => { setIsClient(true); }, []);
if (!isClient) { return <div>Loading...</div>; }


  return (
    <header className="lg:w-full md:w-full  border-b  mx-auto px-4 lg:px-60 bg-grady-200 text-black pt-1 border-gray-200">
      <div className="flex justify-between items-center h-[80px]">
        {/* Logo Section */}
        <Link href="/" aria-label="RAME Publishers Home">
          <div className="">
            <Logo />
          </div>
        </Link>

        {/* Right Side - Navigation, User Authentication, Mobile Menu */}
        <div className="flex items-center gap-4 ml-auto">
          {/* Navigation Links */}
          <div className="hidden lg:flex items-center gap-4">
            <Link href="/about" className="hover:underline">About RAME</Link>
            <Link href="/policy" className="hover:underline">Publication Policy</Link>
            <Link href="/ethics" className="hover:underline">Publication Ethics</Link>
            <Link href="/joinus" className="hover:underline">Join Us</Link>
            <Link href="/contact" className="hover:underline">Contact</Link>
          </div>

          {/* User Authentication */}
            {isLoggedIn ? (
              <div className="flex items-center gap-3">
                {/* {router.pathname.startsWith("/journals") &&  (
                  <div className="flex items-center gap-3">
                    {user.role === "author" && (
                      <Link href="/submit-paper" className="mx-2 bg-[#ffa73b] p-1 rounded-sm px-2 text-white font-medium">
                        Submit paper
                      </Link>
                    )}
                    {user.role === "editor" && (
                      <Link href="/assign-reviewers" className="mx-2 bg-[#ffa73b] p-1 rounded-sm px-2 text-white font-medium">
                        Assign Reviewers
                      </Link>
                    )}
                    {user.role === "reviewer" && (
                      <Link href="/submit-review" className="mx-2 bg-[#ffa73b] p-1 rounded-sm px-2 text-white font-medium">
                        Submit Review
                      </Link>
                    )}
                  </div>
                )} */}

              <DropdownMenu>
                <DropdownMenuTrigger >
                  <Avatar className="bg-black">
                    <AvatarFallback className="bg-black text-white font-semibold text-2xl flex items-center justify-center">
                      {user?.username?.[0]?.toUpperCase() || ""}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[250px] p-2">
                  <DropdownMenuItem
                    // onClick={() => router.push('/profile')}
                    className="flex gap-2 items-center hover:bg-zinc-100 rounded-md px-3 py-2 cursor-pointer"
                  >
                    <User className="h-5 w-5" />
                    {user.role === "author" && (
             
                        <p onClick={() => router.push('/editorsdb')}>My profile</p>
                  
                    )}
                    {user.role === "editor" && (
                      
                        <p  onClick={() => router.push('/editorsdb')}>Editor DashBoard</p>
                    )}
                     {user.role === "reviewer" && (
                     
                        <p onClick={() => router.push('/reviewlist')}>Review Papers</p>
                  
                    )}
                      
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => router.push('/logout')}
                    className="flex gap-2 items-center hover:bg-zinc-100 rounded-md px-3 py-2 cursor-pointer"
                  >
                    <LogOut className="h-5 w-5" />
                    Log Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <Dialog>
            <DialogTrigger>
              <Button className="bg-[#1f7177] px-6 hidden lg:block hover:bg-[#298b92]">
               Login/Register
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>{isRegister ? "Register" : "Log In"}</DialogTitle>
              </DialogHeader>
              <div className="p-2">
                {error && <p className="text-red-500">{error}</p>}
                <form onSubmit={handleSubmit}>
                  {isRegister && (
                     <>
                      <Input
                      className="mb-4"
                      type="text"
                      placeholder="Full Name"
                      value={fullname}
                      onChange={(e) => setFullname(e.target.value)}
                      />
                    <Input
                    className="mb-4"
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    />
                     <Input
                    className="mb-4"
                    type="text"
                    placeholder="WhatsApp No. with Country Code"
                    value={mobno}
                    onChange={(e) => setMobno(e.target.value)}
                    />
                     <Input
                    className="mb-4"
                    type="text"
                    placeholder="Affiliation"
                    value={affiliation}
                    onChange={(e) => setAffiliation(e.target.value)}
                    />
                     </>
                  )}
                  <Input
                    
                    className="mb-4"
                      type="text"
                      placeholder="Username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                  />
                  <Input
                    className="mb-4"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <Button type="submit" className="bg-[#1f7177] hover:bg-[#298b92]">{isRegister ? "Register" : "Login"}</Button>
                </form>
              </div>
              <DialogFooter>
                <h1>
                  {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
                  <span
                    className="text-blue-500 hover:underline cursor-pointer"
                    onClick={() => setIsRegister(!isRegister)}
                  >
                    {isRegister ? "Login" : "Register"}
                  </span>
                </h1>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          )}

          {/* Mobile Menu Button (Sheet) */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="lg:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-full max-w-xs h-full max-h-screen overflow-y-auto p-4"
            >
              <nav className="flex flex-col gap-4">
                <Link href="/about" className="hover:underline">About RAME</Link>
                <Link href="/policy" className="hover:underline">Publication Policy</Link>
                <Link href="/ethics" className="hover:underline">Publication Ethics</Link>
                <Link href="/joinus" className="hover:underline">Join Us</Link>
                <Link href="/contact" className="hover:underline">Contact</Link>
              </nav>
            </SheetContent>
          </Sheet>

          {/* Login Button for Mobile */}
          {!isLoggedIn && (
            <Button className="bg-[#1f7177] lg:hidden " asChild>
              <Link href="/login">Login</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
