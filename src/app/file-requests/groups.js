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



