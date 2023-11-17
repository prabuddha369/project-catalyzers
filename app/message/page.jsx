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
	getAllMessages,
} from "../utils/GetData.js";
import { convertEmailToDomain, addMessage } from "../utils/UpdateData";
import { UserAuth } from "../context/AuthContext";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";

const Message = () => {
	const { user, logOut } = UserAuth();
	const [userDp, setUserDp] = useState("");
	const [UserName, setUserName] = useState("");
	const [messagedUsers, setMessagedUsers] = useState([]);
	const [messagedUserDps, setMessagedUsersDps] = useState([]);
	const [currentMessagingUserDp, setcurrentMessagingUserDp] = useState("");
	const [currentMessagingUser, setcurrentMessagingUser] = useState("");
	const [currentMessages, setcurrentMessages] = useState([]);
	const [Followers, setFollowers] = useState(0);
	const [Following, setFollowing] = useState(0);
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const [isCurrentUserClicked, setisCurrentUserClicked] = useState(false);
	const [isSendClicked, setisSendClicked] = useState(false);


	const messageInputRef = useRef(null);


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

	useEffect(() => {
		Promise.all(
			messagedUsers.map((user) =>
				GetUserPhotoUrl(user).then((link) => ({
					user,
					photoUrl: link,
				}))
			)
		)
			.then((photos) => {
				const dps = photos.map((photo) => photo.photoUrl);
				setMessagedUsersDps(dps);
			})
			.catch((error) => {
				console.error('Error getting user photos: ' + error);
			});
	}, [messagedUsers]);

	useEffect(() => {
		if (user) {
			getAllMessages(convertEmailToDomain(user.email), currentMessagingUser)
				.then((messages) => {
					setcurrentMessages(messages);
					setisSendClicked(false);
				})
				.catch((error) => {
					console.error('Error getting all messages: ' + error);
				});
		}
	}, [isSendClicked,isCurrentUserClicked]);

	const sendMessage = () => {
		const inputValue = messageInputRef.current.value;

		if (inputValue !== "") {
			addMessage(convertEmailToDomain(user.email), currentMessagingUser, inputValue);
			messageInputRef.current.value = "";
		} else {
			alert("Enter a message!");
		}
	};


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
							<div className="w-full h-[70vh] bg-white rounded-3xl flex flex-row overflow-hidden">
								<div className="w-1/3 h-full flex flex-col text-sm bg-[#0b1539] rounded-s-3xl">
									<input className="ms-8 px-2 mt-6 w-[35vh] text-black rounded-full" type="text" placeholder="Search Users...." />
									<div className="h-[85%] text-white w-full p-5">
										<ul>
											{messagedUsers.map((user, index) => (
												<li key={index} className="flex flex-row items-center" onClick={() => {
													setcurrentMessagingUser(user);
													setcurrentMessagingUserDp(messagedUserDps[index]);
													setisCurrentUserClicked(true);
												}}>
													<Image
														src={messagedUserDps[index]}
														height={30}
														width={30}
														alt="profile photo"
														className="rounded-full me-3"
													/>
													<span>{GetUserName(user)}</span>
												</li>
											))}
										</ul>
									</div>
								</div>
								{currentMessagingUser ?
									<div class="flex flex-col  bg-[#D9D9D9] relative w-full rounded-e-3xl">
										<div className="h-[10%] w-[93%] gap-5 ps-5 bg-[#0b1539] text-lg ms-5 rounded-full flex flex-row items-center">
											<span><Image src={currentMessagingUserDp} height={35} width={35} alt="Photo" className="rounded-full" /></span>
											<span className="text-white">{GetUserName(currentMessagingUser)}</span>
										</div>
										{currentMessages.length !== 0 ?
											<div className="mt-3 ms-10 w-[90%] h-[75%] border border-black rounded-xl flex flex-col overflow-y-auto">
												{currentMessages.map((message, index) => (
													<div
														key={index}
														className={`w-full h-fit flex flex-row ${message.Sender === convertEmailToDomain(user.email) ? 'justify-end' : 'justify-start'}`}>
														<p className={`w-fit text-sm message-container ${message.Sender === convertEmailToDomain(user.email) ? 'sender-message' : 'receiver-message'}`}>
															{message.Message}
														</p>
														{/* <span className="time">{message.Time}</span> */}
													</div>
												))}
											</div>
											:
											<div className="mt-3 ms-10 w-[90%] h-[75%] flex flex-row justify-center items-center text-xl border text-black border-black rounded-xl">
												<span>No messages to show</span>
											</div>
										}
										<div className="ms-10 absolute bottom-3 w-fit text-center border border-black text-lg rounded-full">
											<input
												type="text"
												placeholder="Type your message...."
												className="rounded-full text-black px-5 w-[93vh]"
												ref={messageInputRef}
											/>
											<button className="w-fit h-fit px-5 bg-black text-white rounded-full" onClick={() => { sendMessage(); setisSendClicked(true); }}>
												Send
											</button>
										</div>
									</div>
									:
									<div class="flex flex-col  bg-[#D9D9D9] text-[#454545] justify-center items-center text-lg w-full rounded-e-3xl">
										Select an user to chat or search a new user ....
									</div>
								}
							</div>
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
						{currentMessagingUser ?
							<div className="w-full h-[70vh] bg-white rounded-3xl flex flex-row overflow-hidden">
								<div class="flex flex-col  bg-[#D9D9D9] relative w-full rounded-e-3xl">
									<div className="h-[10%] w-[93%] gap-5 ps-5 bg-[#0b1539] text-lg ms-5 rounded-full flex flex-row items-center">
										<button className="bg-white" onClick={() => { setcurrentMessagingUser("") }}>Back</button>
										<span><Image src={currentMessagingUserDp} height={35} width={35} alt="Photo" className="rounded-full" /></span>
										<span className="text-3xl font-bold text-white">{GetUserName(currentMessagingUser)}</span>
									</div>
									{currentMessages ?
										<div className="mt-3 ms-5 w-[90%] h-[75%] border border-black rounded-xl flex flex-col overflow-y-auto">
											{currentMessages.map((message, index) => (
												<div
													key={index}
													className={`w-full h-fit flex flex-row ${message.Sender === convertEmailToDomain(user.email) ? 'justify-end' : 'justify-start'}`}>
													<p className={`w-fit text-sm message-container ${message.Sender === convertEmailToDomain(user.email) ? 'sender-message' : 'receiver-message'}`}>
														{message.Message}
													</p>
													{/* <span className="time">{message.Time}</span> */}
												</div>
											))}
										</div>
										:
										<div className="mt-3 ms-10 w-[90%] h-[75%] border text-black border-black rounded-xl">
											No messages to show
										</div>
									}
									<div className="ms-5 absolute bottom-10 w-fit text-center border border-black text-lg rounded-full">
										<input
											type="text"
											placeholder="Type your message...."
											className="rounded-full text-black px-5 w-[93vh]"
											ref={messageInputRef}
										/>
										<button className="w-fit h-fit px-5 bg-black text-white rounded-full" onClick={() => { sendMessage() }}>
											Send
										</button>
									</div>
								</div>
							</div>
							:
							<div className="w-full h-[70vh] bg-white rounded-3xl flex flex-row overflow-hidden">
								<div className="w-full h-full flex flex-col text-sm bg-[#0b1539] rounded-s-3xl">
									<input className="ms-8 px-2 mt-6 w-[35vh] text-black rounded-full" type="text" placeholder="Search Users...." />
									<div className="h-[85%] text-white w-full p-5">
										<ul>
											{messagedUsers.map((user, index) => (
												<li key={index} className="flex flex-row items-center" onClick={() => {
													setcurrentMessagingUser(user);
													setcurrentMessagingUserDp(messagedUserDps[index]);
												}}>
													<Image
														src={messagedUserDps[index]}
														height={30}
														width={30}
														alt="profile photo"
														className="rounded-full me-3"
													/>
													<span>{GetUserName(user)}</span>
												</li>
											))}
										</ul>
									</div>
								</div>
							</div>
						}
					</div>
				</div>
			</div>
		)
	)
}

export default Message;