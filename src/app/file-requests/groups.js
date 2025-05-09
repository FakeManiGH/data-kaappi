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
    if (!userData || !groupData) {
        return { success: false, message: 'Pyynnöstä puuttuu teitoja.' }
    }

    try {
        // Data validation
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

        const newGroup = {
            docType: 'group',
            groupID: groupID,
            groupVisibility: groupData.groupVisibility,
            groupName: groupData.groupName,
            groupDesc: groupData.groupDesc,
            groupCover: null,
            userID: userData.id,
            userName: userData.name,
            userEmail: userData.email,
            createdAt: Timestamp.fromDate(new Date()),
            groupMembers: [userData.id],
            groupAdmins: [userData.id]
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
    if (!userID || !groupID) {
        return { success: false, message: 'Pyynnöstä puuttuu tietoja.' }
    }

    try {
        const groupRef = doc(db, "groups", groupID);
        const groupSnap = await getDoc(groupRef);

        if (!groupSnap.exists()) {
            return { success: false, message: `Ryhmää ${groupID} ei löytynyt.` }
        }

        const groupData = groupSnap.data();

        if (!Array.isArray(groupData.groupMembers)) {
            throw new Error("Ryhmän jäsenetietoja ei voitu lukea.");
        }

        if (!groupData.groupMembers.includes(userID)) {
            return { success: false, message: `Ryhmän ${groupID} jäsenyyttä ei löytynyt.` }
        }

        // Group member info
        const result = await getGroupMemberInfo(groupData.groupMembers);

        if (result.success) {
            const members = result.members
            const group = transformGroupDataPublic(groupData);
            return { success: true, group: group, members: members }
        } else {
            return { success: false, message: 'Ryhmän käyttäjätietojen hakemisessa tapahtio virhe, yritä uudelleen.' }
        }
    } catch (error) {
        console.error("Error fetching group information: " + error);
        return { success: false, message: error.message || 'Virhe ryhmätietojen hakemisesa, yritä uudelleen.' }
    }
}

// Get group member info
export const getGroupMemberInfo = async (idArray) => {
    if (!Array.isArray(idArray) || idArray.length === 0) {
        return { success: false, message: 'Pyynnöstä puuttuu tietoja tai jäsenlista on tyhjä.' };
    }

    try {
        const memberData = await Promise.all(
            idArray.map(async (memberID) => {
                try {
                    const memberRef = doc(db, "users", memberID);
                    const memberSnap = await getDoc(memberRef);

                    if (memberSnap.exists()) {
                        const member = memberSnap.data();
                        return {
                            id: memberID,
                            name: member.name || 'Tuntematon',
                            email: member.userEmail || 'Ei sähköpostia',
                        };
                    } else {
                        console.warn(`Member with ID ${memberID} not found.`);
                        return null; // Handle missing member
                    }
                } catch (error) {
                    console.error(`Error fetching member with ID ${memberID}:`, error);
                    return null; // Handle fetch error
                }
            })
        );

        // Filter out any null values (in case of errors or missing members)
        const validMembers = memberData.filter((member) => member !== null);

        return { success: true, members: validMembers };
    } catch (error) {
        console.error("Error fetching group member information: ", error);
        return { success: false, message: 'Virhe ryhmän jäsentietojen hakemisessa, yritä uudelleen.' };
    }
};



