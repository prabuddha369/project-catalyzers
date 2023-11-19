"use client";
import { useState, useEffect } from "react";
import { FcGoogle } from "react-icons/fc";
import { BsGithub } from "react-icons/bs";
import {
  UploadUserData,
  convertEmailToDomain,
} from "../utils/UpdateData";
import { UserAuth } from "../context/AuthContext";
import { redirect } from "next/navigation";
import Link from "next/link";
let flg = false;
const page = () => {
  const { user, googleSignIn, githubSignIn, signInWithEmailPassword } =
    UserAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleGoogleSignIn = async () => {
    try {
      await googleSignIn();
      flg = true;
    } catch (error) {
      console.log(error);
    }
  };

  const handleGitSignIn = async () => {
    try {
      await githubSignIn();
      flg = true;
    } catch (error) {
      console.log(error);
    }
  };

  const handleEmailSignIn = async () => {
    try {
      await signInWithEmailPassword(email, password);
    } catch (error) {
      console.log(error);
    }
  };

  console.log(user);
  console.log(email);
  console.log(password);

  if (user) {
    if (flg) {
      UploadUserData(
        convertEmailToDomain(user.email),
        user.displayName,
        user.photoURL
      );
    }
    redirect("/");
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

  const marginTopStyle = windowWidth < 768 ? 100 : undefined;

  return (
    <div className="w-full h-screen py-5 bg-[#0b1539] text-stone-200">
      <div className="w-fit h-fit rounded-3xl bg-gradient-to-b from-[#ea64dc] to-[#0b1539] mx-auto items-center min-w-fit" style={{ marginTop: marginTopStyle }}>
        <div className="pt-8 pb-8 m-auto w-full text-center text-4xl font-bold font-space-mono">
          Welcome Back!
        </div>
        <div className="p-1 items-center flex flex-col  m-auto w-full font-space-mono">
          <div className="flex flex-col gap-1">
            <span className="text-2xl">Email</span>
            <input
              className="w-[19rem] h-10 text-sm rounded-xl p-3 bg-[#0b1539] text-stone-200"
              type="email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>
        <div className="p-5 pb-12 items-center flex flex-col  m-auto w-full text-2xl font-space-mono">
          <div className="flex flex-col gap-1">
            Password
            <input
              className="w-[19rem] h-10 rounded-xl p-3 bg-[#0b1539] text-stone-200"
              type="password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="pt-2 w-[17rem] h-8 text-left text-blue-400 text-base font-normal font-['Krona One']">
            <p className="cursor-pointer">forgot password?</p>
          </div>
        </div>
        <div className="w-36 h-[3 rem] m-auto text-center pt-2 pb-2 text-2xl font-bold bg-[#cc5ac6] rounded-full">
          <span
            className="p-6 text-center cursor-pointer"
            onClick={handleEmailSignIn}
          >
            Log In
          </span>
        </div>
        <div className="pt-4 pb-8 w-[13rem] h-8 m-auto">
          <span className="text-white text-base font-normal font-['Krona One']">
            Need an account?
          </span>
          <span className="text-blue-400 text-base font-normal font-['Krona One'] cursor-pointer">
            <Link href="/signup"> Register</Link>
          </span>
        </div>
        <div className="text-xs text-center p-3">OR</div>
        <div className="p-1 pb-7 items-center flex flex-col m-auto w-full text-2xl font-space-mono">
          <div className="flex gap-6">
            <FcGoogle
              className="cursor-pointer"
              size={35}
              onClick={handleGoogleSignIn}
            />
            <BsGithub
              size={35}
              onClick={handleGitSignIn}
              className="cursor-pointer"
            />
          </div>
        </div>
      </div>
      {windowWidth >= 768?null:<BottomBar dpUrl={"https://i.ibb.co/n3j7DWd/Windows-10-Default-Profile-Picture-svg.png"}/>}
    </div>
  );
};

export default page;
