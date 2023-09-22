import { database } from "../firebase";
import { getDatabase, ref, child, get } from "firebase/database";

function UploadProject(
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
  createProjectId(userEmailId)
    .then(({ projectId, projectCount }) => {
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

      // Update the projects under user
      try {
        const existingProjectsSnapshot = get(
          child(ref(database), `users/${userEmailId}/projects`)
        );
        const existingProjects = existingProjectsSnapshot.exists()
          ? existingProjectsSnapshot.val()
          : [];
        const mergedProjects = [...existingProjects, projectId];
        set(
          child(ref(database), `users/${userEmailId}/projects`),
          mergedProjects
        );
        console.log("Projects added successfully.");

        // Update the project count
        UpdateProjectCountInProfile(userEmailId, projectCount + 1)
          .then(() => {
            console.log("Project Count Updated Successfully");
          })
          .catch((error) => {
            console.error("Error updating project count:", error);
          });
      } catch (error) {
        console.error("Error adding projects:", error);
        throw error;
      }
    })
    .catch((error) => {
      console.error(error);
    });
}

function UpdateProjectCountInProfile(userEmailID, projectCount) {
  const updates = {};
  updates["users/" + userEmailID + "/projectCount"] = count;

  return update(ref(database), updates);
}

async function createProjectId(userEmailId) {
  try {
    const projectCountSnapshot = await get(
      child(ref(database), `users/${userEmailId}/projectCount`)
    );
    const projectCount = projectCountSnapshot.exists()
      ? projectCountSnapshot.val()
      : 0; // Default to 0 if projectCount doesn't exist
    const projectId = `${userEmailId}_${projectCount}`;
    return { projectId, projectCount };
  } catch (error) {
    console.error("Error creating project ID:", error);
    throw error;
  }
}

// Other Functions

function GetProjectData(projectId) {
  return new Promise((resolve, reject) => {
    const dbRef = ref(database);
    get(child(dbRef, "projects/" + projectId))
      .then((snapshot) => {
        if (snapshot.exists()) {
          const projectData = snapshot.val();
          resolve(projectData); // Resolve with the data
        } else {
          reject(new Error("No data available"));
        }
      })
      .catch((error) => {
        reject(error); // Reject with the error
      });
  });
}
/*GetProjectData(projectId)
    .then((projectData) => {
         console.log("Title:", projectData.title);
         console.log("Owner:", projectData.owner);
          console.log("Objective:", projectData.objective);
           console.log("Description:", projectData.description);
            console.log("Category:", projectData.category);
             console.log("Thumbnail:", projectData.thumbnailUrl);
              console.log("Hastags:", projectData.hastags);
               console.log("Technology and Languages Used", projectData.techLang);
                console.log("Youtube Url:", projectData.yUrl);
      })
    .catch((error) => {
         console.error(error);
      });*/

function GetAllProjectData() {
  return new Promise((resolve, reject) => {
    const dbRef = ref(database.child("projects")); // Update the reference to the "projects" node
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
                title: project.title,
                description: project.description,
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
/*GetAllProjectData()
.then((projectInfoArray) => {
// projectInfoArray will contain an array of project information objects
projectInfoArray.forEach((info) => {
    console.log("Title:", info.title);
    console.log("Owner:", info.owner);
    console.log("Description:", info.description);
    console.log("Thumbnail URL:", info.thumbnailurl);
});
})
.catch((error) => {
console.error(error);
});*/

function GetAllProjectsIdUnderProfile(userEmailid) {
  return get(child(dbRef, "users/" + userEmailid))
    .then((snapshot) => {
      if (snapshot.exists()) {
        const userData = snapshot.val();
        const { projects } = userData;
        return projects; // Return the projects array
      } else {
        throw new Error("No data available");
      }
    })
    .catch((error) => {
      console.error(error);
      throw error; // Rethrow the error to propagate it to the caller
    });
}

//Call While SIgnUp and First AUthentication
function UploadUserData(userEmailId, name) {
  set(ref(database, "users/" + userEmailId), {
    Name: name,
    projects: [],
    projectCount: 0,
    Follower: 0,
    Following: 0,
  });
}
export { UploadUserData, UploadProject };
