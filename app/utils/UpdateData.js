import { database } from "../firebase";
import { getDatabase, ref, set, child, get, update } from "firebase/database";
import { GetFollower, GetFollowing } from "./GetData"

async function UploadProject(
  userEmailId,
  projectTitle,
  objective,
  description,
  category,
  thumbnailUrl,
  hashtags,
  techLang,
  ytUrl
) {
  try {
    const { projectId, projectCount } = await createProjectId(userEmailId);
    set(ref(database, "projects/" + projectId), {
      title: projectTitle,
      owner: userEmailId,
      objective: objective,
      description: description,
      category: category,
      thumbnailurl: thumbnailUrl,
      hashtags: hashtags,
      techlang: techLang,
      yturl: ytUrl,
    });

    const existingProjectsSnapshot = await get(
      child(ref(database), `users/${userEmailId}/projects`)
    );
    let existingProjectsString = ""; // Initialize an empty string

    if (existingProjectsSnapshot.exists()) {
      existingProjectsString = existingProjectsSnapshot.val();

      // Add the new projectId to the string (if it's not empty)
      if (existingProjectsString !== "") {
        existingProjectsString += ",";
      }
      // Append the new projectId to the string
      existingProjectsString += projectId;
    } else {
      // If there are no existing projects, simply set the new projectId as the value
      existingProjectsString = projectId;
    }
    // Update the projects string in the database
    set(
      child(ref(database), `users/${userEmailId}/projects`),
      existingProjectsString
    );
    console.log("Projects added successfully.");

    // Update the project count
    await UpdateProjectCountInProfile(userEmailId, projectCount + 1);
    console.log("Project Count Updated Successfully");
  } catch (error) {
    console.error("Error adding or updating projects:", error);
  }
}


async function UpdateProjectCountInProfile(userEmailID, projectCount) {
  const updates = {};
  updates["users/" + userEmailID + "/projectCount"] = projectCount;

  try {
    await update(ref(database), updates);
    console.error("projectCount updated succesfully");
  } catch (error) {
    console.error("Error updating project count:", error);
  }
}

async function createProjectId(userEmailId) {
  try {
    const projectCountSnapshot = await get(
      child(ref(database), `users/${userEmailId}/projectCount`)
    );
    const projectCount = projectCountSnapshot.exists()
      ? projectCountSnapshot.val()
      : 0;
    const projectId = `${userEmailId}_${projectCount}`;
    return { projectId, projectCount };
  } catch (error) {
    console.error("Error creating project ID:", error);
    throw error;
  }
}

function IncrementFollower(userEmailId) {
  const userRef = ref(database, "users/" + userEmailId);
  const follower = GetFollower(userEmailId) + 1;
  set(userRef, {
    Follower: follower
  });
}
function DecrementFollower(userEmailId) {
  const userRef = ref(database, "users/" + userEmailId);
  const follower = GetFollower(userEmailId) - 1;
  set(userRef, {
    Follower: follower
  });
}

function IncrementFollowing(userEmailId) {
  const userRef = ref(database, "users/" + userEmailId);
  const follower = GetFollowing(userEmailId) + 1;
  set(userRef, {
    Following: 0
  });
}
function DecrementFollowing(userEmailId) {
  const userRef = ref(database, "users/" + userEmailId);
  const follower = GetFollowing(userEmailId) - 1;
  set(userRef, {
    Following: 0
  });
}

//Call While SIgnUp and First AUthentication
function UploadUserData(userEmailId, name, dpurl) {
  const userRef = ref(database, "users/" + userEmailId);
  // Check if the user exists
  get(userRef).then((userSnapshot) => {
    if (!userSnapshot.exists()) {
      set(userRef, {
        Name: name,
        Follower: 0,
        Following: 0,
        dpUrl: dpurl
      }).then(() => {
        console.log("User data uploaded successfully.");
      }).catch((error) => {
        console.error("Error uploading user data:", error);
      });
    } else {
      console.log("User already exists. No action taken.");
    }
  }).catch((error) => {
    console.error("Error checking user existence:", error);
  });
}


//UploadUserData calling
function convertEmailToDomain(email) {
  const sanitizedEmail = email.replace(/[.@]/g, '_').toLowerCase();
  return sanitizedEmail;
}

const axios = require('axios');
function createUser(username, secret, email, first_name) {
  const data = {
    "username": username,
    "secret": secret,
    "email": email,
    "first_name": first_name,
  };

  const config = {
    method: 'post',
    url: 'https://api.chatengine.io/users/',
    headers: {
      'PRIVATE-KEY': '{{b1bd2c53-25cc-4529-b64e-838512f38766}}'
    },
    data: data
  };

  axios(config)
    .then(function (response) {
      console.log(JSON.stringify(response.data));
    })
    .catch(function (error) {
      console.log(error);
    });
}

// Usage example:
// createUser("bob_baker", "secret-123-jBj02", "b_baker@mail.com", "Bob", "Baker");


export { UploadProject, UploadUserData, convertEmailToDomain, createProjectId,createUser };
