"use client";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { GoHome, GoHomeFill } from "react-icons/go";
import { IoIosAddCircleOutline, IoIosAddCircle } from "react-icons/io";
import Link from "next/link";
import { UserAuth } from "../context/AuthContext";
import Image from "next/image";
import { GetUserPhotoUrl } from "../utils/GetData";
import { convertEmailToDomain } from "../utils/UpdateData";
const BottomBar = () => {
  const {user} = UserAuth()
  const pathname = usePathname();
  const [dpUrl, setDpUrl] = useState(
    "https://i.ibb.co/n3j7DWd/Windows-10-Default-Profile-Picture-svg.png"
  );
  useEffect(() => {
    if (user) {
      GetUserPhotoUrl(convertEmailToDomain(user.email)).then((url) => {
        setDpUrl(url);
      });
    }
  }, [user]);
  return (
    <div className={(pathname === '/signin' || pathname === '/signup')?`fixed bottom-0 left-0 z-50 w-full h-16 bg-fuchsia-800 rounded-xl text-white lg:hidden font-light hidden`:`fixed bottom-0 left-0 z-50 w-full h-16 bg-fuchsia-800 rounded-xl text-white lg:hidden font-light`}>
      <div className="flex space-between justify-between px-10 py-2">
        <Link href="/">
          {pathname === "/" ? (<GoHomeFill size={40} />) : (<GoHome size={40} />)}
        </Link>

        <Link href='/upload'>
        
        {pathname === "/upload" ? (
          <IoIosAddCircle size={40} />
        ) : (
          <IoIosAddCircleOutline size={40} />
        )}
        </Link>
        <Link
          href={user?`/profile/myprofile`:`/signup`}
          >
          <Image
            src={dpUrl}
            alt="Photo"
            width={40}
            height={40}
            className="rounded-full"
          />
        </Link>
      </div>
    </div>
  );
};

export default BottomBar;
