'use client';
import { useEffect, useState, useRef } from 'react';
import Image from "next/image";
import { getAllMessages, getAllMessagesInitially } from '../utils/GetData';
import { addMessage } from '../utils/UpdateData';
import { convertEmailToDomain } from '../utils/UpdateData';

const ChatBox = ({ currentMessagingUser, user }) => {
    const [currentMessages, setCurrentMessages] = useState([]);
    const messageInputRef = useRef(null);


    useEffect(() => {
        if (user) {
            // Set up the real-time listener
            const unsubscribe = getAllMessages(
                convertEmailToDomain(user.email),
                currentMessagingUser,
                (messages) => {
                    // Update state with the new messages
                    setCurrentMessages(messages);
                }
            );

            // Return a cleanup function to remove the listener when the component unmounts
            return () => {
                unsubscribe();
            };
        }
    }, [user, currentMessagingUser]);


    useEffect(() => {
        if (user && currentMessagingUser) {
            getAllMessagesInitially(convertEmailToDomain(user.email), currentMessagingUser)
                .then((initialMessages) => {
                    setCurrentMessages(initialMessages);
                })
                .catch((error) => {
                    console.error('Error loading initial messages: ' + error);
                });
        }
    }, []);


    const sendMessage = () => {
        const inputValue = messageInputRef.current.value;
        if (inputValue !== "") {
            addMessage(convertEmailToDomain(user.email), currentMessagingUser, inputValue);
            messageInputRef.current.value = "";
        } else {
            alert("Enter a message!");
        }
    };

    console.log(currentMessages.length);

    return (
        <div>
            {currentMessages.length !== 0 ?
                <div className="mt-3 ms-[5%] w-[90%] h-[80%] border border-black rounded-xl flex flex-col overflow-y-auto">
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
                <div className="mt-3 ms-[5%] w-[90%] h-[50vh] flex flex-row justify-center items-center text-xl border text-black border-black rounded-xl">
                    <span>No messages to show</span>
                </div>
            }
            < div className="ms-[5%] absolute bottom-3 w-[90%] text-center border border-black text-lg rounded-full flex flex-row" >
                <input
                    type="text"
                    placeholder="Type your message...."
                    className="rounded-s-full text-black px-5 w-full"
                    ref={messageInputRef}
                />
                <button className="w-fit h-fit px-5 bg-black text-white rounded-e-full" onClick={() => { sendMessage(); }}>
                    Send
                </button>
            </div >
        </div>
    );
}

export default ChatBox;