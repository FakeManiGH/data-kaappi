"use server"
import { getStorage, ref, deleteObject } from "firebase/storage";
import { doc, setDoc, deleteDoc, getDoc, updateDoc, orderBy, collection, query, where, getDocs, limit, increment, Timestamp, runTransaction } from "firebase/firestore";
import { db } from '@/../firebaseConfig';
import bcrypt from 'bcrypt';
import { folderNameRegex, passwordRegex } from "@/utils/Regex";

// FOLDER API FUNCTIONS
// CREATE
// Create folder
export const createFolder = async (folderID, folderData) => {
    try {
        // Check if folder already exists
        const folderRef = doc(db, 'folders', folderID);
        const docSnap = await getDoc(folderRef);

        if (docSnap.exists()) {
            const newFolderID = generateRandomString(11);
            return createFolder(newFolderID, folderData);
        }

        folderData.createdAt = Timestamp.fromDate(new Date());
        folderData.modifiedAt = Timestamp.fromDate(new Date());

        await setDoc(doc(db, 'folders', folderID), folderData);
    } catch (error) {
        console.error("Error creating folder: ", error);
    }
}

// GET 
// Get folders (with userID)
export const getUserFolders = async (userID, parentID) => {
    try {
        if (!userID) throw new Error("Request indentification error.")
        const q = query(
            collection(db, "folders"), 
            where("userID", "==", userID),
            where("parentID", "==", parentID),
            orderBy("folderName", "asc")
        );
        const querySnapshot = await getDocs(q);
        const folders = querySnapshot.docs.map(doc => doc.data());
        const publicFolders = folders.map(folder => transformFolderDataPublic(folder));
            
        return publicFolders;
    } catch (error) {
        console.error("Error fetching folders: ", error);
    }
}

// Get FolderInfo (folderID)
export const getFolderInfo = async (folderID) => {
    try {
        const folderRef = doc(db, 'folders', folderID);
        const docSnap = await getDoc(folderRef);
        const data = docSnap.data();
        return data;
    } catch (error) {
        console.error("Error fetching folder data: ", error);
        throw error;
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
        if (!folderSnap.exists()) throw new Error(`Kansiota ${folderID} ei löytynyt.`);

        const folder = folderSnap.data();
        if (userID !== folder.userID) throw new Error(`Ei oikeuksia kansioon ${folderID}.`);

        // Delete files in the folder
        const fileDeletionResult = await deleteFilesInFolder(userID, folderID);
        if (!fileDeletionResult.success) {
            throw new Error(fileDeletionResult.message);
        }

        // Delete the folder itself
        await runTransaction(db, async (transaction) => {
            const folderSnap = await transaction.get(folderRef);
            if (!folderSnap.exists()) throw new Error(`Kansiota ${folderID} ei löytynyt.`);

            transaction.delete(folderRef);
        });

        console.log(`Folder ${folderID} deleted successfully.`);
        return { success: true, message: "Kansio poistettu onnistuneesti." };
    } catch (error) {
        console.error("Error deleting folder: ", error);
        return { success: false, message: error.message };
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
            const fileStorageRef = ref(storage, `file-base/${fileData.fileID}`);
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



// SUPPORT FUNCTIONS
// Transform folder data for public use
const transformFolderDataPublic = (folder) => {
    return {
        docType: folder.docType,
        id: folder.folderID,
        name: folder.folderName,
        parent: folder.parentID,
        fileCount: folder.fileCount,
        user: {
            id: folder.userID,
            name: folder.userName,
            email: folder.userEmail
        },
        created: new Date(folder.createdAt.seconds * 1000),
        modified: new Date(folder.modifiedAt.seconds * 1000),
        passwordProtected: folder.pwdProtected,
        password: '',
        shared: folder.shared,
        sharedWith: folder.sharedWith
    }
}

// Transform folder data for private use
const transformFolderDataPrivate = (folder) => {
    return {
        docType: 'folder',
        folderID: folder.id,
        folderName: folder.name,
        parentID: folder.parent,
        fileCount: folder.fileCount,
        userID: folder.user.id,
        userName: folder.user.name,
        userEmail: folder.user.email,
        createdAt: folder.created instanceof Date ? folder.created : new Date(folder.created.seconds * 1000),
        modifiedAt: folder.modified instanceof Date ? folder.modified : new Date(folder.modified.seconds * 1000),
        pwdProtected: folder.passwordProtected,
        pwd: folder.password,
        shared: folder.shared,
        sharedWith: folder.sharedWith
    }
}