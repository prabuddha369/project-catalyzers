'use client';
import { useState,useEffect } from "react";
import { FcGoogle } from "react-icons/fc";
import { BsGithub } from "react-icons/bs";
import { UserAuth } from "../context/AuthContext";
import { redirect } from "next/navigation";
import Link from "next/link";
import { UploadUserData, convertEmailToDomain } from "../utils/UpdateData";
let flg = false;
const page = () => {
  const { user, googleSignIn, githubSignIn, signUpWithEmailAndPassword } =
    UserAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userName, setUserName] = useState("");
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
  const handleEmailSignUp = () => {
    try {
      // Sign up the user with email and password
      signUpWithEmailAndPassword(email, password);
      // After successful signup, update the user's profile
      UploadUserData(convertEmailToDomain(email), userName, "https://i.ibb.co/n3j7DWd/Windows-10-Default-Profile-Picture-svg.png");
    } catch (error) {
      if (error == "auth/invalid-login-credentials") {
        console.log("Invalid Creds");
      }
    }
  };

  console.log(userName);
  // console.log(email);
  // console.log(password);

  if (user) {
    if (flg) {
      UploadUserData(convertEmailToDomain(user.email), user.displayName, user.photoURL);
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
      <div className="w-fit px-10 rounded-3xl bg-gradient-to-b from-[#ea64dc] to-[#0b1539] m-auto" style={{ marginTop: marginTopStyle }}>
        <div className="pt-7 pb-3 m-auto w-full  text-center font-bold text-5xl text-white font-space-mono md:text-3xl">
          Sign Up
        </div>
        <div className="pt-5 items-center flex flex-col  m-auto w-full  font-space-mono">
          <div className="pb-2 flex flex-col gap-1">
            <span className="text-2xl">Name</span>
            <input
              className="md:w-[50vh] sm:w-[10vh] h-10 rounded-xl p-3 text-sm bg-[#0b1539] text-stone-200 min-w-[1rem]"
              type="text"
              onChange={(e) => setUserName(e.target.value)}
            />
          </div>
        </div>
        <div className="p-1 items-center flex flex-col  m-auto w-full font-space-mono">
          <div className="pb-2 flex flex-col gap-1">
            <span className="text-2xl">Email</span>
            <input
              className="md:w-[50vh] sm:w-[10vh] h-10 text-sm rounded-xl p-3 bg-[#0b1539] text-stone-200"
              type="email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>
        <div className="p-1 items-center flex flex-col  m-auto w-full  font-space-mono">
          <div className="pb-5 flex flex-col gap-1">
            <span className="text-2xl">Password</span>
            <input
              className="md:w-[50vh] sm:w-[10vh] h-10 rounded-xl bg-[#0b1539] text-stone-200"
              type="password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>
        <div className="w-36 h-[3 rem] m-auto text-center pt-2 text-2xl font-bold bg-[#cc5ac6] rounded-full">
          <span
            className="p-6 text-center cursor-pointer"
            onClick={handleEmailSignUp}
          >
            Create
          </span>
        </div>
        <div className="text-center text-xs pt-6">OR</div>
        <div className="p-1 items-center flex flex-col  m-auto w-full text-2xl font-space-mono">
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
        <div className="p-1 items-center flex flex-col pb-7  m-auto w-full text-md font-space-mono">
          <p className="p-1">
            Alredy a User?{" "}
            <Link href="/signin">
              <span className="text-violet-400">Sign In</span>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default page;
