"use server"
import { generateRandomString } from "@/utils/GenerateRandomString";
import { doc, setDoc, deleteDoc, getDoc, updateDoc, orderBy, collection, query, where, getDocs, limit, increment, Timestamp, runTransaction } from "firebase/firestore";
import { db } from '@/../firebaseConfig';
import bcrypt from 'bcrypt';
import { validateGroupdata } from "@/utils/DataValidation";
import { transformGroupDataPublic } from "@/utils/DataTranslation";


// CREATE
// Create a group
export const createNewGroup = async (userData, groupData) => {
    try {
        if (!userData) {
            throw new Error('Käyttäjätietoja ei löytynyt.');
        }

        const validationErrors = validateGroupdata(groupData);
        if (Object.keys(validationErrors).length > 0) {
            return { success: false, errors: validationErrors }
        }
        
        let groupID;
        let groupExists;

        do {
            groupID = generateRandomString(11);
            const groupRef = doc(db, "groups", groupID);
            const groupSnap = await getDoc(groupRef);
            groupExists = groupSnap.exists();
        } while (groupExists);

        let password = null;
        if (groupData.groupPwd !== "") {
            const salt = bcrypt.genSaltSync(13)
            const hashPass = bcrypt.hashSync(groupData.groupPwd, salt)
            password = hashPass;
        }

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
            pwdProtected: !!password,
            pwd: password,
            groupMembers: [userData.id]
        }

        await setDoc(doc(db, "groups", groupID), newGroup);
        const publicGroup = transformGroupDataPublic(newGroup);
        return { success: true, message: 'Uusi ryhmä luotu onnistuneesti.', group: publicGroup }
    } catch (error) {
        console.error("Error creating new group:", error);
        return { success: false, message: 'Ryhmän luomisessa tapahtui virhe.' };
    }
}





// GET
// Get user groups
export const getUserGroups = async (userID) => {
    try {
        if (!userID) {
            return { success: false, message: 'Käyttäjäteitoja ei löytynyt.' }
        }

        const q = query(
            collection(db, "groups"),
            where("groupMembers", "array-contains", userID)
        );

        const querySnap = await getDocs(q);
        const userGroups = querySnap.docs.map((doc) => doc.data());
        const publicGroups = userGroups.map(group => transformGroupDataPublic(group));

        return { success: true, groups: publicGroups }

    } catch (error) {
        console.error("Error fetching user groups: " + error);
        return { success: false, message: 'Ryhmien hakemisessa tapahtui virhe, yritä uudelleen.' }
    }
}

// get private group infromation
export const getPrivateGroupInformation = async (userID, groupID) => {
    try {
        if (!userID) {
            throw new Error("Käyttäjätietoja ei löytynyt.");
        }

        if (!groupID) {
            throw new Error("Ryhmätietoja ei löytynyt.");
        }

        // Get data
        const groupRef = doc(db, "groups", groupID);
        const groupSnap = await getDoc(groupRef);

        if (!groupSnap.exists()) {
            return { success: false, message: `Ryhmää ${groupID} ei löytynyt.` }
        }

        // Assign data
        const groupData = groupSnap.data();

        if (!Array.isArray(groupData.groupMembers)) {
            throw new Error("Ryhmän jäsenetietoja ei voitu lukea.");
        }

        if (!groupData.groupMembers.includes(userID)) {
            return { success: false, message: `Ryhmän ${groupID} jäsenyyttä ei löytynyt.` }
        }

        // Public data
        const group = transformGroupDataPublic(groupData);

        if (groupData.pwdProtected && groupData.userID !== userID) {
            return { success: true, password: true, group: group }
        }

        return { success: true, group: group }

    } catch (error) {
        console.error("Error fetching group information: " + error);
        return { success: false, message: error.message || 'Virhe ryhmätietojen hakemisesa, yritä uudelleen.' }
    }
}




// PASSWORD
// Validate group password
export const validateGroupPassword = async (groupID, password) => {
    try {
        const groupRef = doc(db, "groups", groupID);
        const groupSnap = await getDoc(groupRef);

        if (!groupSnap.exists()) {
            return { success: false, message: `Ryhmää ${groupID} ei löytynyt.` }
        }

        const groupTemp = groupSnap.data();
        const valid = await bcrypt.compare(password, groupTemp.pwd);

        if (valid) {
            const group = transformGroupDataPublic(groupTemp)
            return { success: true, group: group }
        } else { 
            return { success: false, message: 'Voi ei! Virheellinen salasana.'}
        }

    } catch (error) {
        console.error("Error verifying password: " + error);
        return { success: false, message: 'Salasanan vahvistuksessa tapahtui virhe, yritä uudelleen.'}
    }
}



