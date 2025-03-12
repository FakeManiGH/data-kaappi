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

