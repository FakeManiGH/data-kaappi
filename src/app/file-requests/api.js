"use server"
import { getStorage, ref, deleteObject } from "firebase/storage";
import { doc, setDoc, deleteDoc, getDoc, updateDoc, orderBy, collection, query, where, getDocs, limit } from "firebase/firestore";
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
    const desertRef = ref(storage, `file-base/${file.fileID}`);

    try {
        await deleteDoc(doc(db, "files", file.fileID));
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
