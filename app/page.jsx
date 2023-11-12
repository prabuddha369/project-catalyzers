"use client";
import Image from "next/image";
import Link from "next/link";
import { UserAuth } from "./context/AuthContext";
import pcat from "../public/pcat_logo.png";
import { RxCross1 } from "react-icons/rx";
import { GiHamburgerMenu } from "react-icons/gi";
import { AiOutlineFileSearch } from "react-icons/ai";
import dynamic from "next/dynamic";
import { GetUserPhotoUrl, GetUserName } from "./utils/GetData";
import { convertEmailToDomain } from "./utils/UpdateData";
import { GetAllProjectData } from "./utils/GetData";
import { useState, useEffect } from "react";

const Projects = dynamic(() => import("./components/Projects"));
export default function Home() {
  const { user, logOut } = UserAuth();
  const handleSignOut = async () => {
    try {
      await logOut();
    } catch (error) {
      console.log(error);
    }
  };

  const [userName, setUserName] = useState("<Anonymous>");
  const [dpUrl, setDpUrl] = useState(
    "https://i.ibb.co/n3j7DWd/Windows-10-Default-Profile-Picture-svg.png"
  );

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [projects, setProjects] = useState([]);
  useEffect(() => {
    GetAllProjectData().then((data) => {
      setProjects([...data]);
    });
  }, []);

  const [searchInput, setSearchInput] = useState(""); // State for search input

  useEffect(() => {
    GetAllProjectData().then((data) => {
      setProjects([...data]);
    });
  }, []);

  // Filter projects based on the search input
  const filteredProjects = projects.filter((project) => {
    // If the search input is empty, don't filter
    if (searchInput.trim() === "") {
      return true;
    }

    const searchTerm = searchInput.toLowerCase();

    // Check if the title, hashtags, category, or tech language contains the search term
    return (
      project.title.toLowerCase().includes(searchTerm) ||
      project.Hastags.toLowerCase().includes(searchTerm) ||
      project.Category.toLowerCase().includes(searchTerm) ||
      project.TechLang.toLowerCase().includes(searchTerm)
    );
  });

  useEffect(() => {
    if (user) {
      GetUserName(convertEmailToDomain(user.email)).then((name) => {
        setUserName(name);
      });
      GetUserPhotoUrl(convertEmailToDomain(user.email)).then((url) => {
        setDpUrl(url);
      });
    }
  }, [user]);
  console.log(user);
  console.log(projects);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <main>
      <div className=" p-10 w-full h-full bg-gradient-to-b from-[#0c163a] to-[#ea65dd] text-stone-300 ">
        {user ? (
          <div>
            <div className="flex justify-between">
              <div className="flex gap-4 pb-[6%]">
                <button onClick={toggleDropdown}>
                  {isDropdownOpen ? (
                    <RxCross1 size={30} />
                  ) : (
                    <GiHamburgerMenu size={30} />
                  )}
                </button>
                {isDropdownOpen && (
                  <div className="absolute w-[200px] rounded-lg shadow-lg bg-[#D9D9D9] ring-1 ring-black ring-opacity-5 mt-[60px] ms-[35px] ">
                    <div
                      className="py-2 px-4"
                      role="menu"
                      aria-orientation="vertical"
                      aria-labelledby="options-menu"
                    >
                      <Link
                        href="/profile/myprofile"
                        className="block px-4 py-2 text-black"
                        role="menuitem"
                      >
                        My Profile
                      </Link>
                      <Link
                        href="/upload"
                        className="block px-4 py-2 text-black"
                        role="menuitem"
                      >
                        Add New Project
                      </Link>
                      <Link
                        href="/message"
                        className="block px-4 py-2 text-black"
                        role="menuitem"
                      >
                        Messages
                      </Link>
                      <button
                        onClick={handleSignOut}
                        className="block px-4 py-2 text-black"
                        role="menuitem"
                      >
                        Sign Out
                      </button>
                      <Link
                        href=""
                        className="block px-4 py-2 text-black"
                        role="menuitem"
                      >
                        About Us
                      </Link>
                    </div>
                  </div>
                )}
                <Link
                  href="/profile/myprofile"
                  className="flex gap-4 place-items-center"
                >
                  <Image
                    src={dpUrl}
                    alt="Photo"
                    width={50}
                    height={50}
                    className="rounded-full"
                  />
                  <p>{userName}</p>
                </Link>
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
                <Image
                  alt="Logo"
                  src={pcat}
                  width={120}
                  onClick={() => window.location.reload()}
                  style={{ cursor: "pointer" }}
                />
              </div>
            </div>
            <div className="p-10 flex justify-between ">
              <p className="text-2xl">Look In to Library</p>
              <div className="bg-[#9f74ac] w-1/4 rounded-xl h-fit p-2 flex items-center">
                <AiOutlineFileSearch size={20} />
                <input
                  type="text"
                  className="mx-auto bg-transparent border-none outline-none text-white placeholder-white"
                  placeholder="Search Projects"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                />
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-4 py-2 pb-4">
              <div className="rounded-full overflow-clip w-fit">
                <Image
                  alt="logo"
                  src={pcat}
                  onClick={() => window.location.reload()}
                  style={{ cursor: "pointer" }}
                  width={60}
                  height={50}
                  blurDataURL="URL"
                  className=""
                />
              </div>
              <span className="text-2xl uppercase">Project Catalyzer</span>
            </div>
            <span className="text-2xl p-2 mb-8">Look into Library</span>
            <div className="bg-[#9f74ac] w-full rounded-3xl h-fit p-2 flex items-center justify-between mt-2">
              <AiOutlineFileSearch size={20} />
              <input
                type="text"
                className="mx-auto bg-transparent border-none outline-none text-white placeholder-white text-center"
                placeholder="Search Projects"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </div>
          </div>
        )}
        <div className="w-full h-fit overflow-y-auto p-5 custom-scrollbar">
          <style jsx>
            {`
              /* Style for custom scrollbar */
              .custom-scrollbar {
                scrollbar-width: thin;
                scrollbar-color: gray transparent;
              }

              .custom-scrollbar::-webkit-scrollbar {
                width: 8px;
              }

              .custom-scrollbar::-webkit-scrollbar-thumb {
                background-color: gray;
                border-radius: 5px;
              }

              .custom-scrollbar::-webkit-scrollbar-track {
                background: transparent;
              }
            `}
          </style>
          <Projects projects={filteredProjects} />
        </div>
      </div>
    </main>
  );
}
