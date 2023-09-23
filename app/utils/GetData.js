import { database } from "../firebase";
import { ref, child, get } from "firebase/database";

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
//Function Calling GetALLProjectData

function GetAllProjectsIdUnderProfile(userEmailid) {
  return get(child(ref(database), "users/" + userEmailid))
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
export { GetProjectData, GetAllProjectData, GetAllProjectsIdUnderProfile };
