import { database } from "../firebase";
import { ref, set, child, get, update } from "firebase/database";
import { GetFollower, GetFollowing, GetFollowingList,GetLikes,GetLikedList } from "./GetData"

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

async function IncrementFollower(userEmailId) {
  const updates = {};
  updates["users/" + userEmailId + "/Follower"] = await GetFollower(userEmailId) + 1;

  try {
    await update(ref(database), updates);
    console.log("Follower count incremented successfully.");
  } catch (error) {
    console.error("Error incrementing follower count:", error);
  }
}

async function DecrementFollower(userEmailId) {
  const updates = {};
  updates["users/" + userEmailId + "/Follower"] = await GetFollower(userEmailId) - 1;

  try {
    await update(ref(database), updates);
    console.log("Follower count decremented successfully.");
  } catch (error) {
    console.error("Error decrementing follower count:", error);
  }
}

async function IncrementFollowing(userEmailId) {
  const updates = {};
  updates["users/" + userEmailId + "/Following"] = await GetFollowing(userEmailId) + 1;

  try {
    await update(ref(database), updates);
    console.log("Following count incremented successfully.");
  } catch (error) {
    console.error("Error incrementing following count:", error);
  }
}

async function DecrementFollowing(userEmailId) {
  const updates = {};
  updates["users/" + userEmailId + "/Following"] = await GetFollowing(userEmailId) - 1;

  try {
    await update(ref(database), updates);
    console.log("Following count decremented successfully.");
  } catch (error) {
    console.error("Error decrementing following count:", error);
  }
}

async function IncrementFollowingList(userEmailId, newF) {
  const followingList = (await GetFollowingList(userEmailId)).split(",");
  followingList.push(newF); // Add the new following
  const updatedFollowingList = followingList.join(","); // Convert the array back to a string

  const updates = {};
  updates["users/" + userEmailId + "/FollowingList"] = updatedFollowingList;

  try {
    await update(ref(database), updates);
    console.log("Following list updated successfully.");
  } catch (error) {
    console.error("Error updating following list:", error);
  }
}


async function DecrementFollowingList(userEmailId, newF) {
  const followingList = (await GetFollowingList(userEmailId)).split(",");
  const index = followingList.indexOf(newF);

  if (index !== -1) {
    followingList.splice(index, 1); // Remove the following
    const updatedFollowingList = followingList.join(","); // Convert the array back to a string

    const updates = {};
    updates["users/" + userEmailId + "/FollowingList"] = updatedFollowingList;

    try {
      await update(ref(database), updates);
      console.log("Following list updated successfully.");
    } catch (error) {
      console.error("Error updating following list:", error);
    }
  }
}

async function IncrementLikes(projectId) {
  const updates = {};
  updates["projects/" + projectId + "/Likes"] = await GetLikes(projectId) + 1;

  try {
    await update(ref(database), updates);
    console.log("Likes count incremented successfully.");
  } catch (error) {
    console.error("Error incrementing following count:", error);
  }
}

async function DecrementLikes(projectId) {
  const updates = {};
  updates["projects/" + projectId + "/Likes"] = await GetLikes(projectId) - 1;

  try {
    await update(ref(database), updates);
    console.log("Likes count decremented successfully.");
  } catch (error) {
    console.error("Error incrementing following count:", error);
  }
}

async function IncrementLikedList(userEmailId, newF) {
  const followingList = (await GetLikedList(userEmailId)).split(",");
  followingList.push(newF); // Add the new following
  const updatedFollowingList = followingList.join(","); // Convert the array back to a string

  const updates = {};
  updates["users/" + userEmailId + "/LikedList"] = updatedFollowingList;

  try {
    await update(ref(database), updates);
    console.log("Liked list updated successfully.");
  } catch (error) {
    console.error("Error updating following list:", error);
  }
}

async function DecrementLikedList(userEmailId, newF) {
  const LikedList = (await GetLikedList(userEmailId)).split(",");
  const index = LikedList.indexOf(newF);

  if (index !== -1) {
    LikedList.splice(index, 1); // Remove the following
    const updatedLikedList = LikedList.join(","); // Convert the array back to a string

    const updates = {};
    updates["users/" + userEmailId + "/LikedList"] = updatedLikedList;

    try {
      await update(ref(database), updates);
      console.log("Liked list updated successfully.");
    } catch (error) {
      console.error("Error updating following list:", error);
    }
  }
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
        FollowerList: [],
        Following: 0,
        FollowingList: [],
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


export { UploadProject, UploadUserData, convertEmailToDomain, createProjectId, createUser, IncrementFollower, IncrementFollowing, IncrementFollowingList, DecrementFollower, DecrementFollowing, DecrementFollowingList ,IncrementLikes,DecrementLikes,IncrementLikedList,DecrementLikedList};
