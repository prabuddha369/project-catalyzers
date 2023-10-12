"use client";
import React from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { RxCross1 } from "react-icons/rx";
import { AiFillMail } from "react-icons/ai";
import { BiHomeAlt } from "react-icons/bi";
import Image from "next/image";
import {
  GetUserName,
  GetUserPhotoUrl,
  GetAllProjectsDataUnderProfile,
  GetFollower,
  GetFollowing,
} from "../../utils/GetData.js";
import { convertEmailToDomain } from "../../utils/UpdateData";
import { UserAuth } from "../../context/AuthContext";
import { useEffect, useState } from "react";
import Link from "next/link";

const page = () => {
  const { user,logOut} = UserAuth();
  const [userDp, setUserDp] = useState("");
  const [UserName, setUserName] = useState("");
  const [Followers, setFollowers] = useState(0);
  const [Following, setFollowing] = useState(0);
  const [project, setProject] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  const handleSignOut = async () => {
    try {
      await logOut();
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    // Fetch owner's name asynchronously and update state
    if (user) {
      GetUserPhotoUrl(convertEmailToDomain(user.email))
        .then((link) => {
          setUserDp(link);
        })
        .catch((error) => {
          // Handle errors if needed
          console.error(error);
        });
    }
  }, [user]);

  useEffect(() => {
    // Fetch owner's name asynchronously and update state
    if (user) {
      GetUserName(convertEmailToDomain(user.email))
        .then((name) => {
          setUserName(name);
        })
        .catch((error) => {
          // Handle errors if needed
          console.error(error);
        });
    }
  }, [user]);

  useEffect(() => {
    // Fetch project data
    if (user) {
      GetAllProjectsDataUnderProfile(convertEmailToDomain(user.email))
        .then((name) => {
          setProject(name);
        })
        .catch((error) => {
          // Handle errors if needed
          console.error(error);
        });
    }
  }, [user]);
  useEffect(() => {
    // Fetch owner's name asynchronously and update state
    if (user) {
      GetFollower(convertEmailToDomain(user.email))
        .then((count) => {
          setFollowers(count);
        })
        .catch((error) => {
          // Handle errors if needed
          console.error(error);
        });
      GetFollowing(convertEmailToDomain(user.email))
        .then((count) => {
          setFollowing(count);
        })
        .catch((error) => {
          // Handle errors if needed
          console.error(error);
        });
    }
  }, [Followers, Following]);
  console.log(project);
  return (
    <div className="h-full w-full bg-[#0b1539]">
      <div className="flex  justify-between py-3 bg-[#0b1539] sticky top-0 w-full shadow-md shadow-black" style={{ zIndex: 50 }}>
        <div className="text-white flex gap-8 text-xl place-items-center ps-10">
          <button onClick={toggleDropdown}>
            {isDropdownOpen ? <RxCross1 size={40} /> : <GiHamburgerMenu size={40} />}
          </button>
          {isDropdownOpen && (
            <div className="absolute w-fit rounded-lg shadow-lg bg-[#D9D9D9] ring-1 ring-black ring-opacity-5 mt-[230px]">
              <div className="py-2 px-4" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                <Link href="../" className="block px-4 py-2 text-black" role="menuitem">
                  Home
                </Link>
                <Link href="../upload" className="block px-4 py-2 text-black" role="menuitem">
                  Add New Project
                </Link>
                <Link href="../">
                <button onClick={handleSignOut} className="block px-4 py-2 text-black" role="menuitem">
                  Sign Out
                </button>
                </Link>
                <Link href="" className="block px-4 py-2 text-black" role="menuitem">
                  About Us
                </Link>
              </div>
            </div>
          )}
          <Image
            src={userDp}
            alt="Current User Photo"
            height={50}
            width={40}
            className="rounded-full"
          />
          <div>
            {UserName}
            <div className="flex gap-1">
              <span className="text-[#4f96ff] px-1">followers </span>
              {Followers}
              <span className="text-[#eb65dd] px-1">following </span>
              {Following}
            </div>
          </div>
        </div>
        <div className="flex justify-between gap-4 text-white p-4 pe-10 place-items-center">
          <AiFillMail size={30} />
          <Link href="/">
            <BiHomeAlt size={30} />
          </Link>
        </div>
      </div>
      <div className="px-20 mt-8">
        <div className="w-full overflow-hidden h-[50rem] bg-gradient-to-b from-[#ea64dc] to-[#0b1539] rounded-2xl pt-5">
          <span className="ms-8 text-3xl font-bold text-white mb-5">
            Your Project Library
          </span>
          <section>
            {project.map((item, index) => {
              const truncatedDescription = item.description.slice(0, 100);
              return (
                <div
                  key={index}
                  className="flex flex-row w-full gap-8 items-center m-auto py-1 px-10 hover:scale-105 transform transition duration-150"
                >
                  <Link href={`/project/${item.owner}_${index}`} className="flex flex-row w-full gap-8 items-center m-auto py-2 px-10 hover:scale-105 transform transition duration-150">
                    <div className="flex justify-between place-items-center w-full bg-white h-auto rounded-xl">
                      <div className="flex flex-col">
                        <span className="ms-5 text-2xl font-bold">
                          {item.title}
                        </span>
                        <div className="mt-2 ms-5 text-xl max-h-20">
                          {truncatedDescription + "..."}
                        </div>
                      </div>
                      <Image
                        className="rounded-xl"
                        src={item.thumbnailurl}
                        alt="project thumbnail"
                        height={200}
                        width={250}
                      />
                    </div>
                  </Link>
                </div>
              );
            })}
          </section>
        </div>
      </div>
    </div>
  );
};

export default page;
