"use client";
import React from 'react'
import { storage } from "../firebase";
import { GiHamburgerMenu } from "react-icons/gi";
import { GrAddCircle } from "react-icons/gr";
import { RxCross1 } from "react-icons/rx";
import { Oval } from 'react-loader-spinner';
import { AiFillMail } from "react-icons/ai";
import { BiHomeAlt } from "react-icons/bi";
import { ref, uploadBytes } from 'firebase/storage';
import Image from "next/image";
import {
  GetAllProjectsIdUnderProfile,
  GetProjectThumbnailurl, GetProjectDescription, GetProjectTittle,
  GetUserName,
  GetUserPhotoUrl
} from "../utils/GetData.js";
import { convertEmailToDomain, UploadProject, createProjectId } from "../utils/UpdateData";
import { UserAuth } from "../context/AuthContext";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { redirect } from 'next/dist/server/api-utils';

const page = () => {
  const [files, setFiles] = useState([]);
  const [selectedFileImage, setSelectedFileImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const handleImageFileChange = (e) => {
    const files = e.target.files;
    // Update the selectedFiles state when files are chosen
    setSelectedFileImage(files);
  };

  const [projectTitle, setProjectTitle] = useState('');
  const [category, setCategory] = useState('');
  const [objectives, setObjectives] = useState('');
  const [description, setDescription] = useState('');
  const [hashtags, setHashtags] = useState('');
  const [techAndLang, setTechAndLang] = useState('');
  const [demonstrationLink, setDemonstrationLink] = useState('');

  const { user } = UserAuth();
  const [userDp, setUserDp] = useState("");
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

  const handleFileChange = (event) => {
    setFiles(event.target.files);
  };

  const upload = async () => {
    if (!selectedFileImage) {
      alert('Please select a thumbnail file before uploading.');
    }
    else if (!files || files.length === 0) {
      alert('Please select a Project folder before uploading.');
    }
    else if (!projectTitle || category === 'Select Category' || !objectives || !description || !hashtags || !techAndLang || !demonstrationLink) {
      alert('Please fill in all required fields before uploading, and make sure to select a valid category.');
    }
    else {
      const thumbnailurl = await uploadThumbnail();
      await uploadFolder();
      if (thumbnailurl) {
        await UploadProject(convertEmailToDomain(user.email), projectTitle, objectives, description, category, thumbnailurl, hashtags, techAndLang, demonstrationLink);
      }
      
      // Reset all fields to their default values
      setProjectTitle('');
      setCategory('Select Category');
      setObjectives('');
      setDescription('');
      setHashtags('');
      setTechAndLang('');
      setDemonstrationLink('');
      setFiles([]); // Reset files to empty
      setSelectedFileImage(null); // Reset selectedFileImage to null
    }
  };

  const uploadThumbnail = async () => {
    // Prepare the form data for the ImgBB API request
    const formData = new FormData();
    formData.append('key', 'd5e6b6b78006c15dfd8229c34e028917'); // Replace with your ImgBB API key
    formData.append('image', selectedFileImage[0]);

    // Perform the image upload
    try {
      setIsUploading(true);

      const response = await fetch('https://api.imgbb.com/1/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        const thumbnailUrl = data.data.url;
        setIsUploading(false);
        return thumbnailUrl; // Return the URL directly
      } else {
        setIsUploading(false);
        alert('Thumbnail upload failed. Please try again.');
        return null; // Return null or handle the error as you prefer
      }
    } catch (error) {
      setIsUploading(false);
      console.error('Error uploading thumbnail:', error);
      alert('An error occurred while uploading the thumbnail.');
      return null; // Return null or handle the error as you prefer
    }
  };

  const uploadFolder = async () => {
    setIsUploading(true);
    for (const file of files) {
      const { projectId, projectCount } = await createProjectId(convertEmailToDomain(user.email));
      if (projectId) {
        console.log("Hello Look    " + projectId);
        let relativePath = projectId + "/" + file.webkitRelativePath;
        let metadata = {};
        // Change the contentType of .c files to .txt
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
        const task = await uploadBytes(ref(storage, relativePath), file, metadata);
      }
    }

    setIsUploading(false);
    alert('All files uploaded successfully!');
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
            className="hidden"
          />
        </label>
        <div className="text-sm">
          {files.length === 0 ? "No files chosen" : `${files.length} file(s) selected`}
        </div>
        <br /><br /><br />
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
      <div className="flex  justify-between  bg-[#0b1539] sticky top-0 w-full shadow-md shadow-black" style={{ zIndex: 50 }}>
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
          <Link href="/">
            <BiHomeAlt size={30} />
          </Link>
        </div>
      </div>
      <div className="px-20">
        <div className="w-full h-screen bg-gradient-to-b from-[#ea64dc] to-[#0b1539] rounded-2xl mt-10">
          <div className='flex justify-between'>
            <div className='flex flex-wrap gap-2 p-3 w-[70%] text-lg '>
              <div className='flex gap-2 w-full'>
                <div className='flex flex-col'>
                  <div className='flex justify-between gap-4 text-white pb-6 place-items-center'>
                    <div className="ps-5 text-3xl text-white font-space-mono font-bold p-2 pe-10">
                      Add New Project
                    </div>
                  </div>
                  <label for="projectTitle" className='text-white'>Project Title</label>
                  <input type='text'
                    id='projectTitle'
                    className='rounded-lg p-2 w-96 outline-none text-black'
                    value={projectTitle}
                    onChange={(e) => setProjectTitle(e.target.value)} />
                </div>
                <div className='flex flex-col mt-[66px] ms-[5px]'>
                  <span className='text-white'>Category</span>
                  <div className='w-[100%]'><select className='text-black rounded-lg p-2.5 w-full'
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}>
                    <option value="Select Category">Select Category</option>
                    <option value="Web Development">Web Development</option>
                    <option value="AI&ML">AI&ML</option>
                    <option value="App Dev">App Dev</option>
                    <option value="Robotics">Robotics</option>
                    <option value="Design & creative">Design & creative</option>
                    <option value="Entrepreneurship">Entrepreneurship</option>
                  </select>
                  </div>

                </div>

              </div>
              <div className='flex flex-col w-full'>
                <span className='text-white'>Objectives</span>
                <textarea className='h-[80px] rounded-lg p-2 outline-none'
                  style={{ resize: 'none' }}
                  value={objectives}
                  onChange={(e) => setObjectives(e.target.value)} />
              </div>
              <div className='flex flex-col w-full'>
                <span className='text-white'>Description</span>
                <textarea className='rounded-lg p-2 outline-none h-[200px]'
                  style={{ resize: 'none' }}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)} />
              </div>
            </div>
            <div className='flex flex-wrap p-3 w-1/2 pt-6'>
              <div className='flex flex-col'>
                <span className='text-white'>Add Thumbnail</span>
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
                    {selectedFileImage && selectedFileImage[0] ? selectedFileImage[0]?.name : "No file chosen"}
                  </div>
                </div>
              </div>
              <div className='flex flex-col w-full mt-[20px]'>
                <span className='text-white'>Hashtags</span>
                <textarea className='h-[50%] rounded-lg p-2 outline-none'
                  style={{ resize: 'none' }}
                  value={hashtags}
                  onChange={(e) => setHashtags(e.target.value)} />
              </div>
              <div className='flex flex-col w-full'>
                <span className='text-white'>Technology & Language used</span>
                <textarea className='h-[50%] rounded-lg p-2 outline-none'
                  style={{ resize: 'none' }}
                  value={techAndLang}
                  onChange={(e) => setTechAndLang(e.target.value)} />
              </div>
              <div>
                <span className='text-white'>Upload Project Folder</span>
                <FolderUpload />
              </div>
              <div className='flex flex-col w-full'>
                <span className='text-white'>Project Demonstration link</span>
                <textarea className='h-[50%] rounded-lg p-2 outline-none'
                  style={{ resize: 'none' }}
                  value={demonstrationLink}
                  onChange={(e) => setDemonstrationLink(e.target.value)} />
              </div>
              <div className='ms-[30%] mt-[5%] w-fit p-4 rounded-lg bg-black/70 text-white shadow-sm shadow-black hover:scale-105 transform transition duration-150 ease-in cursor-pointer' onClick={upload}>
                <span className='p-4 text-2xl font-bold'>Upload</span>
              </div>
              {isUploading && (
                <div
                  className="absolute h-[120%] inset-0 flex items-center justify-center"
                  style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}
                >
                  <Oval
                    height={80}
                    width={80}
                    color="#4fa94d"
                    ariaLabel='oval-loading'
                    secondaryColor="#4fa94d"
                    strokeWidth={2}
                    strokeWidthSecondary={2}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default page