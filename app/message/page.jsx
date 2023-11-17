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
	getMessagedUsers,
} from "../utils/GetData.js";
import { convertEmailToDomain } from "../utils/UpdateData";
import { UserAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import Link from "next/link";

const Message = () => {
	const { user, logOut } = UserAuth();
	const [userDp, setUserDp] = useState("");
	const [UserName, setUserName] = useState("");
	const [messagedUsers, setMessagedUsers] = useState([]);
	const [messagedUserDps, setMessagedUsersDps] = useState([]);
	const [messagedUserNames, setMessagedUsersNames] = useState([]);
	const [currentMessagingUser, setcurrentMessagingUser] = useState("");
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

			getMessagedUsers(convertEmailToDomain(user.email))
				.then((usersArray) => {
					setMessagedUsers(usersArray);
				})
				.catch((error) => {
					console.error('Error getting message users: ' + error);
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
		}
	}, [user]);

	useEffect(() => {
		// Fetch owner's name asynchronously and update state
		if (user) {
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
	}, [Followers, Following]);

	return (
		<div className="h-full w-full bg-[#0b1539]">
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
					<div className="px-8 mb-5 text-3xl font-bold text-white">
						Messages
						<div className="w-full h-[70vh] bg-white rounded-3xl flex flex-row overflow-hidden">
							<div className="w-1/3 h-full flex flex-col text-sm bg-[#0b1539] rounded-s-3xl">
								<input className="ms-8 px-2 mt-6 w-[35vh] text-black rounded-full" type="text" placeholder="Search Users...." />
								<div className="h-[85%] text-white w-full p-5">
									<ul>
										{messagedUsers.map((user, index) => (
											<li key={index}>{user}</li>
										))}
									</ul>
								</div>
							</div>
							<div class="flex flex-col  bg-[#D9D9D9] relative w-full rounded-e-3xl">
								<div className="h-[10%] w-full bg-[#0b1539]">
								</div>
								<div className="mt-3 ms-10 w-[90%] h-[75%] border border-black rounded-xl">
								</div>
								<div className="ms-10 absolute bottom-3 w-fit text-center border border-black text-lg rounded-full">
									<input type="text" placeholder="Type your message...." className="rounded-full text-black px-5 w-[93vh]" />
									<button className="w-fit h-fit px-5 bg-black text-white rounded-full">
										Send
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default Message;