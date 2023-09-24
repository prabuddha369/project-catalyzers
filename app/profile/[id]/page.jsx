"use client";
import React from 'react'
import { GiHamburgerMenu } from "react-icons/gi";
import { AiFillMail } from "react-icons/ai";
import { BiHomeAlt } from "react-icons/bi";
import Image from "next/image";
import {
    GetAllProjectsIdUnderProfile,
    GetProjectThumbnailurl, GetProjectDescription, GetProjectTittle,
    GetUserName,
    GetUserPhotoUrl
} from "../../utils/GetData.js";
import { convertEmailToDomain } from "../../utils/UpdateData";
import { UserAuth } from "../../context/AuthContext";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Page({ params }) {

    const profileID = params.id;
    const { user } = UserAuth();
    const [ProfileName, setProfileName] = useState("");
    const [project, setProject] = useState("");
    const [profiledpurl, setProfiledpurl] = useState("");
    const [userDp, setUserDp] = useState("");

    useEffect(() => {
        // Fetch project data
        GetAllProjectsIdUnderProfile(profileID)
            .then((name) => {
                setProject(name);
            })
            .catch((error) => {
                // Handle errors if needed
                console.error(error);
            });
    },);

    useEffect(() => {
        // Fetch owner's name asynchronously and update state
        if (user) {
            GetUserName(profileID)
                .then((name) => {
                    setProfileName(name);
                })
                .catch((error) => {
                    // Handle errors if needed
                    console.error(error);
                });
        }
    },);

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
      },);

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

    return (
        <div className="h-full w-full bg-[#0b1539]">
            <div className="flex  justify-between  bg-[#0b1539] sticky top-0 w-full shadow-md shadow-black">
                <div className="text-white flex gap-8 text-xl place-items-center ps-10">
                    <GiHamburgerMenu size={40} />
                    <Image src={profiledpurl} alt="Current User Photo" height={50} width={40} className="rounded-full" />
                    {ProfileName}
                </div>
                <div className="flex justify-between gap-4 text-white p-4 pe-10 place-items-center">
                <Image src={userDp} alt="Current User Photo" height={50} width={40} className="rounded-full" />
                    <AiFillMail size={30} />
                    <Link href="/">
                        <BiHomeAlt size={30} />
                    </Link>
                </div>
            </div>
            <div className="px-20">
         <div className="w-full overflow-hidden h-[50rem] bg-gradient-to-b from-[#ea64dc] to-[#0b1539] rounded-2xl">
            </div>
            </div>
        </div>
    );
}