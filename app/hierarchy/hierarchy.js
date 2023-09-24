import { useEffect, useState } from 'react';
import { storage } from '../firebase';
import {
    ref,
    listAll,
    getMetadata,
    getDownloadURL,
} from 'firebase/storage';
import Prism from 'prismjs';
import 'prismjs/components/prism-c.min.js';
import 'prismjs/components/prism-cpp.min.js';
import 'prismjs/components/prism-java.min.js';
import 'prismjs/components/prism-javascript.min.js';
import 'prismjs/components/prism-python.min.js';
import 'prismjs/themes/prism.css';
import 'font-awesome/css/font-awesome.min.css';

const Hierarchy = ({ storagePath }) => {
    const [hierarchy, setHierarchy] = useState(null);

    const handleItemClick = (event) => {
        // Handle item click if needed
    };

    const displayFilesAndFolders = async (storagePath, parentElement = hierarchy) => {
        const storageRef = ref(storage, storagePath);

        try {
            const listResult = await listAll(storageRef);

            const folderList = (
                <div>
                    {listResult.prefixes.map((folder) => (
                        <div key={folder.name}>
                            <span>{folder.name}</span>
                            {displayFilesAndFolders(folder.fullPath)}
                        </div>
                    ))}
                </div>
            );

            const fileItems = await Promise.all(
                listResult.items.map(async (item) => {
                    const metadata = await getMetadata(ref(storage, item.fullPath));

                    let newName = item.name;
                    if (item.name.endsWith('.txt') && metadata.customMetadata.extension) {
                        newName = item.name.replace('.txt', metadata.customMetadata.extension);
                    }

                    let langdetect = '';

                    if (metadata.customMetadata.extension === '.c') {
                        langdetect = 'language-c';
                        console.log(langdetect);
                    } else if (metadata.customMetadata.extension === '.cpp') {
                        langdetect = 'language-cpp';
                    } else if (metadata.customMetadata.extension === '.py') {
                        langdetect = 'language-python';
                    } else if (metadata.customMetadata.extension === '.java') {
                        langdetect = 'language-java';
                    } else if (metadata.customMetadata.extension === '.js') {
                        langdetect = 'language-javascript';
                    } else if (metadata.customMetadata.extension === '.css') {
                        langdetect = 'language-css';
                    } else if (metadata.customMetadata.extension === '.html') {
                        langdetect = 'language-html';
                    }

                    const downloadURL = await getDownloadURL(item);
                    const response = await fetch(downloadURL);
                    const codeContent = await response.text();

                    return (
                        <div key={item.name}>
                            <a href={downloadURL} target="_blank" rel="noopener noreferrer ">
                                {newName}
                            </a>
                            <pre className={`${langdetect}`}>
                                <code>{codeContent}</code>
                            </pre>
                        </div>
                    );
                })
            );

            const hierarchyElement = (
                <div>
                    {folderList}
                    {fileItems}
                </div>
            );

            if (parentElement) {
                // Do not manipulate the DOM directly
                // Instead, update the state using setHierarchy
                setHierarchy(hierarchyElement);
            } else {
                // If parentElement is not provided, assume it's the top-level hierarchy
                setHierarchy(hierarchyElement);
            }
        } catch (error) {
            console.error('Error fetching metadata:', error);
        }
    };

    useEffect(() => {
        const hierarchyElement = document.getElementById('hierarchy');
        hierarchyElement.addEventListener('click', handleItemClick);

        displayFilesAndFolders(storagePath);

        // Cleanup function or any other logic
        return () => {
            hierarchyElement.removeEventListener('click', handleItemClick);
        };
    }, [storagePath]);

    useEffect(() => {
        Prism.highlightAll();
    }, [hierarchy]);

    return (
        <div id="hierarchy" className="overflow-y-auto max-h-[200px]">
            <style>
                {`
      .overflow-y-auto::-webkit-scrollbar {
         width: 0;
                                    }
    `}
            </style>
            {hierarchy}
        </div>
    );
};

export default Hierarchy;
