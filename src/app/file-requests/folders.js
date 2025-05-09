"use server"
import { getStorage, ref, deleteObject } from "firebase/storage";
import { doc, setDoc, deleteDoc, getDoc, updateDoc, orderBy, collection, query, where, getDocs, limit, increment, Timestamp, runTransaction, arrayUnion } from "firebase/firestore";
import { db } from '@/../firebaseConfig';
import bcrypt from 'bcrypt';
import { folderNameRegex, groupIdRegex, passwordRegex } from "@/utils/Regex";
import { transformFileDataPublic, transformFolderDataPublic, transformGroupDataPublic } from "@/utils/DataTranslation";
import { generateRandomString } from "@/utils/GenerateRandomString";
import { parse } from "date-fns";



// CREATE
// Create folder
export const createFolder = async (userData, folderName, currentFolder) => {
    if (currentFolder && currentFolder.id) {
        // Redirect to createSubfolder and return its result
        return await createSubfolder(userData, folderName, currentFolder);
    }

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
            parentName: null,
            parentID: null,
            fileCount: parseInt(0),
            userID: userData.id,
            userName: userData.name,
            userEmail: userData.email,
            createdAt: Timestamp.fromDate(new Date()),
            modifiedAt: Timestamp.fromDate(new Date()),
            pwdProtected: false,
            pwd: null,
            linkShare: false,
            shareUrl: process.env.NEXT_PUBLIC_BASE_URL + 'jaettu-kansio/' + folderID,
            shareGroups: [],
        };

        await setDoc(doc(db, "folders", folderID), newFolder);

        const publicFolder = transformFolderDataPublic(newFolder);
        console.log(`New base-folder ${folderName} created with ID ${folderID}.`);
        return { success: true, folder: publicFolder }
    } catch (error) {
        console.error("Error creating folder: ", error);
        return { success: false, message: 'Kansion luomisessa tapahtui virhe, yritä uudelleen.' }
    }
}

// Create subfolder
export const createSubfolder = async (userData, folderName, currentFolder) => {
    if (!userData || !folderName || !currentFolder) {
        return { success: false, message: 'Pyynnöstä puuttuu tietoja.' }
    }

    try {
        // Name validation
        if (!folderNameRegex.test(folderName)) {
            return { success: false, message: 'Kansion nimen täytyy olla 2-50 merkkiä pitkä ja ei saa sisältää <, >, /, \\ merkkejä.' };
        }

        // Unique ID
        let folderID;
        let folderExists;

        do {
            folderID = generateRandomString(11);
            const folderRef = doc(db, "folders", folderID);
            const folderSnap = await getDoc(folderRef);
            folderExists = folderSnap.exists();
        } while (folderExists);

        // Parent folder data
        const parentFolderRef = doc(db, "folders", currentFolder.id);
        const parentFolderSnap = await getDoc(parentFolderRef);

        if (!parentFolderSnap.exists()) {
            throw new Error(`Parent folder with ID ${currentFolder.id} does not exist.`);
        }

        // Subfolder data
        const newFolder = {
            docType: 'folder',
            folderID,
            folderName,
            parentID: currentFolder.id,
            fileCount: 0,
            userID: userData.id, 
            userName: userData.name, 
            userEmail: userData.email,
            createdAt: Timestamp.fromDate(new Date()),
            modifiedAt: Timestamp.fromDate(new Date()),
            pwdProtected: false,
            pwd: '',
            linkShare: false,
            shareUrl: process.env.NEXT_PUBLIC_BASE_URL + 'jaettu-kansio/' + folderID,
            shareGroups: [],
        };

        // Updates
        const subfolderRef = doc(db, "folders", folderID);
        await setDoc(subfolderRef, newFolder);
        await updateDoc(parentFolderRef, { fileCount: increment(1) }); // added file

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
        if (!userID || !folderID) {
            return { success: false, message: 'Tarvittavia tietoja ei löytynyt.' }
        }

        // Check folder existence
        const folderRef = doc(db, "folders", folderID);
        const folderSnap = await getDoc(folderRef);

        if (!folderSnap.exists()) {
            return { success: false, message: `Kansiota ${folderID} ei löytynyt.` };
        }

        const folderTemp = folderSnap.data();

        // Access Rights
        if (userID !== folderTemp.userID) {
            return { success: false, message: 'Ei tarvittavia oikeuksia kansion sisältöön.' }
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

        // SUCCESS return
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

// Get folders shareGroups info
export const getFolderShareGroupsInfo = async (groupIdArray, batchSize = 10) => {
    try {
        if (!groupIdArray || !Array.isArray(groupIdArray)) {
            return { success: false, message: 'Puutteellinen tai virheellinen pyyntötieto.', errors: [] };
        }

        if (groupIdArray.length === 0) {
            return { success: true, message: 'Kansiota ei ole jaettu ryhmissä.', groups: [], errors: [] };
        }

        const groupValidationResults = [];

        // Process the groupIdArray in batches
        for (let i = 0; i < groupIdArray.length; i += batchSize) {
            const batch = groupIdArray.slice(i, i + batchSize);

            const batchResults = await Promise.all(
                batch.map(async (groupID) => {
                    try {
                        if (!groupIdRegex.test(groupID)) {
                            return { groupID, valid: false, error: `Virheellinen ryhmätunnus ${groupID}` };
                        }

                        const groupRef = doc(db, "groups", groupID);
                        const groupSnap = await getDoc(groupRef);

                        if (!groupSnap.exists()) {
                            return { groupID, valid: false, error: `Ryhmää ${groupID} ei löytynyt.` };
                        }

                        const groupTemp = groupSnap.data();
                        const group = transformGroupDataPublic(groupTemp);

                        return { group, valid: true };
                    } catch (error) {
                        console.error(`Error validating group id ${groupID}: ${error}`);
                        return { groupID, valid: false, error: `Virhe vahvistettaessa ryhmää ${groupID}` };
                    }
                })
            );

            groupValidationResults.push(...batchResults);
        }

        // Separate valid groups and errors
        const validGroups = groupValidationResults.filter((result) => result.valid).map((result) => result.group);
        const groupErrors = groupValidationResults.filter((result) => !result.valid).map((result) => result.error);

        // No valid groups?
        if (validGroups.length === 0) {
            return { success: false, message: 'Kansiota ei ole jaettu kelvollisiin ryhmiin.', errors: groupErrors };
        }

        return { success: true, groups: validGroups, errors: groupErrors };
    } catch (error) {
        console.error("Error fetching share group data: ", error);
        return { success: false, message: 'Kansion ryhmässä jakamisen tietojen hakemisessa tapahtui virhe, päivitä sivu.', errors: [] };
    }
};

// Get folder breadgrumps
export const getFolderBreadGrumpInfo = async (parentID) => {
    if (!parentID) {
        return { success: false, message: 'Leivänmuruille ei löydy leipää.' };
    }

    try {
        let breadGrumps = [];
        let currentParentID = parentID;

        while (currentParentID) {
            const folderRef = doc(db, "folders", currentParentID);
            const folderSnap = await getDoc(folderRef);

            if (!folderSnap.exists()) {
                return { success: false, message: `Kansiota ${currentParentID} ei löytynyt.` };
            }

            const folder = folderSnap.data();
            const grump = {
                id: folder.folderID,
                name: folder.folderName,
            };

            breadGrumps.push(grump);

            // Move to the next parent
            currentParentID = folder.parentID || null;
        }

        // Reverse the breadcrumbs to show from root to child
        breadGrumps.reverse();

        return { success: true, grumps: breadGrumps };
    } catch (error) {
        console.error("Error fetching folder breadcrumbs: ", error);
        return { success: false, message: 'Kansion leivänmurujen hakemisessa tapahtui virhe.' };
    }
};






// UPDATE
// Update folder name
export const updateFolderName = async (userID, folderID, newName) => {
    try {
        if (!userID || !folderID || !newName) {
            return { success: false, message: 'Pyynnöstä puuttuu tietoja.' }
        }

        // Name validation
        if (!folderNameRegex.test(newName)) {
            return { success: false, message: 'Kansion nimen tulee olla 2-50 merkkiä pitkä, eikä se saa sisältää <, >, /, \\ merkkejä.' }
        }

        // Data
        const folderRef = doc(db, 'folders', folderID);
        const docSnap = await getDoc(folderRef);

        if (!docSnap.exists()) {
            return { success: false, message: `Kansiota ${folderID} ei löytynyt.` }
        }

        const originalFolder = docSnap.data();

        // Authorization
        if (userID !== originalFolder.userID) {
            return { success: false, message: 'Ei tarvittavia oikeuksia tiedostoon.' }
        }

        // Update 
        await updateDoc(folderRef, { folderName: newName });
        return { success: true, message: "Kansion nimi päivitetty." };
    } catch (error) {
        console.error("Error updating folder name: ", error);
        return { success: false, message: error.message };
    }
};

// Set or update folder password
export const updateFolderPassword = async (userID, folderID, password) => {
    try {
        if (!userID || !folderID || !password) {
            return { success: false, message: 'Pyynnöstä puuttuu tietoja.' }
        }

        // Validation
        if (!passwordRegex.test(password)) {
            throw new Error("Salasanan tulee olla vähintään 4 merkkiä pitkä, eikä se saa sisältää <, >, /, \\ merkkejä.");
        }

        // Data
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

        // Hash
        const salt = bcrypt.genSaltSync(13)
        const hashPass = bcrypt.hashSync(password, salt)

        // Update
        await updateDoc(folderRef, { pwd: hashPass, pwdProtected: true });
        return { success: true, message: "Kansion uusi salasana tallennettu." };
    } catch (error) {
        console.error("Error updating folder name: ", error);
        return { success: false, message: 'Salasanan tallentamisessa tapahtui virhe, yritä uudelleen.' };
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
    if (!userID || !folderID) {
        return { success: false, message: 'Pyynnöstä puuttuu tietoja.'}
    }

    try {
        const folderRef = doc(db, "folders", folderID);
        const folderSnap = await getDoc(folderRef);

        if (!folderSnap.exists()) { 
            return { success: false, message: `Kansiota ${folderID} ei löytynyt.`};
        }

        const folder = folderSnap.data();

        // Authorization
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

        // Handle deletion (+ ?parent folder fileCount)
        await runTransaction(db, async (transaction) => {
            const folderSnap = await transaction.get(folderRef);
            if (!folderSnap.exists()) {
                return { success: false, message: `Kansiota ${folderID} ei löytynyt.` };
            }

            // If folder has parent folder, update fileCount
            if (folder.parentID) {
                const parentRef = doc(db, "folders", folder.parentID);
                const parentSnap = await transaction.get(parentRef);
                if (!parentSnap.exists()) {
                    return { success: false, message: `Kansion yläkansiota ${folder.parentID} ei löytynyt.` }
                }

                transaction.update(parentRef, { fileCount: increment(-1)});
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
    if (!userID || !parentID) {
        return { success: false, message: 'Pyynnöstä puuttuu tietoja.' }
    }

    try {
        // Query
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

// Delete files in folder
export const deleteFilesInFolder = async (userID, folderID) => {
    if (!userID || !folderID) {
        return { success: false, message: 'Pyynnöstä puuttuu tietoja.' };
    }

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
        const filesData = [];
        querySnapshot.forEach((docSnap) => {
            const fileData = docSnap.data();
            totalFileSize += fileData.fileSize || 0; // Ensure fileSize is accounted for
            filesData.push({ id: docSnap.id, ...fileData });
        });

        // Transaction to delete file documents and update user storage
        let documentsDeleted = false;
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

            documentsDeleted = true; // Mark documents as deleted
        });

        // Delete files from Firebase Storage
        if (documentsDeleted) {
            try {
                const deletePromises = filesData.map(async (fileData) => {
                    const fileStorageRef = ref(storage, `file-base/${userID}/${fileData.fileID}`);
                    await deleteObject(fileStorageRef);
                });

                // Wait for all storage deletions to complete
                await Promise.all(deletePromises);

                console.log(`All files in folder ${folderID} have been deleted.`);
                return { success: true, message: "Kaikki tiedostot poistettu onnistuneesti." };
            } catch (error) {
                console.error("Error deleting physical files:", error);

                // Rollback Firestore changes if physical file deletion fails
                await runTransaction(db, async (transaction) => {
                    // Restore user's usedSpace
                    const userRef = doc(db, "users", userID);
                    transaction.update(userRef, { usedSpace: increment(totalFileSize) });

                    // Restore file documents
                    filesData.forEach((fileData) => {
                        const fileRef = doc(db, "files", fileData.id);
                        transaction.set(fileRef, fileData);
                    });
                });

                return { success: false, message: "Fyysisten tiedostojen poistaminen epäonnistui. Tiedot palautettu." };
            }
        } else {
            return { success: false, message: "Tiedostojen tietojen poistaminen epäonnistui." };
        }
    } catch (error) {
        console.error("Error deleting files in folder:", error);
        return { success: false, message: "Kansion tiedostojen poistaminen epäonnistui, yritä uudelleen." };
    }
};




// MOVE
// Change folders parent
export const transferFolderInFolder = async (userID, folderID, targetID) => {
    try {
        if (!userID || !folderID || targetID === undefined) {
            return { success: false, message: 'Pyynnöstä puuttuu tietoja.' };
        }

        // Folder data
        const folderRef = doc(db, "folders", folderID);
        const folderSnap = await getDoc(folderRef);

        if (!folderSnap.exists()) {
            return { success: false, message: `Siirrettävää kansiota ${folderID} ei löytynyt.` };
        }

        const folder = folderSnap.data();

        // Folder authorization
        if (userID !== folder.userID) {
            return { success: false, message: `Ei tarvittavia oikeuksia kansioon ${folder.folderName}.` };
        }

        // Handle target folder
        const toFolderRef = targetID ? doc(db, "folders", targetID) : null;
        const toFolderSnap = targetID ? await getDoc(toFolderRef) : null;

        if (targetID && (!toFolderSnap || !toFolderSnap.exists())) {
            return { success: false, message: `Kohdekansiota ${targetID} ei löytynyt.` };
        }

        const toFolder = toFolderSnap ? toFolderSnap.data() : null;

        if (toFolder && toFolder.userID !== userID) {
            return { success: false, message: `Ei tarvittavia oikeuksia kansioon ${toFolder.folderName}.` };
        }

        // Prevent transferring to the same folder
        if (String(folder.parentID) === String(targetID)) {
            return { success: false, message: `Kansio sijaitsee jo kansiossa ${toFolder.folderName || 'pohjakansio'}.` };
        }

        // Prevent circular moves
        const isCircular = await isCircularMove(folderID, targetID);
        if (isCircular) {
            return { success: false, message: 'Kansiota ei voi siirtää omaan alikansioonsa.' };
        }

        // Handle from folder
        const fromFolderRef = folder.parentID ? doc(db, "folders", folder.parentID) : null;
        const fromFolderSnap = folder.parentID ? await getDoc(fromFolderRef) : null;

        if (folder.parentID && (!fromFolderSnap || !fromFolderSnap.exists())) {
            return { success: false, message: 'Kansion nykyistä sijaintia ei pystytty määrittämään.' };
        }

        const fromFolder = fromFolderSnap ? fromFolderSnap.data() : null;

        if (fromFolder && fromFolder.userID !== userID) {
            return { success: false, message: `Ei tarvittavia oikeuksia kansion yläkansioon ${fromFolder.folderName}` };
        }

        // Transactions
        await runTransaction(db, async (transaction) => {
            transaction.update(folderRef, { parentID: targetID || null });

            if (toFolder) {
                transaction.update(toFolderRef, { fileCount: increment(1) });
            }

            if (fromFolder) {
                transaction.update(fromFolderRef, { fileCount: increment(-1) });
            }
        });

        console.log(`Folder ${folderID} moved from ${folder.parentID || 'base'} to ${targetID || 'base'} by user ${userID}.`);
        return { success: true, message: "Kansio siirretty onnistuneesti." };
    } catch (error) {
        console.error("Error moving folder into another folder: ", error);
        return { success: false, message: `Kansion siirtäminen epäonnistui: ${error.message}` };
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
            return { success: false, message: 'Ei tarvittavia oikeuksia muuttaa kansion jakamista.' }
        }

        await updateDoc(folderRef, { linkShare: shareValue });

        return { success: true }
    } catch (error) {
        console.error("Error changing folder link sharing: " + error);
        return { success: false, message: 'Kansion jako-asetusten muuttaminen epäonnistui, yritä uudelleen.'}
    }
} 

// Folder group sharing
export const updateFolderGroupSharingStatus = async (userID, folderID, groupIDarray) => {
    try {
        if (!userID || !folderID) {
            return { success: false, message: 'Pyynnöstä puuttuu kriittisiä tietoja. Yritä uudelleen.' };
        }

        // Validate folder
        const folderRef = doc(db, "folders", folderID);
        const folderSnap = await getDoc(folderRef);

        if (!folderSnap.exists()) {
            return { success: false, message: `Kansiota ${folderID} ei löytynyt.` };
        }

        const folder = folderSnap.data();

        if (userID !== folder.userID) {
            return { success: false, message: 'Sinulla ei ole tarvittavia oikeuksia kansioon.' };
        }

        // Handle empty groupIDarray
        if (!groupIDarray || groupIDarray.length === 0) {
            console.log(`Group sharing disabled for folder ${folderID}.`);
            await updateDoc(folderRef, { shareGroups: [] });
            return { success: true, message: 'Kansion jakaminen ryhmissä poistettu käytöstä.' };
        }

        // Validate groups in parallel
        const validationResults = await Promise.all(
            groupIDarray.map(async (groupID) => {
                try {
                    if (groupID.length !== 11) {
                        return { groupID, valid: false, error: `Virheellinen ryhmä ${groupID}.` };
                    }

                    const groupRef = doc(db, "groups", groupID);
                    const groupSnap = await getDoc(groupRef);

                    if (!groupSnap.exists()) {
                        return { groupID, valid: false, error: `Ryhmää ${groupID} ei löytynyt.` };
                    }

                    const group = groupSnap.data();

                    if (!group.groupMembers || !group.groupMembers.includes(userID)) {
                        return { groupID, valid: false, error: `Et ole ryhmän ${groupID} jäsen.` };
                    }

                    return { groupID, valid: true };
                } catch (error) {
                    console.error(`Error validating group ${groupID}:`, error);
                    return { groupID, valid: false, error: `Virhe ryhmän ${groupID} käsittelyssä.` };
                }
            })
        );

        // Separate valid groups and errors
        const validGroups = validationResults.filter((result) => result.valid).map((result) => result.groupID);
        const groupErrors = validationResults.filter((result) => !result.valid).map((result) => result.error);

        // No valid groups?
        if (validGroups.length === 0) {
            console.log(`User ${userID} is not a member of any valid groups.`);
            return { success: false, message: 'Ei kelvollisia ryhmiä, missä jakaa kansio.', errors: groupErrors };
        }

        // Update folder groupSharing with valid groups
        try {
            await updateDoc(folderRef, {
                shareGroups: arrayUnion(...validGroups),
            });

            console.log(`Folder ${folderID} updated with group sharing enabled and groups: ${validGroups}`);
            return {
                success: true,
                message: 'Kansion jakamista ryhmissä muutettu onnistuneesti.',
                errors: groupErrors,
            };
        } catch (error) {
            console.error("Error updating folder group sharing: ", error);
            return { success: false, message: 'Kansion ryhmäjakamisen muutokset epäonnistuivat. Yritä uudelleen.' };
        }
    } catch (error) {
        console.error(`Error sharing folder ${folderID} in groups ${groupIDarray}: ${error}`);
        return { success: false, message: 'Kansion jakaminen ryhmissä epäonnistui. Yritä uudelleen.' };
    }
};





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