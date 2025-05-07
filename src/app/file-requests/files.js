"use server"
import { getStorage, ref, deleteObject } from "firebase/storage";
import { 
    doc, setDoc, deleteDoc, getDoc, updateDoc, orderBy, collection, query, where, getDocs, limit, increment, 
    runTransaction, startAfter, 
    arrayUnion
} from "firebase/firestore";
import { db } from '@/../firebaseConfig';
import bcrypt from 'bcrypt';
import { fileNameRegex, passwordRegex } from "@/utils/Regex";
import { transformFileDataPublic } from "@/utils/DataTranslation";
import { traceId } from "next/dist/trace/shared";
import { trace } from "next/dist/trace";

// Config
const storage = getStorage();

// GET FILE FUNCTIONS
// Get file info by fileID
export const getFileInfo = async (fileID) => {
    try {
        const docRef = doc(db, 'files', fileID)
        const docSnap = await getDoc(docRef)
        const data = docSnap.data()
        return data;
    } catch (error) {
        console.error("Error fetching file: ", error)
    }
}

// Get filepage info
export const getFilePageInfo = async (userID, fileID) => {
    if (!userID || !fileID) {
        return { success: false, message: 'Pyynnöstä puuttuu tietoja.' } 
    }

    try {
        const fileRef = doc(db, 'files', fileID)
        const fileSnap = await getDoc(fileRef)

        if (!fileSnap.exists()) {
            return { success: false, message: `Tiedostoa ${fileID} ei löytynyt.` }
        } 

        const fileTemp = fileSnap.data();

        // Auth
        if (userID !== fileTemp.userID) {
            return { success: false, message: 'Ei tarvittavia oikeuksia tiedostoon.' }
        }

        // Transform data
        const file = transformFileDataPublic(fileTemp);

        // Possible share groups
        let groups;
        if (fileTemp.shareGroups.length) {
            const shareGroups = await Promise.all(
                fileTemp.shareGroups.map(async (groupID) => {
                    try {
                        const groupRef = doc(db, "groups", groupID);
                        const groupSnap = await getDoc(groupRef);
        
                        if (groupSnap.exists()) {
                            const groupData = groupSnap.data();
                            return { id: groupID, name: groupData.groupName }; // Create object with id and name
                        } else {
                            console.warn(`Group with ID ${groupID} not found.`);
                            return null; // Handle missing group
                        }
                    } catch (error) {
                        console.error(`Error fetching group with ID ${groupID}:`, error);
                        return null; // Handle fetch error
                    }
                })
            );
        
            // Filter out any null values (in case of errors or missing groups)
            const validShareGroups = shareGroups.filter((group) => group !== null);
            groups = [...validShareGroups];

            console.log(validShareGroups); // Array of { id, name } objects
        }
        
        // Possible folder data
        if (fileTemp.folderID && fileTemp.folderID.length) {
            const folderRef = doc(db, "folders", fileTemp.folderID);
            const folderSnap = await getDoc(folderRef);

            if (!folderSnap.exists()) {
                return { success: true, file: file, error: 'Tiedoston kansiota ei löytynyt.' }
            }

            const folderTemp = folderSnap.data();
            const folder = {
                id: folderTemp.folderID,
                name: folderTemp.folderName
            }

            return { success: true, file: file, folder: folder, shareGroups: groups }
        } else {
            return { success: true, file: file, shareGroups: groups }
        }
    } catch (error) {
        console.error("Error fetching file: ", error);
        return { success: false, message: "Tiedoston hakemisessa tapahtui virhe, yritä uudelleen."}
    }
}

// Get user files by userID
export const getUserFiles = async (userID) => {
    try {
        const q = query(collection(db, "files"), where("userID", "==", userID));
        const querySnapshot = await getDocs(q);
        const files = querySnapshot.docs.map(doc => doc.data());
        const publicFiles = files.map(file => transformFileDataPublic(file));
        publicFiles.sort((a, b) => b.uploadedAt - a.uploadedAt);
        return publicFiles;
    } catch (error) {
        console.error("Error fetching files: ", error);
    }
}

// Get user base files
export const getUserBaseFiles = async (userID) => {
    try {
        if (!userID) {
            return { success: false, message: 'Käyttäjätietoja ei löytynyt.'}
        }

        const q = query(
            collection(db, "files"),
            where("folderID", "==", null),
            where("userID", "==", userID),
            orderBy("uploadedAt", "asc")
        );

        const querySnapshot = await getDocs(q);
        const files = querySnapshot.docs.map(doc => doc.data());
        const publicFiles = files.map(file => transformFileDataPublic(file));
        return { success: true, files: publicFiles }
    } catch (error) {
        console.error("Error fetching files: ", error);
        return { success: false, message: 'Tiedostojen hakemisessa tapahtui virhe, yritä uudelleen.' }
    }
}

// Get initial files for browse
export const getUserBrowsingFilesFirst = async (userID) => {
    try {
        if (!userID) {
            return { success: false, message: 'Käyttäjätietoja ei löytynyt.' };
        }

        let q = query(
            collection(db, "files"),
            where("userID", "==", userID),
            orderBy("uploadedAt", "asc"),
            limit(2)
        );

        const querySnapshot = await getDocs(q);

        // Get last document
        const lastVisible = querySnapshot.docs[querySnapshot.docs.length-1];

        // Map the documents
        const files = querySnapshot.docs.map((doc) => doc.data());
        const publicFiles = files.map((file) => transformFileDataPublic(file));

        return { success: true, files: publicFiles, last: lastVisible };
    } catch (error) {
        console.error("Error fetching new patch of files: ", error);
        return { success: false, message: 'Tiedostojen hakemisessa tapahtui virhe. Yritä uudelleen.' };
    }
};

// Get further files for browse
export const getUserBrowsingFilesSecondary = async (userID, lastDoc) => {
    try {
        if (!userID) {
            return { success: false, message: 'Käyttäjätietoja ei löytynyt.' };
        }

        let q = query(
            collection(db, "files"),
            where("userID", "==", userID),
            orderBy("uploadedAt", "asc"),
            startAfter(lastDoc),
            limit(2)
        );

        const querySnapshot = await getDocs(q);

        // Get last document
        const lastVisible = querySnapshot.docs[querySnapshot.docs.length-1];

        // Map the documents to file data
        const files = querySnapshot.docs.map((doc) => doc.data());
        const publicFiles = files.map((file) => transformFileDataPublic(file));

        return { success: true, files: publicFiles, last: lastVisible };
    } catch (error) {
        console.error("Error fetching new patch of files: ", error);
        return { success: false, message: 'Tiedostojen hakemisessa tapahtui virhe. Yritä uudelleen.' };
    }
};




// PASSWORD VERIFICATION
// Verify file pwd and return file.
export const verifyFilePassword = async (fileID, password) => {
    try {
        const fileRef = doc(db, "files", fileID);
        const fileSnap = await getDoc(fileRef);

        if (!fileSnap.exists()) {
            return { success: false, message: 'Tiedostoa ei löytynyt.' }
        }

        const fileTemp = fileSnap.data();
        const valid = await bcrypt.compare(password, fileTemp.pwd);

        if (valid) {
            const file = transformFileDataPublic(fileTemp)
            return { success: true, data: file }
        } else { 
            return { success: false, message: 'Voi ei! Virheellinen salasana.'}
        }

    } catch (error) {
        console.error("Error verifying password: " + error);
        return { success: false, message: 'Salasanan vahvistuksessa tapahtui virhe, yritä uudelleen.'}
    }
}


// UPDATE FILE FUNCTIONS
// Update file name
export const updateFileName = async (userID, fileID, newName) => {
    try {
        if (!userID || !fileID || !newName) {
            return { success: false, message: 'Pyynnöstä puuttuu tietoja.' }
        }

        // Name validation
        if (!fileNameRegex.test(newName)) {
            return { success: false, message: 'Tiedoston nimen tulee olla 1-75 merkkiä pitkä, eikä se saa sisältää <, >, /, \\ -merkkejä.' }
        }

        // Data
        const fileRef = doc(db, 'files', fileID);
        const docSnap = await getDoc(fileRef);

        if (!docSnap.exists()) {
           return { success: false, message: `Tiedostoa ${fileID} ei löytynyt.` }
        }

        const originalFile = docSnap.data();

        // Authorization
        if (userID !== originalFile.userID) {
            return { success: false, message: 'Ei tarvittavia oikeuksia tiedostoon.' }
        }

        // Update 
        await updateDoc(fileRef, { fileName: newName });
        return { success: true, message: "Tiedoston nimi päivitetty." };
    } catch (error) {
        console.error("Error updating file name: ", error);
        return { success: false, message: error.message };
    }
};

// Set or update file password
export const updateFilePassword = async (userID, fileID, password) => {
    try {
        if (!userID || !fileID || !password) {
            return { success: false, message: 'Pyynnöstä puuttuu tietoja.' }
        }

        // PWD validation
        if (!passwordRegex.test(password)) {
            return { success: false, message: 'Salasanan tulee olla vähintään 4 merkkiä pitkä, eikä saa sisältää <, >, /, \\ -merkkejä.' }
        }

        // Data
        const fileRef = doc(db, 'files', fileID);
        const docSnap = await getDoc(fileRef);

        if (!docSnap.exists()) {
            return { success: false, message: `Tiedostoa ${fileID} ei löytynyt.` }
        }

        const file = docSnap.data();

        // Authorization
        if (userID !== file.userID) {
            return { success: false, message: 'Ei tarvittavia oikeuksia tiedostoon.' }
        }

        // Hash
        const salt = bcrypt.genSaltSync(13)
        const hashPass = bcrypt.hashSync(password, salt)

        // Update 
        await updateDoc(fileRef, { pwd: hashPass, pwdProtected: true });
        return { success: true, message: 'Tiedoston salasana tallennettu.' };
    } catch (error) {
        console.error("Error updating file password: ", error);
        return { success: false, message: 'Salasanan tallentamisessa tapahtui virhe, yritä uudelleen.' };
    }
}

// Remove file password
export const removeFilePassword = async (userID, fileID) => {
    try {
        if (!userID || !fileID) {
            return { success: false, message: 'Pyynnöstä puuttuu tietoja.' } 
        }

        // Data
        const fileRef = doc(db, 'files', fileID);
        const docSnap = await getDoc(fileRef);

        if (!docSnap.exists()) {
            return { success: false, message: 'Tiedostoa ei löytynyt.' }
        }

        const originalFile = docSnap.data();

        // Authorization
        if (userID !== originalFile.userID) {
            return { success: false, message: 'Luvaton muutospyyntö.' }
        }

        // Update
        await updateDoc(fileRef, { pwd: '', pwdProtected: false });
        return { success: true, message: "Salasana poistettu käytöstä." };

    } catch (error) {
        console.error("Error removing file password: ", error);
        return { success: false, message: 'Virhe salasanaa poistaessa, yritä uudelleen.' };
    }
}


// DELETE FILE FUNCTIONS
// Delete file (document & physical file)
export const deleteFile = async (userID, fileID) => {
    if (!userID || !fileID) {
        return { success: false, message: 'Pyynnöstä puuttuu tietoja.' };
    }

    try {
        let docDelete = false;

        const fileRef = doc(db, "files", fileID);
        const fileSnap = await getDoc(fileRef);

        if (!fileSnap.exists()) {
            return { success: false, message: `Tiedostoa ${fileID} ei löytynyt.` };
        }

        const file = fileSnap.data();

        // Authorization
        if (userID !== file.userID) {
            return { success: false, message: `Luvaton poistamispyyntö tiedostolle ${file.fileName}.` };
        }

        // User document
        const userRef = doc(db, "users", userID);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
            return { success: false, message: 'Käyttäjätietoja ei löytynyt.' };
        }

        const userDoc = userSnap.data();

        // Space confirmation (negative space size)
        if (userDoc.usedSpace < file.fileSize) {
            return { success: false, message: 'Käyttäjän tallennustilan käyttö ei voi olla negatiivinen.' };
        }

        // Check possible folder
        const folderRef = file.folderID ? doc(db, "folders", file.folderID) : null;
        const folderSnap = folderRef ? await getDoc(folderRef) : null;

        if (folderSnap && folderSnap.exists()) {
            const folder = folderSnap.data();

            // Folder file count (no negative values allowed)
            if (folder.fileCount <= 0) {
                return { success: false, message: `Kansion ${folder.folderName} tiedostomäärä ei voi olla negatiivinen.` };
            }
        }

        // Document updates
        await runTransaction(db, async (transaction) => {
            if (folderSnap && folderSnap.exists()) {
                transaction.update(folderRef, { fileCount: increment(-1) }); // Folder file count
            }
            transaction.update(userRef, { usedSpace: increment(-file.fileSize) }); // User space
            transaction.delete(fileRef); // Delete file doc

            docDelete = true; // Doc deleted
        });

        // Physical file delete
        if (docDelete) {
            const fileStorageRef = ref(storage, `file-base/${userID}/${fileID}`);
            try {
                await deleteObject(fileStorageRef);
                console.log(`File ${fileID} deleted by user: ${userID}`);
                return { success: true, message: "Tiedosto poistettu onnistuneesti." };
            } catch (error) {
                console.error(`Failed to delete physical file ${fileID}:`, error);

                // Undo document changes
                await runTransaction(db, async (transaction) => {
                    if (folderSnap && folderSnap.exists()) {
                        transaction.update(folderRef, { fileCount: increment(1) }); // Restore folder file count
                    }
                    transaction.update(userRef, { usedSpace: increment(file.fileSize) }); // Restore user space
                    transaction.set(fileRef, file); // Restore file document
                });

                return { success: false, message: 'Fyysisen tiedoston poistaminen epäonnistui. Tiedot palautettu.' };
            }
        } else {
            return { success: false, message: 'Tiedoston tietojen poistaminen epäonnistui.' };
        }
    } catch (error) {
        console.error("Error deleting file: ", error);
        return { success: false, message: `Tiedoston ${fileID} poistaminen epäonnistui. Yritä uudelleen.` };
    }
};





// MOVING FILES
export const transferFileToFolder = async (userID, fileID, targetID) => {
    try {
        if (!userID || !fileID || targetID === undefined) {
            return { success: false, message: 'Pyynnöstä puuttuu tietoja.' };
        }

        // File data
        const fileRef = doc(db, "files", fileID);
        const fileSnap = await getDoc(fileRef);

        if (!fileSnap.exists()) {
            return { success: false, message: `Siirrettävää tiedostoa ${fileID} ei löytynyt.` };
        }

        const file = fileSnap.data();

        // File authorization
        if (userID !== file.userID) {
            return { success: false, message: `Ei tarvittavia oikeuksia tiedostoon ${file.fileName}.` };
        }

        // Handle target folder
        const toFolderRef = targetID ? doc(db, "folders", targetID) : null;
        const toFolderSnap = targetID ? await getDoc(toFolderRef) : null;

        if (targetID && (!toFolderSnap || !toFolderSnap.exists())) {
            return { success: false, message: `Kohdekansiota ${targetID} ei löytynyt.` };
        }

        const toFolder = toFolderSnap ? toFolderSnap.data() : null;

        if (toFolder && toFolder.userID !== userID) {
            return { success: false, message: `Ei tarvittavia oikeuksia kansioon ${toFolder.folderName}.` };
        }

        // Prevent transferring to the same folder
        if (String(file.folderID) === String(targetID)) {
            return { success: false, message: `Tiedosto sijaitsee jo kansiossa ${toFolder.folderName || 'pohjakansio'}.` };
        }

        // Handle from folder
        const fromFolderRef = file.folderID ? doc(db, "folders", file.folderID) : null;
        const fromFolderSnap = file.folderID ? await getDoc(fromFolderRef) : null;

        if (file.folderID && (!fromFolderSnap || !fromFolderSnap.exists())) {
            return { success: false, message: 'Tiedoston nykyistä sijaintia ei pystytty määrittämään.' };
        }

        const fromFolder = fromFolderSnap ? fromFolderSnap.data() : null;

        if (fromFolder && fromFolder.userID !== userID) {
            return { success: false, message: `Ei tarvittavia oikeuksia tiedoston nykyiseen kansioon ${fromFolder.folderName}` };
        }

        // Transactions
        await runTransaction(db, async (transaction) => {
            transaction.update(fileRef, { folderID: targetID || null });

            if (toFolder) {
                transaction.update(toFolderRef, { fileCount: increment(1) });
            }

            if (fromFolder) {
                transaction.update(fromFolderRef, { fileCount: increment(-1) });
            }
        });

        console.log(`File ${fileID} moved from ${file.folderID || 'base'} to ${targetID || 'base'} by user ${userID}.`);
        return { success: true, message: "Tiedosto siirretty onnistuneesti." };
    } catch (error) {
        console.error("Error moving file to folder: ", error);
        return { success: false, message: `Tiedoston siirtäminen epäonnistui: ${error.message}` };
    }
};





// SHARING FILES
// Changing file link sharing
export const changeFileLinkSharing = async (userID, fileID, shareValue) => {
    if (!userID || !fileID) {
        return { success: false, message: 'Pyynnöstä puuttuu tietoja.'}
    }

    try {
        const fileRef = doc(db, "files", fileID);
        const fileSnap = await getDoc(fileRef);

        if (!fileSnap.exists()) {
            return { success: false, message: `Tiedostoa ${fileID} ei löytynyt.` }
        }

        const file = fileSnap.data();

        // Auth
        if (userID !== file.userID) {
            return { success: false, message: 'Luvaton muutospyyntö.' }
        }

        // Update
        await updateDoc(fileRef, { linkShare: shareValue });

        return { success: true }
    } catch (error) {
        console.error("Error changing file link sharing: " + error);
        return { success: false, message: 'Tiedoston jako-asetusten muuttaminen epäonnistui, yritä uudelleen.'}
    }
} 

// Changing file group sharing status
export const changeFileGroupSharingStatus = async (userID, fileID, groupIDarray) => {
    try {
        if (!userID || !fileID) {
            return { success: false, message: 'Pyynnöstä puuttuu tietoja.' };
        }

        const fileRef = doc(db, "files", fileID);
        const fileSnap = await getDoc(fileRef);

        if (!fileSnap.exists()) {
            return { success: false, message: `Tiedostoa ${fileID} ei löytynyt.` };
        }

        const file = fileSnap.data();

        if (userID !== file.userID) {
            return { success: false, message: 'Sinulla ei ole tarvittavia oikeuksia tiedostoon.' };
        }

        // Handle empty groupIDarray
        if (!groupIDarray || groupIDarray.length === 0) {
            console.log(`Group sharing disabled for file ${fileID}`);
            await updateDoc(fileRef, { shareGroups: [] });
            return { success: true, message: 'Tiedoston jakaminen ryhmissä poistettu käytöstä.' };
        }

        // Validate groups in parallel
        const validationResults = await Promise.all(
            groupIDarray.map(async (groupID) => {
                try {
                    if (groupID.length !== 11) {
                        return { groupID, valid: false, error: `Virheellinen ryhmä ${groupID}.` };
                    }

                    const groupRef = doc(db, "groups", groupID);
                    const groupSnap = await getDoc(groupRef);

                    if (!groupSnap.exists()) {
                        return { groupID, valid: false, error: `Ryhmää ${groupID} ei löytynyt.` };
                    }

                    const group = groupSnap.data();

                    if (!group.groupMembers || !group.groupMembers.includes(userID)) {
                        return { groupID, valid: false, error: `Et ole ryhmän ${groupID} jäsen.` };
                    }

                    return { groupID, valid: true };
                } catch (error) {
                    console.error(`Error validating group ${groupID}:`, error);
                    return { groupID, valid: false, error: `Virhe ryhmän ${groupID} käsittelyssä.` };
                }
            })
        );

        const validGroups = validationResults.filter((result) => result.valid).map((result) => result.groupID);
        const groupErrors = validationResults.filter((result) => !result.valid).map((result) => result.error);

        // No valid groups
        if (validGroups.length === 0) {
            console.log(`User ${userID} is not a member of any valid groups.`);
            return { success: false, message: 'Ei kelvollisia ryhmiä, missä jakaa tiedosto.', errors: groupErrors };
        }

        // Update
        try {
            await updateDoc(fileRef, {
                shareGroups: arrayUnion(...validGroups),
            });

            console.log(`File ${fileID} updated and now shared in groups: ${validGroups}`);
            return {
                success: true,
                message: 'Tiedosto jaettu onnistuneesti valituissa ryhmissä.',
                errors: groupErrors,
            };
        } catch (error) {
            console.error("Error updating files group sharing status: ", error);
            return { success: false, message: 'Tiedoston jakaminen ryhmissä epäonnistui. Yritä uudelleen.' };
        }
    } catch (error) {
        console.error(`Error sharing file ${fileID} in groups ${groupIDarray}: ${error}`);
        return { success: false, message: 'Tiedoston jakaminen ryhmissä epäonnistui. Yritä uudelleen.' };
    }
}