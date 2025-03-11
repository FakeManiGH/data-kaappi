"use server"
import { getStorage, ref, deleteObject } from "firebase/storage";
import { doc, setDoc, deleteDoc, getDoc, updateDoc, orderBy, collection, query, where, getDocs, limit, increment } from "firebase/firestore";
import { db } from '@/../firebaseConfig';
import bcrypt from 'bcrypt';


// FOLDER API FUNCTIONS
// Create folder
export const createFolder = async (folderID, folderData) => {
    try {
        // Check if folder already exists
        const folderRef = doc(db, 'folders', folderID)
        const docSnap = await getDoc(folderRef)

        if (docSnap.exists()) {
            const newFolderID = generateRandomString(11)
            return createFolder(newFolderID, folderData)
        }

        await setDoc(doc(db, 'folders', folderID), folderData)
    } catch (error) {
        console.error("Error creating folder: ", error)
    }
}

// Get folders (with userID)
export const getUserFolders = async (userID) => {
    try {
        const q = query(
            collection(db, "folders"), 
            where("userID", "==", userID),
            orderBy("folderName", "desc")
        );
        const querySnapshot = await getDocs(q);
        const folders = querySnapshot.docs.map(doc => doc.data());
        const publicFolders = folders.map(folder => {
            return {
                id: folder.folderID,
                docType: folder.docType,
                name: folder.folderName,
                parent: folder.parentFolderID,
                fileCount: folder.fileCount,
                user: {
                    id: folder.userID,
                    name: folder.userName,
                    email: folder.userEmail
                },
                created: folder.createdAt,
                modified: folder.modifiedAt,
                files: folder.files,
                password: folder.pwdProtected,
                shared: folder.shared,
                sharedWith: folder.sharedWith
            }
        });
        return publicFolders;
    } catch (error) {
        console.error("Error fetching folders: ", error);
    }
}

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
export const updateFolderData = async (udpatedFolder) => {
    const newFolder = {
        docType: 'folder',
        folderID: udpatedFolder.id,
        folderName: udpatedFolder.name,
        parentFolderID: udpatedFolder.parentID,
        fileCount: udpatedFolder.fileCount,
        userID: udpatedFolder.user.id,
        userName: udpatedFolder.user.name,
        userEmail: udpatedFolder.user.email,
        createdAt: udpatedFolder.created,
        modifiedAt: udpatedFolder.modified,
        files: udpatedFolder.files,
        password: udpatedFolder.password ? true : false,
        shared: udpatedFolder.shared,
        sharedWith: udpatedFolder.sharedWith
    }
    const folderRef = doc(db, 'folders', udpatedFolder.id);

    try {
        await updateDoc(folderRef, udpatedFolder);
    } catch (error) {
        console.error("Error updating folder data: ", error);
    }
   
}