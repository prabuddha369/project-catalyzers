import { database } from "../firebase";
import { ref, child, get } from "firebase/database";

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
                Hastags:project.hashtags,
                TechLang:project.techlang,
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

export {
  GetProjectData,
  GetAllProjectData,
  GetAllProjectsDataUnderProfile,
  GetUserName,
  GetUserPhotoUrl,GetFollower,GetFollowing,GetProjectThumbnailUrl,GetProjectTitle,GetProjectDescription
};
