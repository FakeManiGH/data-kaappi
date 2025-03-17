"use server"
import { getStorage, ref, deleteObject } from "firebase/storage";
import { doc, setDoc, deleteDoc, getDoc, updateDoc, orderBy, collection, query, where, getDocs, limit, increment, Timestamp } from "firebase/firestore";
import { db } from '@/../firebaseConfig';
import bcrypt from 'bcrypt';
import { folderNameRegex } from "@/utils/Regex";

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

        // Validate the new folder name
        if (!folderNameRegex.test(newName)) {
            throw new Error("Virheellinen kansion nimi. Nimen tulee olla 2-50 merkkiä pitkä, eikä se saa sisältää <, >, /, \\ merkkejä.");
        }

        // Update the folder name
        await updateDoc(folderRef, { folderName: newName });

        return { success: true, message: "Kansion nimi päivitetty." };
    } catch (error) {
        console.error("Error updating folder name: ", error);
        return { success: false, message: error.message };
    }
};




// DELETE
// Delete Folder




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