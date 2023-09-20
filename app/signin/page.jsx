"use client";
import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { BsGithub } from "react-icons/bs";
import { UserAuth } from "../context/AuthContext";
import { redirect } from "next/navigation";
const page = () => {
  const { user, googleSignIn, githubSignIn, signInWithEmailPassword } =
    UserAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const handleGoogleSignIn = async () => {
    try {
      await googleSignIn();
    } catch (error) {
      console.log(error);
    }
  };
  const handleGitSignIn = async () => {
    try {
      await githubSignIn();
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

  if (user) redirect("/");
  return (
    <div className="w-screen h-screen pt-20 bg-[#0b1539] text-stone-200 m-auto">
      <div className="w-1/4 h-screeen rounded-3xl bg-gradient-to-b from-[#ea64dc] to-[#2d3e7a] m-auto items-center">
        <div className="p-2 m-auto w-full text-center text-4xl font-space-mono">
          Welcome Back!
        </div>
        <div className="p-5 items-center flex flex-col  m-auto w-full font-space-mono">
          <div className="flex flex-col gap-4">
            <span className="text-2xl">Email</span>
            <input
              className="w-[19rem] h-10 text-sm rounded-xl p-3 bg-[#0b1539] text-stone-200"
              type="email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>
        <div className="p-5 items-center flex flex-col  m-auto w-full text-2xl font-space-mono">
          <div className="flex flex-col gap-4">
            Password
            <input
              className="w-full h-10 rounded-xl p-3 bg-[#0b1539] text-stone-200"
              type="password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>
        <div className="text-center m-auto text-2xl bg-[#cc5ac6] w-fit h-9  rounded-full px-2">
          <span
            className="p-4 text-center cursor-pointer"
            onClick={handleEmailSignIn}
          >
            Sign In
          </span>
        </div>
        <div className="text-center p-3">OR</div>
        <div className="p-1 items-center flex flex-col  m-auto w-full text-2xl font-space-mono">
          <div className="flex gap-6">
            <FcGoogle
              className="cursor-pointer"
              size={50}
              onClick={handleGoogleSignIn}
            />
            <BsGithub
              size={50}
              onClick={handleGitSignIn}
              className="cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
