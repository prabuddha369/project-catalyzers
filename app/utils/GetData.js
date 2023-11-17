import { database } from "../firebase";
import { ref, child, get, push, set } from "firebase/database";
import { storage } from '../firebase';
import { ref as sRef } from 'firebase/storage';
import {
  listAll,
  getMetadata,
  getDownloadURL,
} from 'firebase/storage';

async function GetProjectData(projectId) {
  const dbRef = ref(database);
  try {
    const snapshot = await get(child(dbRef, "projects/" + projectId));
    if (snapshot.exists()) {
      return snapshot.val(); // Resolve with the data
    } else {
      throw new Error("No data available");
    }
  } catch (error) {
    throw error; // Reject with the error
  }
}

function GetProjectTitle(projectId) {
  const dbRef = ref(database);
  return get(child(dbRef, "projects/" + projectId + "/title"))
    .then((snapshot) => {
      if (snapshot.exists()) {
        return snapshot.val(); // Resolve with the data
      } else {
        throw new Error("No data available");
      }
    })
    .catch((error) => {
      throw error; // Reject with the error
    });
}

function GetProjectDescription(projectId) {
  const dbRef = ref(database);
  return get(child(dbRef, "projects/" + projectId + "/description"))
    .then((snapshot) => {
      if (snapshot.exists()) {
        return snapshot.val(); // Resolve with the data
      } else {
        throw new Error("No data available");
      }
    })
    .catch((error) => {
      throw error; // Reject with the error
    });
}

function GetProjectThumbnailUrl(projectId) {
  const dbRef = ref(database);
  return get(child(dbRef, "projects/" + projectId + "/thumbnailurl"))
    .then((snapshot) => {
      if (snapshot.exists()) {
        return snapshot.val(); // Resolve with the data
      } else {
        throw new Error("No data available");
      }
    })
    .catch((error) => {
      throw error; // Reject with the error
    });
}


//Function calling GetProjectData
function GetAllProjectData() {
  return new Promise((resolve, reject) => {
    const dbRef = ref(database, "projects");
    get(dbRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const projectData = snapshot.val();
          const projectInfoArray = [];

          // Loop through each project and extract specific fields
          for (const projectId in projectData) {
            if (projectData.hasOwnProperty(projectId)) {
              const project = projectData[projectId];
              const projectInfo = {
                projectID: projectId,
                Owner: project.owner,
                Category: project.category,
                Hastags: project.hashtags,
                TechLang: project.techlang,
                title: project.title,
                thumbnailUrl: project.thumbnailurl,
              };
              projectInfoArray.push(projectInfo);
            }
          }

          resolve(projectInfoArray);
        } else {
          reject(new Error("No projects found"));
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
}
//Function Calling GetALLProjectData

async function GetAllProjectsDataUnderProfile(userEmailId) {
  try {
    const snapshot = await get(
      child(ref(database), "users/" + userEmailId + "/projects")
    );
    if (snapshot.exists()) {
      const projects = snapshot.val().split(',');
      let projectData = [];
      for (const projectId of projects) {
        const project = await GetProjectData(projectId);
        projectData.push(project);
      }
      return projectData;
    } else {
      return []; // Return an empty array if the user data doesn't exist
    }
  } catch (error) {
    console.error(error);
    throw error; // Rethrow the error to propagate it to the caller
  }
}

async function GetUserName(userEmailId) {
  try {
    const dbRef = ref(database);
    const snapshot = await get(child(dbRef, "users/" + userEmailId + "/Name"));

    if (snapshot.exists()) {
      const Name = snapshot.val();
      return Name; // Return the data
    } else {
      throw new Error("No data available");
    }
  } catch (error) {
    throw error; // Throw the error
  }
}

async function GetUserPhotoUrl(userEmailId) {
  try {
    const dbRef = ref(database);
    const snapshot = await get(child(dbRef, "users/" + userEmailId + "/dpUrl"));

    if (snapshot.exists()) {
      const Dpurl = snapshot.val();
      return Dpurl; // Return the data
    } else {
      throw new Error("No data available");
    }
  } catch (error) {
    throw error; // Throw the error
  }
}

async function GetFollower(userEmailId) {
  try {
    const dbRef = ref(database);
    const snapshot = await get(child(dbRef, "users/" + userEmailId + "/Follower"));

    if (snapshot.exists()) {
      const Follower = snapshot.val();
      return Follower; // Return the data
    } else {
      throw new Error("No data available");
    }
  } catch (error) {
    throw error; // Throw the error
  }
}

async function GetFollowing(userEmailId) {
  try {
    const dbRef = ref(database);
    const snapshot = await get(child(dbRef, "users/" + userEmailId + "/Following"));

    if (snapshot.exists()) {
      const Following = snapshot.val();
      return Following; // Return the data
    } else {
      throw new Error("No data available");
    }
  } catch (error) {
    throw error; // Throw the error
  }
}
async function GetFollowingList(userEmailId) {
  try {
    const dbRef = ref(database);
    const snapshot = await get(child(dbRef, "users/" + userEmailId + "/FollowingList"));

    if (snapshot.exists()) {
      const Following = snapshot.val();
      return Following; // Return the data
    } else {
      return "";
    }
  } catch (error) {
    throw error; // Throw the error
  }
}

async function GetLikes(projectId) {
  try {
    const dbRef = ref(database);
    const snapshot = await get(child(dbRef, "projects/" + projectId + "/Likes"));

    if (snapshot.exists()) {
      const Likes = snapshot.val();
      return Likes; // Return the data
    } else {
      return 0; // Return 0 as the default value
    }
  } catch (error) {
    throw error; // Throw the error
  }
}

async function GetLikedList(userEmailId) {
  try {
    const dbRef = ref(database);
    const snapshot = await get(child(dbRef, "users/" + userEmailId + "/LikedList"));

    if (snapshot.exists()) {
      const Liked = snapshot.val();
      return Liked; // Return the data
    } else {
      return ""; // Return an empty string as the default value
    }
  } catch (error) {
    throw error; // Throw the error
  }
}




let flg = false;

async function generateFolderData(storageRef, flg) {
  const listResult = await listAll(storageRef);
  const dataPromises = [];
  const items = [];

  for (const folderRef of listResult.prefixes) {
    dataPromises.push(generateFolderData(folderRef, true));
  }

  for (const itemRef of listResult.items) {
    dataPromises.push(handleItem(itemRef));
  }

  const resolvedData = await Promise.all(dataPromises);
  resolvedData.forEach((item) => {
    if (item.type === 'folder') {
      items.push(item);
    } else {
      const metadata = item.metadata;
      let newName = item.name;
      if (metadata && metadata.customMetadata) {
        if (item.name.endsWith('.txt') && metadata.customMetadata.extension) {
          newName = item.name.replace('.txt', metadata.customMetadata.extension);
        }
      }
      items.push({
        id: item.id,
        label: newName,
        type: 'file',
      });
    }
  });

  let data = {
    id: storageRef.fullPath,
    label: flg ? storageRef.name : 'Project Folder',
    type: 'folder',
    children: items,
  };

  return data;
}

async function handleItem(itemRef) {
  const metadata = await getMetadata(sRef(storage, itemRef.fullPath));
  return { id: itemRef.fullPath, name: itemRef.name, type: 'file', metadata };
}

async function getCodeContent(itemPath) {
  const metadata = await getMetadata(sRef(storage, itemPath));
  let langdetect = '';

  if (metadata.customMetadata && metadata.customMetadata.extension) {
    if (metadata.customMetadata.extension === '.c') {
      langdetect = 'c';
    } else if (metadata.customMetadata.extension === '.cpp') {
      langdetect = 'cpp';
    } else if (metadata.customMetadata.extension === '.py') {
      langdetect = 'python';
    } else if (metadata.customMetadata.extension === '.java') {
      langdetect = 'java';
    } else if (metadata.customMetadata.extension === '.js') {
      langdetect = 'javascript';
    } else if (metadata.customMetadata.extension === '.css') {
      langdetect = 'css';
    } else if (metadata.customMetadata.extension === '.html') {
      langdetect = 'html';
    }
  }

  const downloadURL = await getDownloadURL(sRef(storage, itemPath));
  const response = await fetch(downloadURL);

  if (!langdetect) {
    langdetect = 'plaintext';
  }

  let codeContent = await response.text();

  if (!codeContent) {
    codeContent = `This File is not viewable. Click [here](${downloadURL}) to download.`;
  }

  return { langdetect, codeContent };
}

async function getEmailsByUserName(userNameToSearch) {
  const usersRef = ref(database, 'users');
  const normalizedSearchName = userNameToSearch.toLowerCase().replace(/\s+/g, '');

  try {
    const snapshot = await get(usersRef.orderByChild('Name'));
    const emailIDs = [];

    snapshot.forEach((childSnapshot) => {
      const name = childSnapshot.child('Name').val();

      if (name) {
        const normalizedDBName = name.toLowerCase().replace(/\s+/g, '');
        if (normalizedDBName.includes(normalizedSearchName)) {
          emailIDs.push(childSnapshot.key);
        }
      }
    });

    return emailIDs;
  } catch (error) {
    console.error('Error getting data: ' + error);
    return null;
  }
}

async function updateUsersMessages(email, email2) {
  const userRef1 = ref(database, `users/${email}/messages`);
  const userRef2 = ref(database, `users/${email2}/messages`);

  try {
    // Update or initialize the messages array for email
    const user1Messages = (await get(userRef1)).val() || [];
    if (!user1Messages.includes(email2)) {
      user1Messages.push(email2);
      await set(userRef1, user1Messages.join(','));
    }

    // Update or initialize the messages array for email2
    const user2Messages = (await get(userRef2)).val() || [];
    if (!user2Messages.includes(email)) {
      user2Messages.push(email);
      await set(userRef2, user2Messages.join(','));
    }
  } catch (error) {
    console.error('Error updating users messages: ' + error);
    throw error;
  }
}

async function addMessage(email, email2, message, sender) {
  const messagesRef = ref(database, `messages/${email}-${email2}`);

  try {
    // Check if messagesRef exists
    const messagesSnapshot = await get(messagesRef);

    if (!messagesSnapshot.exists()) {
      // Call updateUsersMessages if messagesRef does not exist
      await updateUsersMessages(email, email2);
    }

    // Use push to generate a unique key for the new message
    const newMessageRef = push(messagesRef);
    const messageId = newMessageRef.key;

    const messageData = {
      Sender: sender,
      time: new Date().toISOString(), // or use your preferred timestamp format
      message: message,
    };

    // Set the data for the new message under the generated key
    await set(newMessageRef, messageData);

    return messageId;
  } catch (error) {
    console.error('Error adding message: ' + error);
    throw error;
  }
}

export {
  GetProjectData,
  GetAllProjectData,
  GetAllProjectsDataUnderProfile, getEmailsByUserName,addMessage,
  GetUserName, generateFolderData, getCodeContent, GetLikes, GetLikedList,
  GetUserPhotoUrl, GetFollower, GetFollowing, GetFollowingList, GetProjectThumbnailUrl, GetProjectTitle, GetProjectDescription
};
