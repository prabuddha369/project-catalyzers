"use client";
import Image from "next/image";
import Link from "next/link";
import { UserAuth } from "./context/AuthContext";
import pcat from "../public/pcat_logo.png";
import { AiOutlineFileSearch } from "react-icons/ai";
import Projects from "./components/Projects";

import {
  GetProjectData,
  GetAllProjectData,
  GetAllProjectsIdUnderProfile,
} from "./utils/GetData";
import { useState, useEffect } from "react";
export default function Home() {
  const { user, logOut } = UserAuth();
  const handleSignOut = async () => {
    try {
      await logOut();
    } catch (error) {
      console.log(error);
    }
  };

  // const [projects, setProjects] = useState([]);
  // useEffect(() => {
  //   GetAllProjectData();
  // }, []);
  return (
    <main className=" p-10 w-full h-screen bg-gradient-to-b from-[#0c163a] to-[#ea65dd] text-stone-300 ">
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
            <div className="w-[2.5] flex gap-4 items-center">
              <div>
                <p className="text-4xl font-bold text-white pb-4 font-['Krona One'] tracking-[.2rem]">
                  PROJECT
                  <br />
                  CATALYZERS
                </p>
                <p className="text-xs ps-2">
                  Welcome to
                  <br />
                  Project Catalyzer,where we
                  <br />
                  nurture Innovation through collaborative learning.
                </p>
              </div>
              <Image alt="Logo"  src={pcat} width={120}/>
            </div>
          </div>
          <div className="p-10 flex justify-between ">
            <p className="text-2xl">Look In to Library</p>
            <div className="bg-[#9f74ac] w-1/4 rounded-xl h-fit p-2 flex items-center">
              <AiOutlineFileSearch size={20} />
              <input
                type="text"
                className="mx-auto bg-transparent border-none outline-none text-white placeholder-white"
                placeholder="Search"
              />
            </div>
          </div>
        </div>
      ) : (
        <div>
          <div className="flex justify-between">
            <div className="ps-14 flex gap-4 place-items-center">
              <button className="w-36 h-12 bg-fuchsia-400 rounded-xl text-2xl font-bold text-white">
                <Link href="/signup">Sign Up</Link>
              </button>
              <button class="ps-4 text-fuchsia-400 text-2xl font-bold">
                <Link href="/signin">Log In</Link>
              </button>
            </div>
            <div className="w-[2.5] flex gap-4 items-center">
              <div>
                <p className="text-4xl font-bold text-white pb-4 font-['Krona One'] tracking-[.2rem]">
                  PROJECT
                  <br />
                  CATALYZERS
                </p>
                <p className="text-xs ps-2">
                  Welcome to
                  <br />
                  Project Catalyzer,where we
                  <br />
                  nurture Innovation through collaborative learning.
                </p>
              </div>
              <Image src={pcat} width={120} height={50} />
            </div>
          </div>
          <div className="p-10 flex justify-between ">
            <p className="text-2xl">Look In to Library</p>
            <div className="bg-[#9f74ac] w-1/4 rounded-xl h-fit p-2 flex items-center">
              <AiOutlineFileSearch size={20} />
              <input
                type="text"
                className="mx-auto bg-transparent border-none outline-none text-white placeholder-white"
                placeholder="Search"
              />
            </div>
          </div>
        </div>
      )}
      <Projects projects={GetAllProjectData()}></Projects>
    </main>
  );
}
