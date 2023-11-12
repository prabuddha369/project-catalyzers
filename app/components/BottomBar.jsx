"use client";
import { usePathname } from "next/navigation";
import React from "react";
import { GoHome, GoHomeFill } from "react-icons/go";
import { IoIosAddCircleOutline, IoIosAddCircle } from "react-icons/io";
import { BiUserCircle, BiSolidUserCircle } from "react-icons/bi";
const BottomBar = () => {
  const pathname = usePathname();
  return (
    <div class="fixed bottom-0 left-0 z-50 w-full h-16 bg-fuchsia-800 rounded-md text-white">
      <div class="flex space-between justify-between px-10 py-2">
        {pathname === "/" ? <GoHomeFill size={40} /> : <GoHome size={40} />}
        {pathname === "/upload" ? (
          <IoIosAddCircle size={40} />
        ) : (
          <IoIosAddCircleOutline size={40} />
        )}

        {pathname === "/profile/myprofile" ? (
          <BiSolidUserCircle size={40} />
        ) : (
          <BiUserCircle size={40} />
        )}
      </div>
    </div>
  );
};

export default BottomBar;
