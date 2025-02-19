import { getStorage, ref, deleteObject } from "firebase/storage";
import { doc, setDoc, deleteDoc, getDoc, updateDoc } from "firebase/firestore";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from '@/../firebaseConfig';
import { formatDateToCollection } from "@/utils/DataTranslation";
import { set } from "date-fns";

// Config
const storage = getStorage();


// USER MANAGEMENT FUNCTIONS
// Create user
export const createUserDocument = async (user) => {
    try {
        await setDoc(doc(db, 'users', user.id), {
            id: user.id,
            userEmail: user.primaryEmailAddress.emailAddress,
            name: user.fullName,
            role: 'user',
            created: formatDateToCollection(new Date()),
            usedSpace: 0,
            totalSpace: 1000000000
        })
    } catch (error) {
        console.error("Error creating user: ", error)
    }
}

// Get user
export const getUser = async (userID) => {
    try {
        const userDocRef = doc(db, 'users', userID)
        const docSnap = await getDoc(userDocRef)
        return docSnap.data()
    } catch (error) {
        console.error("Error fetching user: ", error)
    }
}


// DELETE FILE FUNCTIONS
// Delete file
export const deleteFile = async (file) => {
    const desertRef = ref(storage, `file-base/${file.fileName}`);

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
        return docSnap.data()
    } catch (error) {
        console.error("Error fetching file: ", error)
    }
}

// Get files
export const getFiles = async (userID) => {
    try {
        const q = query(collection(db, "files"), where("owner", "==", userID));
        const querySnapshot = await getDocs(q);
        const files = querySnapshot.docs.map(doc => doc.data())
        return files
    } catch (error) {
        console.error("Error fetching files: ", error)
    }
}

// Get shared files
export const getSharedFiles = async () => {
    try {
        const q = query(collection(db, "files"), where("shared", "==", true));
        const querySnapshot = await getDocs(q);
        const files = querySnapshot.docs.map(doc => doc.data())
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
        await updateDoc(docRef, { key: value })
    } catch (error) {
        console.error("Error updating document: ", error)
    }
}
