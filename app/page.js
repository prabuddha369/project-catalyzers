"use client";
import Image from "next/image";
import Link from "next/link";
import VideoList from "./videolist";
import { UserAuth } from "./context/AuthContext";
import pcat from "../public/pcat_logo.png";
import { AiOutlineFileSearch } from "react-icons/ai";
export default function Home() {
  const { user, logOut } = UserAuth();
  const handleSignOut = async () => {
    try {
      await logOut();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <main className=" p-10 w-full h-screen bg-gradient-to-b from-[#ea65dd] to-[#0c163a] text-stone-300 ">
      {user ? (
        <div>
          <div className="flex justify-between">
            <div className="flex gap-4 place-items-center">
              <Image
                src={user.photoURL}
                alt="user photo"
                width={50}
                height={100}
                className="rounded-full"
              />
              <p>{`${user.displayName ? user.displayName : user.email}`}</p>
              <button onClick={handleSignOut}>Sign Out</button>
            </div>
            <div className="w-1/4 flex gap-4 items-center">
              <div>
                <p className="text-2xl">PROJECT CATALYZERS</p>
                <p className="text-xs">Welcome to Project Catalyzer,</p>
                <p className="text-xs">
                  where we nurture Innovation through collaborative learning.
                </p>
              </div>
              <Image
                src={pcat}
                width={120}
                height={50}
                className="rounded-xl"
              />
            </div>
          </div>
          <div className="p-10 flex justify-between ">
            <p className="text-2xl">Look In to Library</p>
            <div className="bg-[#9f74ac] w-1/4 rounded-xl h-fit p-2 flex items-center">
              <AiOutlineFileSearch size={20} />
              <div className="mx-auto">search</div>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <div className="flex justify-between">
            <div className="flex gap-4 place-items-center">
              <button>
                <Link href="/signup">Sign Up</Link>
              </button>
              <button>
                <Link href="/signin">Log In</Link>
              </button>
            </div>
            <div className="w-1/4 flex gap-4 items-center">
              <div>
                <p className="text-2xl">PROJECT CATALYZERS</p>
                <p className="text-xs">Welcome to Project Catalyzer,</p>
                <p className="text-xs">
                  where we nurture Innovation through collaborative learning.
                </p>
              </div>
              <Image
                src={pcat}
                width={120}
                height={50}
                className="rounded-xl"
              />
            </div>
          </div>
          <div className="p-10 flex justify-between ">
            <p className="text-2xl">Look In to Library</p>
            <div className="bg-[#9f74ac] w-1/4 rounded-xl h-fit p-2 flex items-center">
              <AiOutlineFileSearch size={20} />
              <div className="mx-auto">search</div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
