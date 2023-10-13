"use client";
import React, { useState } from 'react';
import { UserAuth } from "../context/AuthContext";
import { ChatEngine, getOrCreateChat } from 'react-chat-engine';

const Message = () => {
	const { user } = UserAuth();
	const [username, setUsername] = useState('')
	const [isCreatingChat, setIsCreatingChat] = useState(false);

	function createDirectChat(creds) {
		setIsCreatingChat(true);

		getOrCreateChat(
			creds,
			{ is_direct_chat: true, usernames: [username] },
			() => {
				setUsername('');
				setIsCreatingChat(false);
				window.location.reload();
			}
		);
	}

	function renderChatForm(creds) {
		if (isCreatingChat) {
			return <p>Creating chat...</p>;
		}

		return (
			<div>
				<input
					placeholder="Username"
					value={username}
					onChange={(e) => setUsername(e.target.value)}
				/>
				<button onClick={() => createDirectChat(creds)}>
					Search
				</button>
			</div>
		);
	}

	return (
		<ChatEngine
			height='100vh'
			userName={user?.displayName}
			userSecret={user?.email}
			projectID='ae8bcf07-cc70-40a3-9a12-3e70be74c505'
			renderNewChatForm={(creds) => renderChatForm(creds)}
		/>
	)
}

export default Message;