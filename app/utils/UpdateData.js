import { database } from "../firebase";
import { getDatabase, ref, set, child, get, update } from "firebase/database";
import {GetFollower,GetFollowing} from "./GetData"

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
  const follower=GetFollower(userEmailId)+1;
  set(userRef, {
    Follower: follower
  });
}
function DecrementFollower(userEmailId) {
  const userRef = ref(database, "users/" + userEmailId);
  const follower=GetFollower(userEmailId)-1;
  set(userRef, {
    Follower: follower
  });
}

function IncrementFollowing(userEmailId) {
  const userRef = ref(database, "users/" + userEmailId);
  const follower=GetFollowing(userEmailId)+1;
  set(userRef, {
    Following: 0
  });
}
function DecrementFollowing(userEmailId) {
  const userRef = ref(database, "users/" + userEmailId);
  const follower=GetFollowing(userEmailId)-1;
  set(userRef, {
    Following: 0
  });
}

//Call While SIgnUp and First AUthentication
async function UploadUserData(userEmailId, name, dpurl) {
  const userRef = ref(database, "users/" + userEmailId);
  
  try {
    await set(userRef, {
      Name: name,
      Follower: 0,
      Following: 0,
      dpUrl: dpurl
    });
    return true; // Return a success indicator or other data if needed
  } catch (error) {
    throw error; // Throw an error if there's an issue with the database operation
  }
}
//UploadUserData calling
function convertEmailToDomain(email) {
  const sanitizedEmail = email.replace(/[.@]/g, '_');
  return sanitizedEmail;
}


export { UploadProject, UploadUserData, UpdateProjectCountInProfile,convertEmailToDomain};
