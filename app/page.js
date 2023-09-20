"use client";
import Image from "next/image";
import Link from "next/link";
import { UserAuth } from "./context/AuthContext";
export default function Home() {
  const { user, logOut } = UserAuth();
  const handleSignOut = async () => {
    try {
      await logOut();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <main>
      <div>LANDING</div>
      {user ? (
        <div>
          <p>{`Welcome, ${
            user.displayName ? user.displayName : user.email
          }`}</p>
          <button onClick={handleSignOut}>Sign Out</button>
        </div>
      ) : (
        <div>
          <Link href="/signup">SignUp</Link> or{" "}
          <Link href="/signin">SignIn</Link>
        </div>
      )}
    </main>
  );
}
