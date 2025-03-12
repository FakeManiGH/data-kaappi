"use server"
import { getStorage, ref, deleteObject } from "firebase/storage";
import { doc, setDoc, deleteDoc, getDoc, updateDoc, orderBy, collection, query, where, getDocs, limit, increment } from "firebase/firestore";
import { db } from '@/../firebaseConfig';
import bcrypt from 'bcrypt';

// Config
const storage = getStorage();


// GET FILE FUNCTIONS
// Get file
export const getFileInfo = async (docID) => {
    try {
        const docRef = doc(db, 'files', docID)
        const docSnap = await getDoc(docRef)
        const data = docSnap.data()
        return {
            ...data,
            uploadedAt: data.uploadedAt.toDate()
        }
    } catch (error) {
        console.error("Error fetching file: ", error)
    }
}

// Get files
export const getUserFiles = async (userID) => {
    try {
        const q = query(collection(db, "files"), where("userID", "==", userID), orderBy("uploadedAt", "desc"));
        const querySnapshot = await getDocs(q);
        const files = querySnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                ...data,
                uploadedAt: data.uploadedAt.toDate() // Convert Firestore timestamp to JavaScript Date
            };
        });
        const publicFiles = files.map(file => transformFileDataPublic(file));
        return publicFiles;
    } catch (error) {
        console.error("Error fetching files: ", error);
    }
}

// Get folderless files
export const getUserRogueFiles = async (userID) => {
    try {
        const q = query(
            collection(db, "files"),
            where("folder", "==", ""),
            where("userID", "==", userID),
            orderBy("uploadedAt", "desc")
        );
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) {
            console.log("No matching documents.");
            return [];
        }
        const files = querySnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                ...data,
                uploadedAt: data.uploadedAt.toDate() // Convert Firestore timestamp to JavaScript Date
            };
        });
        const publicFiles = files.map(file => transformFileDataPublic(file));
        return publicFiles;
    } catch (error) {
        console.error("Error fetching folderless files: ", error);
    }
};

// Get shared files
export const getSharedFiles = async () => {
    try {
        const q = query(collection(db, "files"), where("shared", "==", true));
        const querySnapshot = await getDocs(q);
        const files = querySnapshot.docs.map(doc => {
            const data = doc.data()
            return {
                ...data,
                uploadedAt: data.uploadedAt.toDate() // Convert Firestore timestamp to JavaScript Date
            }
        })
        return files
    } catch (error) {
        console.error("Error fetching files: ", error)
    }
}


// UPDATE FILE FUNCTIONS
// Update file document
export const updateFile = async (file) => {
    const docRef = doc(db, 'files', file.id)
    try {
        await updateDoc(docRef, file)
    } catch (error) {
        console.error("Error updating document: ", error)
    }
}


// Update file document value
export const updateFileValue = async (fileID, key, value) => {
    const docRef = doc(db, 'files', fileID)
    try {
        await updateDoc(docRef, { [key]: value })
    } catch (error) {
        console.error("Error updating document: ", error)
    }
}

// Update file password
export const updateFilePassword = async (userID, fileID, password) => {
    try {
        if (!userID) {
            console.error("User not authenticated")
            return
        }

        const file = await getFileInfo(fileID)
        if (!file) {
            console.error("File not found")
            return
        }

        if (file.userID !== userID) {
            console.error("User does not have permission to update file")
            return
        }

        if (!password) {
            await updateDocumentValue(fileID, 'password', '')
            return
        }

        const saltRounds = 13;
        const hash = await bcrypt.hash(password, saltRounds);
        await updateDocumentValue(fileID, 'password', hash);

    } catch (error) {
        console.error("Error updating file password: ", error)
    }
}


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
        folder: file.folder,
        shared: file.shared,
        password: file.pwdProtected ? true : false,
        uploadedBy: file.uploadedBy,
        user: {
            id: file.userID,
            name: file.userName,
            email: file.userEmail
        },
        uploadedAt: file.uploadedAt
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
        folder: file.folder,
        shared: file.shared,
        pwdProtected: file.password ? true : false,
        pwd: file.password,
        uploadedBy: file.uploadedBy,
        userID: file.user.id,
        userName: file.user.name,
        userEmail: file.user.email,
        uploadedAt: file.uploadedAt
    };
}
