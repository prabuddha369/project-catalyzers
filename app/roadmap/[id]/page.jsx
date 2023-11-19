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
import { TiCode } from 'react-icons/ti'
import { GiHamburgerMenu, GiFinishLine } from "react-icons/gi";
import { AiFillMail } from "react-icons/ai";
import { RxCross1 } from "react-icons/rx";
import { BiHomeAlt } from "react-icons/bi";
import { DiJavascript, DiPython, DiJava, DiNodejsSmall, DiHtml5 } from 'react-icons/di';
import { BiLogoTailwindCss } from 'react-icons/bi';
import { SiNextdotjs } from 'react-icons/si'
import { SiAndroidstudio, SiKotlin } from 'react-icons/si';
import { FaFontAwesomeFlag } from 'react-icons/fa'
import { TbFileTypeXml, TbApi } from 'react-icons/tb'
import Link from 'next/link';
import {
  GetProjectData,
  GetUserPhotoUrl,
} from "../../utils/GetData.js";
import { convertEmailToDomain } from "../../utils/UpdateData";
import { UserAuth } from "../../context/AuthContext";
import Image from 'next/image';
const Page = ({ params }) => {
  const { user } = UserAuth();
  const [project, setProject] = useState([]);
  const [userDp, setUserDp] = useState("");
  const projectID = params.id;
  let techLang = [];
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

  function getIconForTech(item) {
    switch (item.trim().toLowerCase()) {
      case 'javascript':
        return <DiJavascript size={40} style={{ color: '#f0fa2d' }} />;
      case 'python':
        return <DiPython size={40} />;
      case 'java':
        return <DiJava size={40} style={{ color: '#040d78' }} />;
      case 'node.js':
        return <DiNodejsSmall size={40} style={{ color: 'lime' }} />;
      case 'next.js':
        return <SiNextdotjs size={40} />;
      case 'tailwind css':
        return <BiLogoTailwindCss size={40} style={{ color: 'aqua' }} />;
      case 'android studio':
        return <SiAndroidstudio size={40} style={{ color: 'lime' }} />;
      case 'html':
        return <DiHtml5 size={40} style={{ color: '#fa642d' }} />;
      case 'kotlin':
        return <SiKotlin size={30} style={{ color: "#f29446" }} />;
      case 'xml':
        return <TbFileTypeXml size={30} style={{ color: "#f29446" }} />;
      case 'api':
        return <TbApi size={40} />
      default:
        // You can return a default icon for unknown values or handle it differently
        return <TiCode size={40} />;
    }
  }

  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);


  return (
    <div className="h-full w-full bg-[#0b1539]">
      <div className="flex justify-between  bg-[#0b1539] sticky top-0 w-full shadow-md shadow-black" style={{ zIndex: 50 }}>
        <div className="text-white flex gap-8 text-xl place-items-center ps-5">
          <button onClick={toggleDropdown}>
            {isDropdownOpen ? <RxCross1 size={30} /> : <GiHamburgerMenu size={30} />}
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
                <Link href="/upload" className="block px-4 py-2 text-black" role="menuitem">
                  Add New Project
                </Link>
                <button onClick={handleSignOut} className="block px-4 py-2 text-black" role="menuitem">
                  Sign Out
                </button>
                <Link href="" className="block px-4 py-2 text-black" role="menuitem">
                  About Us
                </Link>
              </div>
            </div>
          )}
          Road Map
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

          <Link href="../../message"><AiFillMail size={30} /></Link>
          <Link href="/">
            <BiHomeAlt size={30} />
          </Link>
        </div>
      </div>
      <div className='px-20'>
        <div className="w-full overflow-hidden h-wrap bg-gradient-to-b from-[#ea64dc] to-[#0b1539] rounded-2xl mt-10 pt-10">
          <Timeline position='alternate' className='text-white'>
            <TimelineItem>
              <TimelineSeparator sx={{ height: '100px' }}>
                <TimelineDot variant='outline' >
                  <FaFontAwesomeFlag size={30} />
                </TimelineDot>
                <TimelineConnector />
              </TimelineSeparator>
              <TimelineContent className='justify-start mt-4 text-xl font-bold'>START</TimelineContent>
            </TimelineItem>
            {techLang.map((item, index) => ( // Fixed the order of arguments in map function
              <TimelineItem key={index}>
                <TimelineSeparator sx={{ height: '100px' }}>
                  <TimelineDot variant='outline'>
                    {getIconForTech(item)}
                  </TimelineDot>
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent className='justify-start mt-5 text-xl font-bold'>{item}</TimelineContent>
              </TimelineItem>
            ))}<TimelineItem>
              <TimelineSeparator sx={{ height: '100px' }}>
                <TimelineDot variant='outline'>
                  <GiFinishLine size={30} />
                </TimelineDot>
              </TimelineSeparator>
              <TimelineContent className='justify-start mt-5 text-xl font-bold'>FINISH</TimelineContent>
            </TimelineItem>
          </Timeline>
        </div>
      </div>
      {windowWidth >= 768?null:<BottomBar dpUrl={userDp}/>}
    </div>
  );
};

export default Page;
