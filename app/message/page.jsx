"use client";
import { GiHamburgerMenu } from "react-icons/gi";
import { Oval } from 'react-loader-spinner';
import { RxCross1 } from "react-icons/rx";
import { BiHomeAlt } from "react-icons/bi";
import Image from "next/image";
import {
	GetUserName,
	GetUserPhotoUrl,
	GetFollower,
	GetFollowing,
} from "../utils/GetData.js";
import { convertEmailToDomain } from "../utils/UpdateData";
import { UserAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import Link from "next/link";
import Chat from "../components/chat.jsx";
import BottomBar from "../components/BottomBar.jsx";

const Message = () => {
	const { user, logOut } = UserAuth();
	const [userDp, setUserDp] = useState("");
	const [UserName, setUserName] = useState("");
	const [Followers, setFollowers] = useState(0);
	const [Following, setFollowing] = useState(0);
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
		if (user) {
			GetUserPhotoUrl(convertEmailToDomain(user.email))
				.then((link) => {
					setUserDp(link);
				})
				.catch((error) => {
					// Handle errors if needed
					console.error(error);
				});

			GetUserName(convertEmailToDomain(user.email))
				.then((name) => {
					setUserName(name);
					setIsUsernameLoaded(true);
				})
				.catch((error) => {
					// Handle errors if needed
					console.error(error);
				});


			GetFollower(convertEmailToDomain(user.email))
				.then((count) => {
					setFollowers(count);
				})
				.catch((error) => {
					// Handle errors if needed
					console.error(error);
				});
			GetFollowing(convertEmailToDomain(user.email))
				.then((count) => {
					setFollowing(count);
				})
				.catch((error) => {
					// Handle errors if needed
					console.error(error);
				});
		}
	}, [user]);


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
		(windowWidth >= 768 ?
			<div className="h-full w-full bg-[#0b1539]">
				<style>
					{`
			  .message-container {
				padding: 10px;
				margin-bottom: 10px;
				border: 1px solid #ccc;
				border-radius: 5px;
			  }
			
			  .sender-message {
				display: flex;
				justify-content: flex-end;
				background-color: #4caf50;
				color: white;
			  }					
			
			  .receiver-message {
				background-color: #f1f1f1;
				color: black; 
				float: left;
			  }
			  `}
				</style>
				<div className="flex  justify-between bg-[#0b1539] sticky top-0 w-full h-[12vh] shadow-md shadow-black" style={{ zIndex: 50 }}>
					<div className="text-white flex gap-8 text-xl place-items-center ps-10">
						<button onClick={toggleDropdown}>
							{isDropdownOpen ? <RxCross1 size={40} /> : <GiHamburgerMenu size={40} />}
						</button>
						{isDropdownOpen && (
							<div className="absolute w-fit rounded-lg shadow-lg bg-[#D9D9D9] ring-1 ring-black ring-opacity-5 mt-[260px]">
								<div className="py-2 px-4" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
									<Link href="../" className="block px-4 py-2 text-black" role="menuitem">
										Home
									</Link>
									<Link href="/profile/myprofile" className="block px-4 py-2 text-black" role="menuitem">
										My Profile
									</Link>
									<Link href="../upload" className="block px-4 py-2 text-black" role="menuitem">
										Add New Project
									</Link>
									<Link href="../">
										<button onClick={handleSignOut} className="block px-4 py-2 text-black" role="menuitem">
											Sign Out
										</button>
									</Link>
									<Link href="" className="block px-4 py-2 text-black" role="menuitem">
										About Us
									</Link>
								</div>
							</div>
						)}
						<Image
							src={userDp}
							alt="Current User Photo"
							height={50}
							width={40}
							className="rounded-full"
						/>
						<div>
							{UserName}
							<div className="flex gap-1">
								<span className="text-[#4f96ff] px-1">followers </span>
								{Followers}
								<span className="text-[#eb65dd] px-1">following </span>
								{Following}
							</div>
						</div>
					</div>
					<div className="flex justify-between gap-4 text-white p-4 pe-10 place-items-center">
						<Link href="/">
							<BiHomeAlt size={30} />
						</Link>
					</div>
				</div>
				<div className="px-20 mt-3">
					<div className="w-full h-[86vh] overflow-hidden  bg-[#ea64dc] rounded-2xl pt-5">
						<div className="px-8">
							<div className="mb-3 text-3xl font-bold text-white">Messages</div>
							<Chat user={user} />
						</div>
					</div>
				</div>
			</div>
			:
			<div className="h-full w-full bg-[#0b1539]">
				<style>
					{`
			  .message-container {
				padding: 10px;
				margin-bottom: 10px;
				border: 1px solid #ccc;
				border-radius: 5px;
			  }
			
			  .sender-message {
				background-color: #4caf50; /* Green background color */
				color: white; 
				float: right; 
			  }
			
			  .receiver-message {
				background-color: #f1f1f1; /* Light grey background color */
				color: black; 
				float: left;
			  }
			  `}
				</style>
				<div className="w-full h-screen overflow-hidden  bg-[#ea64dc] pt-5">
					<div className="px-8">
						<div className="text-3xl font-bold text-white pb-5">Messages</div>
						<Chat user={user} />
					</div>
				</div>
				<BottomBar dpUrl={userDp}/>
			</div>
		)
	)
}

export default Message;