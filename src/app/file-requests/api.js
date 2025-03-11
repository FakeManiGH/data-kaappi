"use server"
import { getStorage, ref, deleteObject } from "firebase/storage";
import { doc, setDoc, deleteDoc, getDoc, updateDoc, orderBy, collection, query, where, getDocs, limit, increment } from "firebase/firestore";
import { db } from '@/../firebaseConfig';
import bcrypt from 'bcrypt';


// Config
const storage = getStorage();


// USER MANAGEMENT FUNCTIONS
// Create user document
export const createUserDocument = async (user) => {
    try {
        await setDoc(doc(db, 'users', user.id), {
            id: user.id,
            userEmail: user.primaryEmailAddress.emailAddress,
            name: user.fullName,
            role: 'user',
            created: new Date(),
            usedSpace: 0,
            totalSpace: 1073741824 // 1 Gt
        })
    } catch (error) {
        console.error("Error creating user: ", error)
    }
}

// Get user document
export const getUser = async (userID) => {
    try {
        const userDocRef = doc(db, 'users', userID)
        const docSnap = await getDoc(userDocRef)
        return docSnap.data()
    } catch (error) {
        console.error("Error fetching user: ", error)
    }
}

// Update user document
export const updateUserDocumentValue = async (userID, key, value) => {
    const userDocRef = doc(db, 'users', userID)
    try {
        await updateDoc(userDocRef, { [key]: value })
    } catch (error) {
        console.error("Error updating user: ", error)
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
export const getFiles = async (userID) => {
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
        return files;
    } catch (error) {
        console.error("Error fetching files: ", error);
    }
}

// Get folderless files
export const getFolderlessFiles = async (userID) => {
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
        const publicFiles = files.map(file => {
            return {
                id: file.fileID,
                name: file.fileName,
                size: file.fileSize,
                type: file.fileType,
                url: file.fileUrl,
                shortUrl: file.shortUrl,
                folder: file.folder,
                shared: file.shared,
                password: file.password ? true : false,
                uploadedBy: file.uploadedBy,
                user: {
                    id: file.userID,
                    name: file.userName,
                    email: file.userEmail
                },
                uploadedAt: file.uploadedAt
            };
        });
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
// Update document
export const updateDocumentValue = async (fileID, key, value) => {
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


// FOLDER FUNCTIONS
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
export const getFolders = async (userID) => {
    try {
        console.log('Fetching folders for userID:', userID);
        const q = query(collection(db, "folders"), where("userID", "==", userID));
        const querySnapshot = await getDocs(q);
        const folders = querySnapshot.docs.map(doc => doc.data());
        const publicFolders = folders.map(folder => {
            return {
                id: folder.folderID,
                name: folder.folderName,
                parentID: folder.parentFolderID,
                fileCount: folder.fileCount,
                user: {
                    id: folder.userID,
                    name: folder.userName,
                    email: folder.userEmail
                },
                created: folder.createdAt,
                modified: folder.modifiedAt,
                files: folder.files,
                password: folder.password ? true : false,
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

