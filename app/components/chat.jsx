'use client';
import { useEffect, useState } from 'react';
import { getMessagedUsers, GetUserName, GetUserPhotoUrl, getEmailsByUserName } from '../utils/GetData';
import { convertEmailToDomain } from '../utils/UpdateData';
import Image from "next/image";
import { IoChevronBack } from "react-icons/io5";
import ChatBox from './chatbox';

const Chat = ({ user }) => {
    const [messagedUsers, setMessagedUsers] = useState([]);
    const [messagedUserDps, setMessagedUsersDps] = useState([]);
    const [currentMessagingUserDp, setcurrentMessagingUserDp] = useState("");
    const [currentMessagingUser, setcurrentMessagingUser] = useState("");


    const handleSearchInputChange = (event) => {
        setSearchInput(event.target.value);
    };

    useEffect(() => {
        if (user) {
            getMessagedUsers(convertEmailToDomain(user.email))
                .then((usersArray) => {
                    setMessagedUsers(usersArray);
                    return Promise.all(
                        usersArray.map((user) =>
                            GetUserPhotoUrl(user).then((link) => ({
                                user,
                                photoUrl: link,
                            }))
                        )
                    );
                })
                .then((photos) => {
                    const dps = photos.map((photo) => photo.photoUrl);
                    setMessagedUsersDps(dps);
                })
                .catch((error) => {
                    console.error('Error getting user photos or message users: ' + error);
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
            <div className="w-full mt-5 h-[70vh] bg-white rounded-3xl flex flex-row overflow-hidden">
                <div className="w-1/3 h-full flex flex-col text-sm bg-[#0b1539] rounded-s-3xl">
                    <div className="h-[85%] text-white w-full p-5">
                        <div className='ms-2 mb-5 text-xl text-white'>Chats</div>
                        {messagedUsers.length === 0 ?
                            <div>
                                <span className='text-sm text-white ms-5'>No Chats to show....</span>
                            </div>
                            :
                            <ul>
                                {messagedUsers.map((users, index) => (
                                    <li key={index} className="flex flex-row items-center" onClick={() => {
                                        setcurrentMessagingUser(users);
                                        setcurrentMessagingUserDp(messagedUserDps[index]);
                                    }}>
                                        <Image
                                            src={messagedUserDps[index]}
                                            height={30}
                                            width={30}
                                            alt="profile photo"
                                            className="rounded-full me-3"
                                        />
                                        <span>{GetUserName(users)}</span>
                                    </li>
                                ))
                                }
                            </ul>
                        }
                    </div>
                </div>
                {currentMessagingUser ?
                    < div class="flex flex-col  bg-[#D9D9D9] relative w-full rounded-e-3xl" >
                        <div className="h-[10%] w-[93%] gap-5 ps-5 bg-[#0b1539] text-lg ms-5 rounded-full flex flex-row items-center">
                            <span><Image src={currentMessagingUserDp} height={35} width={35} alt="Photo" className="rounded-full" /></span>
                            <span className="text-white">{GetUserName(currentMessagingUser)}</span>
                        </div>
                        <ChatBox currentMessagingUser={currentMessagingUser} user={user} />
                    </div>
                    :
                    <div class="flex flex-col  bg-[#D9D9D9] text-[#454545] justify-center items-center text-lg w-full rounded-e-3xl">
                        Select an user to chat or search a new user ....
                    </div>
                }
            </div>
            :
            <div>
                {currentMessagingUser ?
                    <div className="w-full h-[80vh] bg-white rounded-3xl flex flex-row overflow-hidden">
                        < div class="flex flex-col  bg-[#D9D9D9] relative w-full rounded-3xl" >
                            <div className="h-[10%] w-[100%] gap-5 text-white ps-5 bg-[#0b1539] text-lg flex flex-row items-center">
                                <button onClick={() => { console.log('Button clicked'); setcurrentMessagingUser(''); }}><IoChevronBack size={30} /></button>
                                <Image src={currentMessagingUserDp} height={35} width={35} alt="Photo" className="rounded-full" />
                                <span className="text-lg font-bold text-white">{GetUserName(currentMessagingUser)}</span>
                            </div>
                            <ChatBox currentMessagingUser={currentMessagingUser} user={user} />
                        </div >
                    </div >
                    :
                    <div className="w-full h-[80vh] bg-white rounded-3xl flex flex-row overflow-hidden">
                        <div className="w-full h-full flex flex-col text-sm bg-[#0b1539] rounded-s-3xl">
                            <div className="h-[85%] text-white w-full p-5">
                                <div className='ms-4 mt-3 mb-5 text-xl text-white'>Chats</div>
                                {messagedUsers.length === 0 ?
                                    <span className='text-sm text-white'>No Users to show....</span>
                                    :
                                    <ul>
                                        {messagedUsers.map((users, index) => (
                                            <li key={index} className="flex flex-row items-center" onClick={() => {
                                                setcurrentMessagingUser(users);
                                                setcurrentMessagingUserDp(messagedUserDps[index]);
                                            }}>
                                                <Image
                                                    src={messagedUserDps[index]}
                                                    height={30}
                                                    width={30}
                                                    alt="profile photo"
                                                    className="rounded-full me-3"
                                                />
                                                <span>{GetUserName(users)}</span>
                                            </li>
                                        ))
                                        }
                                    </ul>
                                }
                            </div>
                        </div>
                    </div>
                }
            </div>
        )
    );
}
export default Chat;