"use client";
import React from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { RxCross1 } from "react-icons/rx";
import { AiFillMail } from "react-icons/ai";
import { BiHomeAlt } from "react-icons/bi";
import Image from "next/image";
import {
  GetAllProjectsDataUnderProfile,
  GetUserName,
  GetUserPhotoUrl,
  GetFollower,
  GetFollowing,
  GetFollowingList,
} from "../../utils/GetData.js";
import { convertEmailToDomain, IncrementFollower, IncrementFollowing, DecrementFollower, DecrementFollowing, IncrementFollowingList, DecrementFollowingList } from "../../utils/UpdateData";
import { UserAuth } from "../../context/AuthContext";
import { useEffect, useState } from "react";
import Link from "next/link";
export default function Page({ params }) {
  const profileID = params.id;
  const { user, logOut } = UserAuth();
  const [ProfileName, setProfileName] = useState("");
  const [project, setProject] = useState([]);
  const [profiledpurl, setProfiledpurl] = useState("");
  const [userDp, setUserDp] = useState("");
  const [Followers, setFollowers] = useState(0);
  const [Following, setFollowing] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };


  const [isFollowing, setIsFollowing] = useState(false);

  const handleFollow = () => {
  if (isFollowing) {
    // Unfollow
    setIsFollowing(false);
    DecrementFollowing(convertEmailToDomain(user.email));
    DecrementFollower(profileID)
      .then(() => {
        setFollowers((prevFollowers) => prevFollowers - 1);
      })
      .catch((error) => {
        console.error(error);
      });
    DecrementFollowingList(convertEmailToDomain(user.email), profileID);
  } else {
    // Follow
    setIsFollowing(true);
    IncrementFollowing(convertEmailToDomain(user.email));
    IncrementFollower(profileID)
      .then(() => {
        setFollowers((prevFollowers) => prevFollowers + 1);
      })
      .catch((error) => {
        console.error(error);
      });
    IncrementFollowingList(convertEmailToDomain(user.email), profileID);
  }
};

  useEffect(() => {
    // Function to get the list of users you are following
    const getFollowingList = async () => {
      try {
        const followingList = await GetFollowingList(convertEmailToDomain(user.email));
        const followingListArray = followingList.split(",");
        if (followingListArray.includes(profileID)) {
          setIsFollowing(true);
        }
      } catch (error) {
        console.error(error);
      }
    };

    getFollowingList(); // Call the function on page load
  }, []);

  const handleSignOut = async () => {
    try {
      await logOut();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    // Fetch project data
    GetAllProjectsDataUnderProfile(profileID)
      .then((name) => {
        setProject(name);
      })
      .catch((error) => {
        // Handle errors if needed
        console.error(error);
      });
  }, [project]);

  useEffect(() => {
    // Fetch owner's name asynchronously and update state
    GetUserName(profileID)
      .then((name) => {
        setProfileName(name);
      })
      .catch((error) => {
        // Handle errors if needed
        console.error(error);
      });
  });

  useEffect(() => {
    // Fetch owner's name asynchronously and update state
    GetUserPhotoUrl(profileID)
      .then((link) => {
        setProfiledpurl(link);
      })
      .catch((error) => {
        // Handle errors if needed
        console.error(error);
      });
  });

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
      GetFollower(profileID)
        .then((count) => {
          setFollowers(count);
        })
        .catch((error) => {
          // Handle errors if needed
          console.error(error);
        });
      GetFollowing(profileID)
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
    <div className="h-screen w-full bg-[#0b1539]">
      <div className="flex  justify-between py-3 bg-[#0b1539] sticky top-0 w-full shadow-md shadow-black" style={{ zIndex: 50 }}>
        <div className="text-white flex gap-10 text-xl place-items-center ps-10">
          <button onClick={toggleDropdown}>
            {isDropdownOpen ? <RxCross1 size={40} /> : <GiHamburgerMenu size={40} />}
          </button>
          {isDropdownOpen && (
            <div className="absolute w-fit rounded-lg shadow-lg bg-[#D9D9D9] ring-1 ring-black ring-opacity-5 mt-[270px]">
              <div className="py-2 px-4" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                <Link href="../" className="block px-4 py-2 text-black" role="menuitem">
                  Home
                </Link>
                <Link href="/profile/myprofile" className="block px-4 py-2 text-black" role="menuitem">
                  My Profile
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
            src={profiledpurl}
            alt="Current User Photo"
            height={50}
            width={40}
            className="rounded-full"
          />
          <div className="flex flex-col">
            {ProfileName}
            <div className="flex gap-1">
              <span className="text-[#4f96ff] px-1">followers </span>
              {Followers}
              <span className="text-[#eb65dd] px-1">following </span>
              {Following}
            </div>
          </div>
          <div className="w-fit p-1 bg-lime-500 rounded-full mx-auto" onClick={handleFollow} style={{ cursor: "pointer" }}>
            <span className="px-3">{isFollowing ? "Unfollow" : "Follow"}</span>
          </div>
        </div>
        <div className="flex justify-between gap-4 text-white p-4 pe-10 place-items-center">
          <Link href="/profile/myprofile">
            <Image
              src={userDp}
              alt="Current User Photo"
              height={50}
              width={40}
              className="rounded-full cursor-pointer"
            />
          </Link>
          <Link href="../../message"><AiFillMail size={30} /></Link>
          <Link href="/">
            <BiHomeAlt size={30} />
          </Link>
        </div>
      </div>
      <div className="px-20 pt-8">
        <div className="w-full overflow-hidden h-[75vh] bg-gradient-to-b from-[#ea64dc] to-[#0b1539] rounded-2xl pt-5">
          <span className="ms-8 text-3xl font-bold text-white">
            {ProfileName} Project Library
          </span>
          <div className="h-[60vh] w-fit px-10 overflow-y-auto custom-scrollbar mt-5">
            <style jsx>
              {`
    /* Style for custom scrollbar */
    .custom-scrollbar {
      scrollbar-width: thin;
      scrollbar-color: #d1d1de transparent;
    }

    .custom-scrollbar::-webkit-scrollbar {
      width: 8px;
    }

    .custom-scrollbar::-webkit-scrollbar-thumb {
      background-color: #d1d1de;
      border-radius: 5px;
    }

    .custom-scrollbar::-webkit-scrollbar-track {
      background: transparent;
    }
  `}
            </style>
            {project.map((item, index) => {
              const truncatedDescription = item.description.slice(0, 100);
              return (
                <div
                  key={index}
                  className="flex flex-row w-full items-center m-auto py-1 px-5 hover:scale-105 transform transition duration-150"
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
          </div>
        </div>
      </div>
    </div>
  );
}
