"use client";

import { GiHamburgerMenu } from "react-icons/gi";
import { AiFillMail } from "react-icons/ai";
import { BiHomeAlt } from "react-icons/bi";
import { GetProjectData } from "@/app/utils/GetData";
import { useEffect, useState } from "react";
import Link from "next/link";
export default function Page({ params }) {
  const [project, setProject] = useState([]);
  const projectID = params.id;
  useEffect(() => {
    GetProjectData(projectID).then((data) => {
      setProject([data]);
    });
  }, []);
  console.log(project);
  return (
    <div className="px-20 h-full w-full bg-[#0b1539]">
      <div className="flex justify-between place-items-center">
        <div className=" py-2 text-white flex gap-8 text-xl">
          <GiHamburgerMenu size={40} /> Srinjay Das Gupta
        </div>
        <div className="flex justify-between gap-4 text-white p-4">
          <AiFillMail size={30} />
          <Link href="/">
            <BiHomeAlt size={30} />
          </Link>
        </div>
      </div>
      <div className="m-auto w-[100%] h-screen bg-gradient-to-b from-[#ea64dc] to-[#0b1539] rounded-2xl">
        {project ? (
          <div>
            <div className="flex justify-center items-center">
              <div className="text-5xl text-white font-space-mono font-bold">
                {project[0]?.title}
              </div>
            </div>
            <div className="flex justify-center items-center">
              <div className="text-2xl text-white font-space-mono font-bold">
                {project[0]?.description}
              </div>
            </div>
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}
