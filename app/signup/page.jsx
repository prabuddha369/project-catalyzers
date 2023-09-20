"use client";

import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { BsGithub } from "react-icons/bs";
import { UserAuth } from "../context/AuthContext";
const page = () => {
  const { user, googleSignIn, githubSignIn, signUpWithEmailAndPassword } =
    UserAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userName, setUserName] = useState("");
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
  const handleEmailSignUp = async () => {
    try {
      await signUpWithEmailAndPassword(email, password);
    } catch (error) {
      console.log(error);
    }
  };

  console.log(user);
  console.log(email);
  console.log(password);
  return (
    <div className="w-screen h-screen py-5 bg-[#0b1539] text-stone-200">
      <div className="w-1/4 h-screeen rounded-3xl bg-gradient-to-b from-[#ea64dc] to-[#2d3e7a] mx-auto items-center">
        <div className="p-2 m-auto w-full text-center text-4xl font-space-mono">
          Sign Up
        </div>
        <div className="p-5 items-center flex flex-col  m-auto w-full text-2xl font-space-mono">
          <div className="flex flex-col gap-4">
            Name
            <input
              className="w-full h-10 rounded-xl p-3 bg-[#0b1539] text-stone-200 "
              type="text"
              onChange={(e) => setUserName(e.target.value)}
            />
          </div>
        </div>
        <div className="p-5 items-center flex flex-col  m-auto w-full text-2xl font-space-mono">
          <div className="flex flex-col gap-4">
            Email
            <input
              className="w-full h-10 rounded-xl p-3 bg-[#0b1539] text-stone-200"
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
          <span className="p-4 text-center" onClick={handleEmailSignUp}>
            Create
          </span>
        </div>
        <div className="text-center">OR</div>
        <div className="p-5 items-center flex flex-col  m-auto w-full text-2xl font-space-mono">
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
