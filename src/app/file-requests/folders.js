"use server"
import { getStorage, ref, deleteObject } from "firebase/storage";
import { doc, setDoc, deleteDoc, getDoc, updateDoc, orderBy, collection, query, where, getDocs, limit, increment, Timestamp, runTransaction } from "firebase/firestore";
import { db } from '@/../firebaseConfig';
import bcrypt from 'bcrypt';
import { folderNameRegex, passwordRegex } from "@/utils/Regex";
import { transformFileDataPublic, transformFolderDataPrivate, transformFolderDataPublic } from "@/utils/DataTranslation";
import { generateRandomString } from "@/utils/GenerateRandomString";



// CREATE
// Create folder
export const createFolder = async (user, folderName) => {
    try {
        if (!folderNameRegex.test(folderName)) {
            return { success: false, message: 'Kansion nimen tulee olla 2-50 merkkiä pitkä, eikä se saa sisältää <, >, /, \\ -merkkejä.' }
        }

        let folderID;
        let folderExists;

        do {
            folderID = generateRandomString(11);
            const folderRef = doc(db, "folders", folderID);
            const folderSnap = await getDoc(folderRef);
            folderExists = folderSnap.exists();
        } while (folderExists);

        const newFolder = {
            docType: 'folder',
            folderID: folderID,
            folderName: folderName,
            parentFolderName: null,
            parentID: null,
            fileCount: parseInt(0),
            userID: user.id,
            userName: user.name,
            userEmail: user.email,
            createdAt: Timestamp.fromDate(new Date()),
            modifiedAt: Timestamp.fromDate(new Date()),
            pwdProtected: false,
            pwd: null,
            linkShare: false,
            shareUrl: process.env.NEXT_PUBLIC_BASE_URL + 'jaettu-kansio/' + folderID,
            groupShare: false,
            shareGroups: [],
        };

        await setDoc(doc(db, "folders", folderID), newFolder);

        const publicFolder = transformFolderDataPublic(newFolder);
        console.log(`New base-folder ${folderName} created with ID ${folderID}.`);
        return { success: true, folder: publicFolder, message: 'Kansio luotu onnistuneesti.' }
    } catch (error) {
        console.error("Error creating folder: ", error);
        return { success: false, message: 'Kansion luomisessa tapahtui virhe, yritä uudelleen.' }
    }
}

// Create subfolder
export const createSubfolder = async (user, parentFolder, folderName) => {
    try {
        // Validate folder name
        if (!folderNameRegex.test(folderName)) {
            return { success: false, message: 'Kansion nimen täytyy olla 2-50 merkkiä pitkä ja ei saa sisältää <, >, /, \\ merkkejä.' };
        }

        // Generate unique folder ID
        let folderID;
        let newFolder;
        let folderExists = true;

        do {
            folderID = generateRandomString(11);
            const folderRef = doc(db, "folders", folderID);
            const folderSnap = await getDoc(folderRef);
            folderExists = folderSnap.exists();
        } while (folderExists);

        // Use a Firestore transaction
        await runTransaction(db, async (transaction) => {

            // Update parent folder's fileCount
            const parentFolderRef = doc(db, "folders", parentFolder.id);
            const parentFolderSnap = await transaction.get(parentFolderRef);

            if (!parentFolderSnap.exists()) {
                throw new Error(`Parent folder with ID ${parentFolder.id} does not exist.`);
            }

            // Subfolder data
            newFolder = {
                docType: 'folder',
                folderID,
                folderName,
                parentFolderName: parentFolder.name,
                parentID: parentFolder.id,
                fileCount: 0,
                userID: user.id, 
                userName: user.name, 
                userEmail: user.email,
                createdAt: Timestamp.fromDate(new Date()),
                modifiedAt: Timestamp.fromDate(new Date()),
                pwdProtected: false,
                pwd: '',
                linkShare: false,
                shareUrl: process.env.NEXT_PUBLIC_BASE_URL + 'jaettu-kansio/' + folderID,
                groupShare: false,
                shareGroups: [],
            };

            // Add subfolder to Firestore
            const subfolderRef = doc(db, "folders", folderID);
            transaction.set(subfolderRef, newFolder);

            transaction.update(parentFolderRef, { fileCount: increment(1) });
        });

        const publicFolder = transformFolderDataPublic(newFolder)
        console.log(`Subfolder ${folderName} created with ID ${folderID}.`);
        return { success: true, folder: publicFolder };
    } catch (error) {
        console.error("Error creating subfolder: ", error);
        return { success: false, message: 'Kansiota luodessa tapahtui virhe, yritä uudelleen.' };
    }
};





// GET 
// Get user base folders
export const getUserBaseFolders = async (userID) => {
    try {
        if (!userID) {
            return { success: false, message: 'Käyttäjätietoja ei löytynyt.' }
        }

        const q = query(
            collection(db, "folders"), 
            where("userID", "==", userID),
            where("parentID", "==", null),
            orderBy("folderName", "asc")
        );
        const querySnapshot = await getDocs(q);
        const folders = querySnapshot.docs.map(doc => doc.data());
        const publicFolders = folders.map(folder => transformFolderDataPublic(folder));
            
        return { success: true, folders: publicFolders }
    } catch (error) {
        console.error("Error fetching folders: ", error);
    }
}

// Get Folder and content
export const getFolderContent = async (userID, folderID) => {
    try {
        // Check folder existence
        const folderRef = doc(db, "folders", folderID);
        const folderSnap = await getDoc(folderRef);

        if (!folderSnap.exists()) {
            return { success: false, message: `Kansiota ${folderID} ei löytynyt.` };
        }

        const folderTemp = folderSnap.data();

        // Verify access rights
        const isUnauthorized = !folderTemp.linkShare && folderTemp.groupShare && userID !== folderTemp.userID;
        if (isUnauthorized) {
            return { success: false, message: 'Sinulla ei ole oikeutta tähän sisältöön.' };
        }

        // Handle password protection
        if (folderTemp.pwdProtected && userID !== folderTemp.userID) {
            return { success: true, protected: true };
        }

        // Fetch subfolders (if exists)
        let foldersTemp = [];
        try {
            const q = query(
                collection(db, "folders"),
                where("parentID", "==", folderID),
                orderBy("folderName", "asc")
            );
            const querySnap = await getDocs(q);
            foldersTemp = querySnap.docs.map(doc => doc.data());
        } catch (error) {
            console.error("Error fetching subfolders: ", error);
            return { success: false, message: 'Alikansioiden hakemisessa tapahtui virhe.' };
        }

        // Fetch folder files
        let filesTemp = [];
        try {
            const q = query(
                collection(db, "files"),
                where("folderID", "==", folderID),
                orderBy("fileName", "asc")
            );
            const querySnap = await getDocs(q);
            filesTemp = querySnap.docs.map(doc => doc.data());
        } catch (error) {
            console.error("Error fetching folder files: ", error);
            return { success: false, message: 'Tiedostojen hakemisessa tapahtui virhe.' };
        }

        // Transform data
        const folder = transformFolderDataPublic(folderTemp);
        const folders = foldersTemp.map(folder => transformFolderDataPublic(folder));
        const files = filesTemp.map(file => transformFileDataPublic(file));

        return { success: true, folder, folders, files };
    } catch (error) {
        console.error("Error fetching folder content: ", error);
        return { success: false, message: 'Kansion sisällön hakemisessa tapahtui virhe, yritä uudelleen.' };
    }
};

// Get all user folders
export const getUserFolders = async (userID) => {
    try {
        if (!userID) {
            return { success: false, message: 'Käyttäjätiedot puuttuvat.' }
        }

        const q = query(
            collection(db, "folders"),
            where("userID", "==", userID),
            orderBy("folderName", "asc")
        );
        const querySnap = await getDocs(q);
        const foldersTemp = querySnap.docs.map(doc => doc.data());
        const folders = foldersTemp.map(folder => transformFolderDataPublic(folder));
        return { success: true, folders: folders }
    } catch (error) {
        console.error("Error fetching user folders: " + error);
        return { success: false, message: 'Kansiotietojen hakemisessa tapahtui virhe, yritä uudelleen.' }
    }
}


// Get Public FolderInfo (folderID)
export const getPublicFolderInfo = async (folderID) => {
    try {
        const folderRef = doc(db, 'folders', folderID);
        const docSnap = await getDoc(folderRef);
        const data = docSnap.data();
        const folder = transformFolderDataPublic(data)
        return folder;
    } catch (error) {
        console.error("Error fetching folder data: ", error);
        throw error;
    }
}





// UPDATE
// Update folder file count
export const updateFolderFileCount = async (folderID, incrementBy) => {
    const folderRef = doc(db, 'folders', folderID);
    try {
        await updateDoc(folderRef, { fileCount: increment(incrementBy) });
    } catch (error) {
        console.error("Error updating folder file count: ", error);
    }
}

// Update folder name
export const updateFolderName = async (userID, folderID, newName) => {
    try {
        // Original data
        const folderRef = doc(db, 'folders', folderID);
        const docSnap = await getDoc(folderRef);

        if (!docSnap.exists()) {
            throw new Error("Virhe, kansiota ei löytynyt.");
        }

        const originalFolder = docSnap.data();

        // Authorization
        if (userID !== originalFolder.userID) {
            throw new Error("Luvaton muutospyyntö.");
        }

        // Data validation
        if (!folderNameRegex.test(newName)) {
            throw new Error("Virheellinen kansion nimi. Nimen tulee olla 2-50 merkkiä pitkä, eikä se saa sisältää <, >, /, \\ merkkejä.");
        }

        // Update 
        await updateDoc(folderRef, { folderName: newName });
        return { success: true, message: "Kansion nimi päivitetty." };
    } catch (error) {
        console.error("Error updating folder name: ", error);
        return { success: false, message: error.message };
    }
};

// Set/update folder password
export const updateFolderPassword = async (userID, folderID, password) => {
    try {
        // Original
        const folderRef = doc(db, 'folders', folderID);
        const docSnap = await getDoc(folderRef);

        if (!docSnap.exists()) {
            throw new Error("Kansiota ei löytynyt.");
        }

        const originalFolder = docSnap.data();

        // Authorization
        if (userID !== originalFolder.userID) {
            throw new Error("Luvaton muutospyyntö.");
        }

        // Data validation
        if (!passwordRegex.test(password)) {
            throw new Error("Virheellinen salasana. Salasana ei saa sisältää <, >, /, \\ merkkejä.");
        }

        // Password hash
        const salt = bcrypt.genSaltSync(13)
        const hashPass = bcrypt.hashSync(password, salt)

        // Update
        await updateDoc(folderRef, { pwd: hashPass, pwdProtected: true });
        return { success: true, message: "Kansion salasana asetettu." };
    } catch (error) {
        console.error("Error updating folder name: ", error);
        return { success: false, message: error.message };
    }
}

// Remove folder password
export const removeFolderPassword = async (userID, folderID) => {
    try {
        // Original
        const folderRef = doc(db, 'folders', folderID);
        const docSnap = await getDoc(folderRef);

        if (!docSnap.exists()) {
            throw new Error("Kansiota ei löytynyt.");
        }

        const originalFolder = docSnap.data();

        // Authorization
        if (userID !== originalFolder.userID) {
            throw new Error("Luvaton muutospyyntö.");
        }

        // Update
        await updateDoc(folderRef, { pwd: '', pwdProtected: false });
        return { success: true, message: "Salasana poistettu käytöstä." };

    } catch (error) {
        console.error("Error removing folder password: ", error);
        return { success: false, message: error.message };
    }
}





// DELETE
// Delete Folder
export const deleteFolder = async (userID, folderID) => {
    try {
        // Verify folder and check access control
        const folderRef = doc(db, "folders", folderID);
        const folderSnap = await getDoc(folderRef);
        if (!folderSnap.exists()) { 
            return { success: false, message: `Kansiota ${folderID} ei löytynyt.`};
        }
        const folder = folderSnap.data();
        if (userID !== folder.userID) {
            return { success: false, message: `Ei oikeuksia kansioon ${folder.folderName}` }
        }

        // Recursively delete subfolders and their files
        const subfolderDeletionResult = await deleteSubfolders(userID, folderID);
        if (!subfolderDeletionResult.success) {
            return { success: false, message: subfolderDeletionResult.message };
        }

        // Delete files in the folder
        const fileDeletionResult = await deleteFilesInFolder(userID, folderID);
        if (!fileDeletionResult.success) {
            return { success: false, message: fileDeletionResult.message };
        }

        // Delete the folder itself
        await runTransaction(db, async (transaction) => {
            const folderSnap = await transaction.get(folderRef);
            if (!folderSnap.exists()) {
                return { success: false, message: `Kansiota ${folderID} ei löytynyt.` };
            }

            transaction.delete(folderRef);
        });

        console.log(`Folder ${folderID} deleted successfully.`);
        return { success: true, message: "Kansio poistettu onnistuneesti." };
    } catch (error) {
        console.error("Error deleting folder: ", error);
        return { success: false, message: error.message };
    }
};

// Delete subfolders
export const deleteSubfolders = async (userID, parentID) => {
    try {
        // Query for subfolders
        const subfoldersQuery = query(
            collection(db, "folders"),
            where("parentID", "==", parentID)
        );
        const querySnapshot = await getDocs(subfoldersQuery);

        if (querySnapshot.empty) {
            console.log(`No subfolders found for folder ${parentID}.`);
            return { success: true, message: "Ei alikansioita poistettavaksi." };
        }

        // Iterate through each subfolder and delete its contents
        for (const subfolderDoc of querySnapshot.docs) {
            const subfolder = subfolderDoc.data();
            const subfolderID = subfolder.folderID;

            // Recursively delete subfolders of the current subfolder
            const subfolderDeletionResult = await deleteSubfolders(userID, subfolderID);
            if (!subfolderDeletionResult.success) {
                return { success: false, message: subfolderDeletionResult.message };
            }

            // Delete files in the current subfolder
            const fileDeletionResult = await deleteFilesInFolder(userID, subfolderID);
            if (!fileDeletionResult.success) {
                return { success: false, message: fileDeletionResult.message };
            }

            // Delete the current subfolder
            const subfolderRef = doc(db, "folders", subfolderID);
            await deleteDoc(subfolderRef);
            console.log(`Subfolder ${subfolderID} deleted successfully.`);
        }

        return { success: true, message: "Kaikki alikansiot poistettu onnistuneesti." };
    } catch (error) {
        console.error("Error deleting subfolders and files: ", error);
        return { success: false, message: "Alikansioiden poistaminen epäonnistui, yritä uudelleen." };
    }
};

// Delete file in folder
export const deleteFilesInFolder = async (userID, folderID) => {
    try {
        const storage = getStorage();

        // Query files in the folder
        const filesQuery = query(collection(db, "files"), where("folderID", "==", folderID));
        const querySnapshot = await getDocs(filesQuery);

        if (querySnapshot.empty) {
            console.log(`No files found in folder ${folderID}.`);
            return { success: true, message: "Kansio ei sisällä poistettavia tiedostoja." };
        }

        // Calculate total file size
        let totalFileSize = 0;
        querySnapshot.forEach((docSnap) => {
            const fileData = docSnap.data();
            totalFileSize += fileData.fileSize || 0; // Ensure fileSize is accounted for
        });

        // Firestore transaction to delete file documents and update user storage
        await runTransaction(db, async (transaction) => {
            // Update user's usedSpace
            const userRef = doc(db, "users", userID);
            const userSnap = await transaction.get(userRef);
            const userDoc = userSnap.data();

            if (userDoc.usedSpace < totalFileSize) {
                throw new Error("Käyttäjän tallennustila ei voi olla negatiivinen.");
            }
            transaction.update(userRef, { usedSpace: increment(-totalFileSize) });

            // Delete file documents
            querySnapshot.forEach((docSnap) => {
                const fileRef = doc(db, "files", docSnap.id);
                transaction.delete(fileRef);
            });
        });

        // Delete files from Firebase Storage
        const deletePromises = querySnapshot.docs.map(async (docSnap) => {
            const fileData = docSnap.data();
            const fileStorageRef = ref(storage, `file-base/${userID}/${fileData.fileID}`);
            await deleteObject(fileStorageRef);
        });

        // Wait for all storage deletions to complete
        await Promise.all(deletePromises);

        console.log(`All files in folder ${folderID} have been deleted.`);
        return { success: true, message: "Kaikki tiedostot poistettu onnistuneesti." };
    } catch (error) {
        console.error("Error deleting files in folder: ", error);
        return { success: false, message: "Kansion tiedostojen poistaminen epäonnistui, yritä uudelleen." };
    }
};




// MOVE
// Change folder parent
export const moveFolderInFolder = async (userID, folderID, toFolderID) => {
    try {
        if (!userID) {
            return { success: false, message: 'Käyttäjätietoja ei löytynyt.' };
        }
        
        const circularMove = await isCircularMove(folderID, toFolderID)
        if (circularMove) {
            return { success: false, message: "Kansiota ei voi siirtää omaan alikansioonsa." };
        }
  
        await runTransaction(db, async (transaction) => {
            const folderRef = doc(db, "folders", folderID);
            const folderSnap = await transaction.get(folderRef);
    
            if (!folderSnap.exists()) {
                throw new Error(`Kansiota ${folderID} ei löytynyt.`);
            }
    
            const folderData = folderSnap.data();
            if (folderData.userID !== userID) {
                throw new Error(`Luvaton siirtopyyntö kansiolle ${folderData.folderName}.`);
            }
    
            // Handle root-level moves
            if (!toFolderID) {
                transaction.update(folderRef, {
                    parentID: null,
                    parentFolderName: null,
                });
        
                if (folderData.parentID) {
                    const fromFolderRef = doc(db, "folders", folderData.parentID);
                    transaction.update(fromFolderRef, { fileCount: increment(-1) });
                }
    
                return { success: true };
            }
    
            const toFolderRef = doc(db, "folders", toFolderID);
            const toFolderSnap = await transaction.get(toFolderRef);
    
            if (!toFolderSnap.exists()) {
                throw new Error(`Kohdekansiota ${toFolderID} ei löydy.`);
            }
    
            const toFolderData = toFolderSnap.data();
            if (toFolderData.userID !== userID) {
                throw new Error(`Ei oikeuksia kohdekansioon ${toFolderData.folderName}.`);
            }
    
            // Check target folder capacity
            if (toFolderData.fileCount >= 10) {
                throw new Error(`Kohdekansio ${toFolderData.folderName} on täynnä.`);
            }
    
            // Update target folder file count
            transaction.update(toFolderRef, { fileCount: increment(1) });
    
            // Update source folder file count
            if (folderData.parentID) {
                const fromFolderRef = doc(db, "folders", folderData.parentID);
                transaction.update(fromFolderRef, { fileCount: increment(-1) });
            }
    
            // Update folder's parent
            transaction.update(folderRef, {
                parentID: toFolderID,
                parentFolderName: toFolderData.folderName,
            });
        });
  
        console.log(`User ${userID} moved folder ${folderID} to folder ${toFolderID || 'root'} at ${new Date().toISOString()}.`);
        return { success: true };
    } catch (error) {
        console.error("Error changing folder parent: ", error.stack || error);
        return { success: false, message: error.message || `Kansion ${folderID} siirtäminen epäonnistui.` };
    }
};




// SHARING
// Folder link sharing
export const changeFolderLinkSharing = async (userID, folderID, shareValue) => {
    try {
        const folderRef = doc(db, "folders", folderID);
        const folderSnap = await getDoc(folderRef);

        if (!folderSnap.exists()) {
            return { success: false, message: `Kansiota ${folderID} ei löytynyt.` }
        }

        const folder = folderSnap.data();

        if (userID !== folder.userID) {
            return { success: false, message: 'Ei muutosoikeuksia kansioon.' }
        }

        await updateDoc(folderRef, { linkShare: shareValue });

        return { success: true }
    } catch (error) {
        console.error("Error changing folder link sharing: " + error);
        return { success: false, message: 'Kansion jako-asetusten muuttaminen epäonnistui, yritä uudelleen.'}
    }
} 





// SUPPORT
// Prevent circular folder moves
const isCircularMove = async (folderID, toFolderID) => {
    if (folderID === toFolderID) {
        return true;
    }
  
    let currentFolderID = toFolderID;
  
    while (currentFolderID) {
      if (currentFolderID === folderID) {
        return true;
      }
  
      const currentFolderRef = doc(db, "folders", currentFolderID);
      const currentFolderSnap = await getDoc(currentFolderRef);
  
      if (!currentFolderSnap.exists()) {
        return false;
      }
  
      currentFolderID = currentFolderSnap.data().parentID;
    }
  
    return false;
  };