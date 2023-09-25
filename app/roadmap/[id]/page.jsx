"use client"
import React, { useEffect, useState } from 'react';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineContent,
  TimelineDot,
  TimelineConnector
} from '@mui/lab';
import {TiCode} from 'react-icons/ti'
import { GiHamburgerMenu } from "react-icons/gi";
import { AiFillMail } from "react-icons/ai";
import { BiHomeAlt } from "react-icons/bi";
import Link from 'next/link';
import {
  GetProjectData,
  GetUserName,
  GetUserPhotoUrl,
} from "../../utils/GetData.js";
import { convertEmailToDomain } from "../../utils/UpdateData";
import { UserAuth } from "../../context/AuthContext";
import Image from 'next/image';
const Page = ({ params }) => {
    const { user } = UserAuth();
  const [project, setProject] = useState([]);
    const [userDp, setUserDp] = useState("");
  const [OwnerName, setOwnerName] = useState("");
  const [ownerdpurl, setOwnerdpurl] = useState("");
  const projectID = params.id;
  let techLang = [];

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

  if (project[0]) {
    techLang = project[0].techlang.split(',');
  }
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
    if (project[0]?.owner) {
      GetUserPhotoUrl(project[0]?.owner)
        .then((link) => {
          setOwnerdpurl(link);
        })
        .catch((error) => {
          // Handle errors if needed
          console.error(error);
        });
    }
  }, [project[0]?.owner]);
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

  console.log(techLang);

  return (
    <div className="h-full w-full bg-[#0b1539]">
        <div className="flex justify-between  bg-[#0b1539] sticky top-0 w-full shadow-md shadow-black">
        <div className="text-white flex gap-8 text-xl place-items-center ps-5">
          <GiHamburgerMenu size={30} />
          <Link
            href={
              user
                ? convertEmailToDomain(user.email) == project[0]?.owner
                  ? `../../profile/myprofile`
                  : `../../profile/${project[0]?.owner}`
                : "/signin"
            }
            className="text-white flex gap-8 text-xl place-items-center"
          >
            <Image
              src={ownerdpurl}
              alt="photo"
              height={50}
              width={50}
              className="rounded-full"
            />
            {OwnerName}
          </Link>
        </div>
        <div className="flex justify-between gap-4 text-white p-4 pe-10 place-items-center">
          <Link href="/profile/myprofile">
            <Image
              src={userDp}
              alt="Current User Photo"
              height={50}
              width={40}
              className="rounded-full"
            />
          </Link>

          <AiFillMail size={30} />
          <Link href="/">
            <BiHomeAlt size={30} />
          </Link>
        </div>
      </div>
    <Timeline position='alternate'>
        <TimelineItem>
          <TimelineSeparator>
            <TimelineDot variant='outline'>
                <TiCode/>
            </TimelineDot>
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent className='place-items-center'>START</TimelineContent>
        </TimelineItem>
      {techLang.map((item, index) => ( // Fixed the order of arguments in map function
        <TimelineItem key={index}>
          <TimelineSeparator>
            <TimelineDot variant='outline'>
                <TiCode/>
            </TimelineDot>
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent className='place-items-center'>{item}</TimelineContent>
        </TimelineItem>
      ))}<TimelineItem>
          <TimelineSeparator>
            <TimelineDot variant='outline'>
                <TiCode/>
            </TimelineDot>
          </TimelineSeparator>
          <TimelineContent className='place-items-center'>END</TimelineContent>
        </TimelineItem>
    </Timeline>
    </div>
  );
};

export default Page;
