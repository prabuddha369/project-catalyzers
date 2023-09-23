"use client";

import { GiHamburgerMenu } from "react-icons/gi";
import { AiFillMail } from "react-icons/ai";
import { BiHomeAlt } from "react-icons/bi";
import { GetProjectData, GetUserName } from "@/app/utils/GetData";
import { useEffect, useState } from "react";
import Link from "next/link";
export default function Page({ params }) {
  const [project, setProject] = useState([]);
  const [OwnerName, setOwnerName] = useState("");
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

  console.log(OwnerName);
  console.log(project);
  return (
    <div className="px-20 h-full w-full bg-[#0b1539]">
      <div className="flex justify-between place-items-center">
        <div className=" py-4 text-white flex gap-8 text-xl place-items-center">
          <GiHamburgerMenu size={40} />
          {OwnerName}
        </div>
        <div className="flex justify-between gap-4 text-white p-4 place-items-center">
          <AiFillMail size={30} />
          <Link href="/">
            <BiHomeAlt size={30} />
          </Link>
        </div>
      </div>
      <div className="m-auto w-[100%] h-screen bg-gradient-to-b from-[#ea64dc] to-[#0b1539] rounded-2xl">
        <div className="flex justify-between">
          <div className="w-1/2">
            <div className="flex flex-wrap justify-center items-center">
              <div className="text-5xl text-white font-space-mono font-bold">
                {project[0]?.title}
              </div>
            </div>
            <div className="flex flex-wrap justify-center items-center">
              <div className="text-md text-white font-space-mono font-bold">
                {project[0]?.description}
              </div>
            </div>
          </div>
          <div className="w-1/2"></div>
        </div>
      </div>
    </div>
  );
}
