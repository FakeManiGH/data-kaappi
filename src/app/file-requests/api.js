"use server"
import { getStorage, ref, deleteObject } from "firebase/storage";
import { doc, setDoc, deleteDoc, getDoc, updateDoc, orderBy, collection, query, where, getDocs, limit, increment } from "firebase/firestore";
import { db } from '@/../firebaseConfig';
import bcrypt from 'bcrypt';
import { transformFileDataPublic, transformFolderDataPublic } from "@/utils/DataTranslation";


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


// GET SHARED CONTENT
// Get shared file or folder
export const getSharedFile = async (id) => {
    try {
        // Check ID for file
        const fileRef = doc(db, "files", id);
        const fileSnap = await getDoc(fileRef);

        if (!fileSnap.exists()) {
            return { success: false, message: 'Sisältöä ei löytynyt.'}
        }

        const fileTemp = fileSnap.data();

        if (!fileTemp.shared) {
            return { success: false, message: "Sisältö ei ole saatavilla."}
        }

        if (fileTemp.pwdProtected) {
            return { success: true, protected: true }
        }

        const file = transformFileDataPublic(fileTemp);
        return { success: true, data: file };
    } catch (error) {
        console.error("Error while getting content: " + error);
        return { success: false, message: "Sisällön hakemisessa tapahtui virhe, yritä uudelleen." };
    }
};


// TODO
// Get shared folder
export const getSharedFolder = async (id) => {
    try {
        // If no file, check for folder
        const folderRef = doc(db, "folders", id);
        const folderSnap = await getDoc(folderRef);

        if (!folderSnap.exists()) {
            // If neither
            return { success: false, message: "Jaettua kohdetta ei löytynyt." };
        }

        const folder = transformFolderDataPublic(folderSnap.data());

        if (!folder.shared) {
            return { success: false, message: "Sisältö ei ole saatavilla."}
        }

        // Query files inside the folder
        const q = query(
            collection(db, "files"),
            where("folderID", "==", folder.folderID),
            orderBy("uploadedAt", "asc")
        );

        const querySnapshot = await getDocs(q);

        // Collect files in the folder
        const files = querySnapshot.docs.map(doc => doc.data());
        const publicFiles = files.map(file => transformFileDataPublic(file));

        // Return the folder data along with its files
        return { success: true, type: "folder", data: { folder, publicFiles } };
    } catch (error) {

    }
}

