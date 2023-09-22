import { database } from "../firebase";
import { getDatabase, ref, child, get } from "firebase/database";

function GetProjectData(projectId) {
  return new Promise((resolve, reject) => {
    const dbRef = ref(getDatabase(app));
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
let proId = "prabuddhapiku_gmail_com_0";
GetProjectData(proId)
  .then((projectData) => {
    console.log("Title:", projectData.title);
    console.log("Owner:", projectData.owner);
    console.log("Objective:", projectData.objective);
    console.log("Description:", projectData.description);
    console.log("Category:", projectData.category);
    console.log("Thumbnail:", projectData.thumbnailurl);
    console.log("Hastags:", projectData.hashtags);
    console.log("Technology and Languages Used", projectData.techlang);
    console.log("Youtube Url:", projectData.yturl);
  })
  .catch((error) => {
    console.error(error);
  });

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
GetAllProjectData()
  .then((projectInfoArray) => {
    // projectInfoArray will contain an array of project information objects
    projectInfoArray.forEach((info) => {
      console.log("Project Id:", info.projectID);
      console.log("Title:", info.title);
      console.log("Owner:", info.Owner);
      console.log("Description:", info.description);
      console.log("Thumbnail URL:", info.thumbnailUrl);
    });
  })
  .catch((error) => {
    console.error(error);
  });

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
//Function Calling
let usereId = "prabuddhapiku_gmail_com"; // Replace with the actual user's email ID
GetAllProjectsIdUnderProfile(usereId)
  .then((projects) => {
    console.log("Projects:", projects);
    // Do something with the projects array
  })
  .catch((error) => {
    console.error("Error:", error);
  });

export { GetProjectData, GetAllProjectData, GetAllProjectsIdUnderProfile };
