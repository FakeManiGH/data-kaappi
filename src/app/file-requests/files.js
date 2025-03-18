"use server"
import { getStorage, ref, deleteObject } from "firebase/storage";
import { doc, setDoc, deleteDoc, getDoc, updateDoc, orderBy, collection, query, where, getDocs, limit, increment } from "firebase/firestore";
import { db } from '@/../firebaseConfig';
import bcrypt from 'bcrypt';
import { getFolderInfo, updateFolderFileCount } from "./folders";
import { fileNameRegex } from "@/utils/Regex";

// Config
const storage = getStorage();

// GET FILE FUNCTIONS
// Get file info by fileID
export const getFileInfo = async (fileID) => {
    try {
        const docRef = doc(db, 'files', fileID)
        const docSnap = await getDoc(docRef)
        const data = docSnap.data()
        return data;
    } catch (error) {
        console.error("Error fetching file: ", error)
    }
}

// Get file info (-> public)
export const getPublicFileInfo = async (fileID) => {
    try {
        const docRef = doc(db, 'files', fileID)
        const docSnap = await getDoc(docRef)
        if (!docSnap.exists()) throw new Error("No file found.")
        const data = docSnap.data()
        const file = transformFileDataPublic(data)
        return file;
    } catch (error) {
        console.error("Error fetching file: ", error)
    }
}

// Get user files by userID
export const getUserFiles = async (userID) => {
    try {
        const q = query(collection(db, "files"), where("userID", "==", userID));
        const querySnapshot = await getDocs(q);
        const files = querySnapshot.docs.map(doc => doc.data());
        const publicFiles = files.map(file => transformFileDataPublic(file));
        publicFiles.sort((a, b) => b.uploadedAt - a.uploadedAt);
        return publicFiles;
    } catch (error) {
        console.error("Error fetching files: ", error);
    }
}

// Get files by folder
export const getUserFilesByFolder = async (userID, folderID) => {
    try {
        const q = query(
            collection(db, "files"),
            where("folderID", "==", folderID),
            where("userID", "==", userID),
            orderBy("uploadedAt", "asc")
        );
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) {
            console.log("No matching documents.");
            return [];
        }
        const files = querySnapshot.docs.map(doc => doc.data());
        const publicFiles = files.map(file => transformFileDataPublic(file));
        return publicFiles;
    } catch (error) {
        console.error("Error fetching folderless files: ", error);
    }
}

// UPDATE FILE FUNCTIONS
// Update file name
export const updateFileName = async (userID, fileID, newName) => {
    try {
        // Original data
        const fileRef = doc(db, 'files', fileID);
        const docSnap = await getDoc(fileRef);

        if (!docSnap.exists()) {
            throw new Error("Kansiota ei löytynyt.");
        }

        const originalFile = docSnap.data();

        // Authorization
        if (userID !== originalFile.userID) {
            throw new Error("Luvaton muutospyyntö.");
        }

        // Data validation
        if (!fileNameRegex.test(newName)) {
            throw new Error("Virheellinen kansion nimi. Nimen tulee olla 2-50 merkkiä pitkä, eikä se saa sisältää <, >, /, \\ merkkejä.");
        }

        // Update 
        await updateDoc(fileRef, { fileName: newName });
        return { success: true, message: "Tiedoston nimi päivitetty." };
    } catch (error) {
        console.error("Error updating file name: ", error);
        return { success: false, message: error.message };
    }
};


// DELETE FILE FUNCTIONS
// Delete file
export const deleteFile = async (file) => {
    const desertRef = ref(storage, `file-base/${file.id}`);

    try {
        await deleteDoc(doc(db, "files", file.id));
        await deleteObject(desertRef);
    } catch (error) {
        console.error("Error deleting file: ", error)
    }   
}

// MOVING FILES
// Move file to a folder (from)
export const moveFileToFolder = async (userID, fileID, folderID) => {
    try {
        let originalFile = await getFileInfo(fileID);
        if (!originalFile) throw new Error("File not found.");
        if (userID !== originalFile.userID) throw new Error("Unauthorized file moving request")

        const toFolder = await getFolderInfo(folderID);
        if (!toFolder) throw new Error("Folder-to not found.");
        if (userID !== toFolder.userID) throw new Error("Unauthorized to folder access.")

        if (originalFile.folder !== '') {
            const fromFolder = await getFolderInfo(originalFile.folder)
            if (!fromFolder) throw new Error("Folder-from not found.");
            if (fromFolder.userID !== userID) throw new Error("Unauthorized from folder access.");
            await updateFolderFileCount(fromFolder.folderID, -1)
        }

        // update the folder (on file doc)
        originalFile = {
            ...originalFile,
            folder: toFolder.folderID,
        }

        const fileRef = doc(db, "files", originalFile.fileID);
        await updateDoc(fileRef, originalFile);
        await updateFolderFileCount(toFolder.folderID, 1)
    } catch (error) {
        console.error("Error moving file to folder: ", error);
    }
}

// SUPPORT FUNCTIONS
// transform file data to public file data
const transformFileDataPublic = (file) => {
    return {
        id: file.fileID,
        docType: file.docType,
        name: file.fileName,
        size: file.fileSize,
        type: file.fileType,
        url: file.fileUrl,
        shortUrl: file.shortUrl,
        folder: file.folderID,
        shared: file.shared,
        sharedWith: file.sharedWith,
        passwordProtected: file.pwdProtected,
        password: '',
        uploadedBy: file.uploadedBy,
        user: {
            id: file.userID,
            name: file.uploadedBy,
            email: file.userEmail
        },
        uploadedAt: new Date(file.uploadedAt.seconds * 1000),
        modifiedAt: new Date(file.modifiedAt.seconds * 1000)
    };
}

// transform file data to private file data
const transformFileDataPrivate = (file) => {
    return {
        fileID: file.id,
        docType: file.docType,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        fileUrl: file.url,
        shortUrl: file.shortUrl,
        folderID: file.folder,
        shared: file.shared,
        sharedWith: file.sharedWith,
        pwdProtected: file.passwordProtected,
        pwd: file.password,
        uploadedBy: file.user.name,
        userEmail: file.user.email,
        userID: file.user.id,
        uploadedAt: file.uploadedAt instanceof Date ? file.uploadedAt : new Date(file.uploadedAt.seconds * 1000),
        modifiedAt: file.modifiedAt instanceof Date ? file.modifiedAt : new Date(file.modifiedAt.seconds * 1000)
    };
}