import { database } from "../firebase";
import { getDatabase, ref, set, child, get, update } from "firebase/database";

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

//UploadProject Function Calling
const userEmailId = "dasguptasrinjay2004_gmail_com";
const projectTitle = "The Ender Tube";
const objective =
  "The objective of Ender Tube is to leverage the YouTube API to enhance user experience by creating additional categories and targeting content effectively. This aims to provide users with a personalized and diversified content discovery platform, making it easier to find videos that align with their interests and preferences.";
const description =
  "Ender Tube operates by harnessing the power of the YouTube API to revolutionize the way users discover and interact with content. This platform offers a dynamic and personalized experience, starting with the creation of specialized categories tailored to individual interests. Users can curate their own content categories or explore a rich selection provided by Ender Tube.Through advanced content analysis and user behavior tracking, Ender Tube identifies patterns and preferences, allowing it to recommend videos that resonate with each user's unique tastes. These recommendations are further refined over time, ensuring that the content delivered remains relevant and engaging.Ender Tube also promotes content creators by enabling them to reach a more targeted audience. Creators can tag their videos with specific categories and keywords, making it easier for their content to be discovered by users interested in those topics.The platform fosters an interactive community where users can share their favorite videos, create playlists, and engage in discussions about the content they love. Ender Tube's seamless integration with the YouTube API ensures that users can watch, like, and subscribe to videos directly on the platform.In summary, Ender Tube leverages the YouTube API to provide a highly personalized content discovery experience, empowering users to explore and enjoy videos that align with their passions while supporting content creators in reaching their intended audience.";
const category = "Software";
const thumbnailUrl =
  "https://i.ibb.co/TkrXN7b/password-manager-app-thumbanile-youtube-upscaled.png";
const hashtags =
  "#DiscoverYourPassion,#PersonalizedContent,#EnderTubeCommunity,#TailoredEntertainment,#VideoDiscovery,#ContentCuration,#ExploreYourInterests";
const techLang = "JavaScript,Html,next.js,node.js,tailwind css,API";
const ytUrl = "https://youtu.be/4ykAepVkG5Y?si=NekTolXTYZO3JODt";

UploadProject(
  userEmailId,
  projectTitle,
  objective,
  description,
  category,
  thumbnailUrl,
  hashtags,
  techLang,
  ytUrl
)
  .then(() => {
    console.log("Project uploaded successfully!");
  })
  .catch((error) => {
    console.error("Error uploading project:", error);
  });

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

//Call While SIgnUp and First AUthentication
function UploadUserData(userEmailId, name) {
  set(ref(database, "users/" + userEmailId), {
    Name: name,
    Follower: 0,
    Following: 0,
  });
}
//UploadUserData calling
let userid = "dasguptasrinjay2004_gmail_com"; // Replace with the actual user's email ID
let name = "Srinjay Dasgupta "; // Replace with the actual name

UploadUserData(userid, name);
console.log("User data uploaded successfully!");

export { UploadProject, UploadUserData, UpdateProjectCountInProfile };
