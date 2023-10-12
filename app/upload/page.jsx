"use client";
import React from 'react'
import { storage } from "../firebase";
import { GiHamburgerMenu } from "react-icons/gi";
import { GrAddCircle } from "react-icons/gr";
import { RxCross1 } from "react-icons/rx";
import { AiFillMail } from "react-icons/ai";
import { BiHomeAlt } from "react-icons/bi";
import Image from "next/image";
import {
  GetAllProjectsIdUnderProfile,
  GetProjectThumbnailurl, GetProjectDescription, GetProjectTittle,
  GetUserName,
  GetUserPhotoUrl
} from "../utils/GetData.js";
import { convertEmailToDomain } from "../utils/UpdateData";
import { UserAuth } from "../context/AuthContext";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const page = () => {
  const [selectedFileImage, setSelectedFileImage] = useState(null);
  const handleImageFileChange = (e) => {
    const files = e.target.files;
    // Update the selectedFiles state when files are chosen
    setSelectedFileImage(files);
  };
  const { user } = UserAuth();
  const [userDp, setUserDp] = useState("");
  const [progress, setProgress] = useState(0);
  const folderInputRef = useRef(null);
  const progressBarRef = useRef(null);
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

  const uploadFolder = async () => {
    const folderInput = folderInputRef.current;
    const files = folderInput.files;

    progressBarRef.current.style.display = 'block';

    const totalFiles = files.length;
    let uploadedFiles = 0;

    for (const file of files) {
      let relativePath = 'userEmailId_1/' + file.webkitRelativePath;

      // Handle file extensions and metadata
      let metadata = {};
      if (file.name.endsWith('.c')) {
        relativePath = relativePath.replace(/\.c$/, '.txt');
        metadata = {
          customMetadata: {
            'extension': '.c',
          }
        };
      }
      else if (file.name.endsWith('.js')) {
        relativePath = relativePath.replace(/\.js$/, '.txt');
        metadata = {
          customMetadata: {
            'extension': '.js',
          }
        };
      }
      else if (file.name.endsWith('.java')) {
        relativePath = relativePath.replace(/\.java$/, '.txt');
        metadata = {
          customMetadata: {
            'extension': '.java',
          }
        };
      }
      else if (file.name.endsWith('.cpp')) {
        relativePath = relativePath.replace(/\.cpp$/, '.txt');
        metadata = {
          customMetadata: {
            'extension': '.cpp',
          }
        };
      }
      else if (file.name.endsWith('.py')) {
        relativePath = relativePath.replace(/\.py$/, '.txt');
        metadata = {
          customMetadata: {
            'extension': '.py',
          }
        };
      }
      else if (file.name.endsWith('.css')) {
        relativePath = relativePath.replace(/\.css$/, '.txt');
        metadata = {
          customMetadata: {
            'extension': '.css',
          }
        };
      }
      else if (file.name.endsWith('.html')) {
        relativePath = relativePath.replace(/\.html$/, '.txt');
        metadata = {
          customMetadata: {
            'extension': '.html',
          }
        };
      }
      try {
        const task = await uploadBytes(
          ref(storage, relativePath),
          file,
          metadata
        );

        task.on('state_changed', (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgress(progress);
        });

        await task;

        uploadedFiles++;
      } catch (error) {
        console.error('Failed to upload file:', file.name, error);
      }
    }

    if (uploadedFiles === totalFiles) {
      alert('All files uploaded successfully!');
    }
  };

  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleFileChange = (e) => {
    const files = e.target.files;
    // Update the selectedFiles state when files are chosen
    setSelectedFiles(files);
  };

  const FolderUpload = () => {
    return (
      <div className='flex gap-4 place-items-center'>
        <label className="flex gap-2 place-items-center bg-white text-black font-semibold py-2 px-4 rounded-lg cursor-pointer relative">
          <GrAddCircle size={30} />
          Choose Project Folder
          <input
            type="file"
            directory=""
            webkitdirectory=""
            multiple
            onChange={handleFileChange}
            ref={folderInputRef}
            className="hidden"
          />
        </label>
        <div className="text-sm">
          {selectedFiles.length === 0 ? "No files chosen" : `${selectedFiles.length} file(s) selected`}
        </div>
        <br /><br /><br />
        <progress
          id="progressBar"
          style={{ display: 'none' }}
          ref={progressBarRef}
          value={progress}
          max="100"
        ></progress>
      </div>
    );
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
          setOwnerName(name);
        })
        .catch((error) => {
          // Handle errors if needed
          console.error(error);
        });
    }
  },);

  return (
    <div className="h-full w-full bg-[#0b1539]">
      <div className="flex  justify-between  bg-[#0b1539] sticky top-0 w-full shadow-md shadow-black">
        <div className="text-white flex gap-8 text-xl place-items-center ps-10">
          <button onClick={toggleDropdown}>
            {isDropdownOpen ? <RxCross1 size={40} /> : <GiHamburgerMenu size={40} />}
          </button>
          {isDropdownOpen && (
            <div className="absolute w-fit rounded-lg shadow-lg bg-[#D9D9D9] ring-1 ring-black ring-opacity-5 mt-[270px]">
              <div className="py-2 px-4" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                <Link href="/profile/myprofile" className="block px-4 py-2 text-black" role="menuitem">
                  My Profile
                </Link>
                <Link href="../" className="block px-4 py-2 text-black" role="menuitem">
                  Home
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
          <h1>Upload Project</h1>
        </div>
        <div className="flex justify-between gap-4 text-white p-4 pe-10 place-items-center">
          <Link href="../profile/myprofile">
            <Image src={userDp} alt="Current User Photo" height={40} width={40} className="rounded-full" />
          </Link>
          <AiFillMail size={30} />
          <Link href="/">
            <BiHomeAlt size={30} />
          </Link>
        </div>
      </div>
      <div className="px-20">
        <div className="w-full overflow-hidden h-screen bg-gradient-to-b from-[#ea64dc] to-[#0b1539] rounded-2xl mt-10">
          <div className='flex justify-between gap-4 text-white p-4 pe-10 place-items-center'>
            <div className="ps-5 text-3xl text-white font-space-mono font-bold p-2 pe-10">
              Add New Project
            </div>
            <div className='w-fit p-4 rounded-lg bg-black/70 text-white shadow-sm shadow-black hover:scale-105 transform transition duration-150 ease-in cursor-pointer'>
              <span className='p-4 text-2xl font-bold' onClick={uploadFolder}>Upload</span>
            </div>
          </div>
          <div className='flex justify-between'>
            <div className='flex flex-wrap gap-2 p-3 w-[50%] text-white text-lg '>
              <div className='flex gap-2 w-full'>
                <div className='flex flex-col'>
                  <label for="projectTitle">Project Title</label>
                  <input type='text' id='projectTitle' className='rounded-lg p-2 w-96 outline-none text-black' />
                </div>
                <div className='flex flex-col'>
                  <span>Category</span>
                  <div className='w-88'><select className='text-black rounded-lg p-2 w-full'>
                    <option value="volvo">Select Category</option>
                    <option value="volvo">Volvo</option>
                    <option value="saab">Saab</option>
                    <option value="mercedes">Mercedes</option>
                    <option value="audi">Audi</option>
                  </select>
                  </div>

                </div>

              </div>
              <div className='flex flex-col w-full'>
                <span>Objectives</span>
                <textarea className='h-auto rounded-lg p-2 outline-none' />
              </div>
              <div className='flex flex-col w-full'>
                <span>Description</span>
                <textarea className='rounded-lg p-2 outline-none' />
              </div>
            </div>
            <div className='flex flex-wrap p-3 w-1/2'>
              <div className='flex flex-col'>
                <span>Add Thumbnail</span>
                <div className='flex gap-4 place-items-center'>
                  <label className="flex gap-2 place-items-center bg-white text-black font-semibold py-2 px-4 rounded-lg cursor-pointer relative">
                    <GrAddCircle size={30} />
                    Choose Image File
                    <input
                      type='file'
                      accept="image/*"
                      className='hidden'
                      onChange={handleImageFileChange}
                    />
                  </label>
                  <div className="relative text-center text-sm">
                    {selectedFileImage ? selectedFileImage[0].name : "No file chosen"}
                  </div>
                </div>
              </div>
              <div className='flex flex-col w-full'>
                <span>Objectives</span>
                <textarea className='h-auto rounded-lg p-2 outline-none' />
              </div>
            </div>
          </div>
          <div>
            <FolderUpload />
          </div>
        </div>
      </div>
    </div>
  )
}

export default page