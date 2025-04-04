import { generateRandomString } from "@/utils/GenerateRandomString";
import { groupDescRegex, groupNameRegex } from "@/utils/Regex";
import { doc, setDoc, deleteDoc, getDoc, updateDoc, orderBy, collection, query, where, getDocs, limit, increment, Timestamp, runTransaction } from "firebase/firestore";
import { db } from '@/../firebaseConfig';
import bcrypt from 'bcrypt';


// CREATE
// Create a group
export const createGroup = async (userData, groupData) => {
    try {
        if (!userData) {
            throw new Error('Käyttäjätietoja ei löytynyt.');
        }

        const validationErrors = validateGroupdata(groupData);
        if (Object.keys(validationErrors).length > 0) {
            throw validationErrors;
        }
        
        let groupID;
        let groupExists;

        do {
            groupID = generateRandomString(11);
            const groupRef = doc(db, "groups", groupID);
            const groupSnap = await getDoc(groupRef);
            groupExists = groupSnap.exists();
        } while (groupExists);

        const newGroup = {
            docType: 'group',
            groupID: groupID,
            groupVisibility: groupData.groupVisibility,
            groupName: groupData.groupName,
            groupDesc: groupData.groupDesc,
            userID: userData.id,
            userName: userData.name,
            userEmail: userData.email,
            createdAt: Timestamp.fromDate(new Date()),
            pwdProtected: false,
            pwd: null,
            groupMembers: [userData.id]
        }

        await setDoc(doc(db, "groups", groupID), newGroup);
        return { success: true, message: 'Uusi ryhmä luotu onnistuneesti.'}
    } catch (error) {
        if (typeof error === 'object' && error !== null) {
            console.error("Validation errors:", error);
            return { success: false, errors: error }; 
        } else {
            console.error("Error creating new group:", error);
            return { success: false, message: error.message || 'Ryhmän luomisessa tapahtui virhe.' };
        }
    }
}



// SUPPORT 
// Validate new group-data
const validateGroupdata = (data) => {
    let errors = {};
    
    if (!data.groupName || data.groupName.trim() === "") {
        errors.groupName = 'Ryhmällä on olatava nimi.';
    } else if (!groupNameRegex.test(data.groupName)) {
        errors.groupName = 'Ryhmän nimen tulee olla 4-50 merkkiä pitkä, eikä se saa sisältää <, >, /, \\ -merkkejä.'
    }

    if (!data.groupDesc || data.groupDesc.length > 400) {
        errors.groupDesc = 'Kuvauksen tulee olla 0-400 merkkiä pitkä.'
    } else if (!groupDescRegex.test(data.groupDesc)) {
        errors.groupDesc = 'Ryhmän kuvauksen tulee olla 0-400 merkkiä pitkä, eikä se saa sisältää <, >, /, \\ -merkkejä.'
    }

    if (data.groupVisibility !== 'private' || data.groupVisibility !== 'public') {
        errors.groupVisibility = 'Virheellinen ryhmän näkyvyys.'
    }

    if (data.pwdProtected) {
        if (!data.groupPwd || data.groupPwd.trim() === "") {
            errors.groupPwd = 'Salasana ei voi olla tyhjä.';
        } 
    }

    return errors;
}