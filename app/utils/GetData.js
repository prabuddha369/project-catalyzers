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

async function GetAllProjectsIdUnderProfile(userEmailId) {
  try {
    const snapshot = await get(
      child(ref(database), "users/" + userEmailId + "/projects")
    );
    if (snapshot.exists()) {
      const projects = snapshot.val();
      return projects || []; // Return the projects array or an empty array if it doesn't exist
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

async function displayFilesAndFolders(storagePath , parentElement = hierarchy) {
  const storageRef = ref(storage, storagePath);

  try {
    const listResult = await listAll(storageRef);

    const folderList = document.createElement('div');
    folderList.className = 'foldercontainer';
    parentElement.appendChild(folderList);

    listResult.prefixes.forEach(async (folder) => {
      const folderItem = document.createElement('span');
      folderItem.className = 'folder fa-folder-o';
      folderItem.setAttribute('data-isexpanded', 'false');
      folderItem.textContent = folder.name;
      folderList.appendChild(folderItem);

      await displayFilesAndFolders(folder.fullPath, folderItem); // Recursively call displayFilesAndFolders
    });

    listResult.items.forEach(async (item) => {
      const fileLink = document.createElement('a');
      const metadataref = ref(storage, item.fullPath);
      await getMetadata(metadataref)
        .then((metadata) => {
          if (item.name.endsWith('.txt') && metadata.customMetadata.extension == '.c') {
            // Replace .txt with .c in the file name
            const newName = item.name.replace('.txt', '.c');
            fileLink.href = getDownloadURL(item);
            fileLink.textContent = newName;
          }
          else if (item.name.endsWith('.txt') && metadata.customMetadata.extension == '.cpp') {
            // Replace .txt with .c in the file name
            const newName = item.name.replace('.txt', '.cpp');
            fileLink.href = getDownloadURL(item);
            fileLink.textContent = newName;
          }
          else if (item.name.endsWith('.txt') && metadata.customMetadata.extension == '.java') {
            // Replace .txt with .c in the file name
            const newName = item.name.replace('.txt', '.java');
            fileLink.href = getDownloadURL(item);
            fileLink.textContent = newName;
          }
          else if (item.name.endsWith('.txt') && metadata.customMetadata.extension == '.js') {
            // Replace .txt with .c in the file name
            const newName = item.name.replace('.txt', '.js');
            fileLink.href = getDownloadURL(item);
            fileLink.textContent = newName;
          }
          else if (item.name.endsWith('.txt') && metadata.customMetadata.extension == '.html') {
            // Replace .txt with .c in the file name
            const newName = item.name.replace('.txt', '.html');
            fileLink.href = getDownloadURL(item);
            fileLink.textContent = newName;
          }
          else if (item.name.endsWith('.txt') && metadata.customMetadata.extension == '.py') {
            // Replace .txt with .c in the file name
            const newName = item.name.replace('.txt', '.py');
            fileLink.href = getDownloadURL(item);
            fileLink.textContent = newName;
          }
          else if (item.name.endsWith('.txt') && metadata.customMetadata.extension == '.css') {
            // Replace .txt with .c in the file name
            const newName = item.name.replace('.txt', '.css');
            fileLink.href = getDownloadURL(item);
            fileLink.textContent = newName;
          }
          else {
            fileLink.href = getDownloadURL(item);
            fileLink.textContent = itemName;
          }

          const fileItem = document.createElement('span');
          fileItem.className = 'file fa-file-code-o';
          fileItem.appendChild(fileLink);

          getDownloadURL(item).then((downloadURL) => {
            fetch(downloadURL)
              .then((response) => response.text())
              .then((data) => {
                // Create a pre element to hold the code
                const codeElement = document.createElement('pre');
                if (metadata.customMetadata.extension == '.c') {
                  codeElement.classList.add('language-c'); // Specify the language class for C code
                }
                else if (metadata.customMetadata.extension == '.cpp') {
                  codeElement.classList.add('language-cpp'); // Specify the language class for C code
                }
                else if (metadata.customMetadata.extension == '.py') {
                  codeElement.classList.add('language-python'); // Specify the language class for C code
                }
                else if (metadata.customMetadata.extension == '.java') {
                  codeElement.classList.add('language-java'); // Specify the language class for C code
                }
                else if (metadata.customMetadata.extension == '.js') {
                  codeElement.classList.add('language-javascript'); // Specify the language class for C code
                }
                else if (metadata.customMetadata.extension == '.css') {
                  codeElement.classList.add('language-css'); // Specify the language class for C code
                }
                else if (metadata.customMetadata.extension == '.html') {
                  codeElement.classList.add('language-html'); // Specify the language class for C code
                }
                // Create a code element for the C code
                const codeInnerElement = document.createElement('code');
                codeInnerElement.textContent = data;
                // Append the code inner element to the code element
                codeElement.appendChild(codeInnerElement);
                // Append the code element under the file link
                fileItem.appendChild(codeElement);
                // Call Prism.js to highlight the code
                Prism.highlightElement(codeInnerElement);
              })
              .catch((error) => {
                console.error("Error fetching file:", error);
              });
          })
            .catch((error) => {
              console.error("Error fetching metadata:", error);
            });

          parentElement.appendChild(fileItem);
        });
    });
  } catch (error) {
    console.error("Error fetching metadata:", error);
  }
}
hierarchy.addEventListener("click", function (event) {
  var elem = event.target;
  if (elem.tagName.toLowerCase() == "span" && elem !== event.currentTarget) {
    var type = elem.classList.contains("folder") ? "folder" : "file";
    if (type == "file") {
    }
    if (type == "folder") {
      var isexpanded = elem.dataset.isexpanded === "true";
      if (isexpanded) {
        elem.classList.remove("fa-folder-o");
        elem.classList.add("fa-folder");
      } else {
        elem.classList.remove("fa-folder");
        elem.classList.add("fa-folder-o");
      }
      elem.dataset.isexpanded = !isexpanded;

      // Toggle visibility of all descendants
      var descendants = elem.parentElement.querySelectorAll('.file, .foldercontainer, .noitems');
      descendants.forEach(function (descendant) {
        if (isexpanded || elem.dataset.isexpanded === "false") {
          descendant.style.display = "none";
        } else {
          descendant.style.display = "block";
        }
      });
    }
  }
});

export {
  GetProjectData,
  GetAllProjectData,
  GetAllProjectsIdUnderProfile,
  GetUserName,displayFilesAndFolders,
};
