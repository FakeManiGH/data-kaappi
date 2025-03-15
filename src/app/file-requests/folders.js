"use server"
import { getStorage, ref, deleteObject } from "firebase/storage";
import { doc, setDoc, deleteDoc, getDoc, updateDoc, orderBy, collection, query, where, getDocs, limit, increment } from "firebase/firestore";
import { db } from '@/../firebaseConfig';
import bcrypt from 'bcrypt';

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

// Update folder data
export const updateFolderData = async (userID, updatedData) => {
    try {
        const orginalFolder = await getFolderInfo(updatedData.id);

        if (!orginalFolder) {
            throw new Error("No folder found.")
        }

        if (userID !== orginalFolder.userID) {
            throw new Error("Invalid update request");
        }

        // Password hashing
        if (updatedData.password !== '') {
            const saltRounds = 13;
            const hash = await bcrypt.hash(updatedData.password, saltRounds);
            updatedData = {
                ...updatedData,
                password: hash
            }
        }

        const newFolder = transformFolderDataPrivate(updatedData)
        const folderRef = doc(db, 'folders', newFolder.folderID);
        await updateDoc(folderRef, newFolder);
    } catch (error) {
        console.error("Error updating folder data: ", error);
        throw error;
    }
}


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
        created: folder.createdAt,
        modified: folder.modifiedAt,
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
        createdAt: folder.created,
        modifiedAt: folder.modified,
        pwdProtected: folder.passwordProtected,
        pwd: folder.password,
        shared: folder.shared,
        sharedWith: folder.sharedWith
    }
}