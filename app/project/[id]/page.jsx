"use client";

import { GiHamburgerMenu } from "react-icons/gi";
import { AiFillMail } from "react-icons/ai";
import { BiHomeAlt } from "react-icons/bi";
import {
  GetProjectData,
  GetUserName,
  convertYouTubeURLToEmbed,
} from "@/app/utils/GetData";
import { useEffect, useState } from "react";
import Link from "next/link";
export default function Page({ params }) {
  const [project, setProject] = useState([]);
  const [OwnerName, setOwnerName] = useState("");
  const [url, setUrl] = useState("");
  const projectID = params.id;
  useEffect(() => {
    // Fetch project data
    GetProjectData(projectID)
      .then((data) => {
        setProject([data]);
      })
      .catch((error) => {
        // Handle errors if needed
        console.error(error);
      });
  }, [projectID]);

  useEffect(() => {
    // Fetch owner's name asynchronously and update state
    if (project[0]?.owner) {
      GetUserName(project[0]?.owner)
        .then((name) => {
          setOwnerName(name);
        })
        .catch((error) => {
          // Handle errors if needed
          console.error(error);
        });
    }
  }, [project]);
  useEffect(() => {
    // Fetch owner's name asynchronously and update state
    if (project[0]?.yturl) {
      convertYouTubeURLToEmbed(project[0]?.yturl)
        .then((link) => {
          setUrl(link);
        })
        .catch((error) => {
          // Handle errors if needed
          console.error(error);
        });
    }
  }, [url]);
  console.log(project[0]?.yturl);
  console.log(OwnerName);
  console.log(project);

  return (
    <div className="h-full w-full bg-[#0b1539]">
      <div className="flex  justify-between  bg-[#0b1539] sticky top-0 w-full shadow-md shadow-black">
        <div className="text-white flex gap-8 text-xl place-items-center ps-10">
          <GiHamburgerMenu size={40} />
          {OwnerName}
        </div>
        <div className="flex justify-between gap-4 text-white p-4 pe-10">
          <AiFillMail size={30} />
          <Link href="/">
            <BiHomeAlt size={30} />
          </Link>
        </div>
      </div>
      <div className="px-20">
        <div className="w-full overflow-hidden h-screen bg-gradient-to-b from-[#ea64dc] to-[#0b1539] rounded-2xl">
          <div className="flex justify-between gap-1">
            <div className="w-1/2">
              <div className="flex flex-wrap items-center gap-2 pt-10 pb-10">
                <div className="ps-5 text-3xl text-white font-space-mono font-bold p-2">
                  {project[0]?.title}
                </div>
                <div className="w-1/3 px-4 rounded-full bg-[#9e4495] text-center">
                  {project[0]?.category}
                </div>
              </div>

              <div className="px-10 flex flex-wrap justify-center items-center">
                <div className="text-white font-space-mono font-bold">
                  <div className="text-white font-space-mono font-bold">
                    <div className="overflow-y-auto max-h-[350px]">
                      <style>
                        {`
                        .overflow-y-auto::-webkit-scrollbar {
                           width: 0;
                                                      }
                      `}
                      </style>
                      <p className="text-3xl">Objectives</p>
                      <p className="py-2 font-normal">
                        {project[0]?.objective}
                      </p>
                      <p className="text-3xl">Description</p>
                      <p className="py-2 font-normal">
                        {project[0]?.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <iframe
              className="pt-10 p-4 h-[310px] w-1/2 rounded-2xl"
              src={`https://www.youtube.com/embed/${project[0]?.yturl.substring(
                17
              )}`}
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
}
