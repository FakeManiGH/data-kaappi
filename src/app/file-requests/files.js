"use server"
import { getStorage, ref, deleteObject } from "firebase/storage";
import { 
    doc, setDoc, deleteDoc, getDoc, updateDoc, orderBy, collection, query, where, getDocs, limit, increment, 
    runTransaction, startAfter 
} from "firebase/firestore";
import { db } from '@/../firebaseConfig';
import bcrypt from 'bcrypt';
import { fileNameRegex, passwordRegex } from "@/utils/Regex";
import { transformFileDataPrivate, transformFileDataPublic } from "@/utils/DataTranslation";
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
    try {
        const docRef = doc(db, 'files', fileID)
        const docSnap = await getDoc(docRef)
        if (!docSnap.exists()) {
            return { success: false, message: `Tiedostoa ${file.fileID} ei löytynyt.` }
        } 
        const data = docSnap.data();

        // Shared?
        if (!data.linkShare && userID !== data.userID) {
            return { success: false, message: 'Sisältö ei ole saatavilla tai sitä ei ole jaettu.'}
        }

        // Shared in Group
        // TO DO!

        // Password protection?
        if (data.pwdProtected && userID !== data.userID) {
            return { success: true, password: true }
        }
        const file = transformFileDataPublic(data);
        return { success: true, data: file };
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
        // Original data
        const fileRef = doc(db, 'files', fileID);
        const docSnap = await getDoc(fileRef);

        if (!docSnap.exists()) {
            throw new Error("Tiedostoa ei löytynyt.");
        }

        const originalFile = docSnap.data();

        // Authorization
        if (userID !== originalFile.userID) {
            throw new Error("Luvaton muutospyyntö.");
        }

        // Data validation
        if (!fileNameRegex.test(newName)) {
            throw new Error("Virheellinen kansion nimi. Nimen tulee olla 2-50 merkkiä pitkä, eikä se saa sisältää <, >, /, \\ merkkejä.");
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
        // Original data
        const fileRef = doc(db, 'files', fileID);
        const docSnap = await getDoc(fileRef);

        if (!docSnap.exists()) {
            return { success: false, message: 'Tiedostoa ei löytynyt.' }
        }

        const file = docSnap.data();

        // Authorization
        if (userID !== file.userID) {
            return { success: false, message: 'Luvaton muutospyyntö.' }
        }

        // Data validation
        if (!passwordRegex.test(password)) {
            return { success: false, message: 'Salasana ei voi sisältää <, >, /, \\ -merkkejä.' }
        }

        // Password hash
        const salt = bcrypt.genSaltSync(13)
        const hashPass = bcrypt.hashSync(password, salt)

        // Update password in db
        await updateDoc(fileRef, { pwd: hashPass, pwdProtected: true });
        return { success: true, message: "Salasana tallennettu." };
    } catch (error) {
        console.error("Error updating file password: ", error);
        return { success: false, message: 'Virhe salasanaa asettaessa, yritä uudelleen.' };
    }
}

// Remove file password
export const removeFilePassword = async (userID, fileID) => {
    try {
        // Original
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
// Delete file
export const deleteFile = async (userID, fileID) => {
    try {
        // Firestore transaction
        await runTransaction(db, async (transaction) => {
            const fileRef = doc(db, "files", fileID);
            const fileSnap = await transaction.get(fileRef);

            if (!fileSnap.exists()) {
                return { success: false, message: `Tiedostoa ${fileID} ei löytynyt.`}
            }
                
            const file = fileSnap.data();
            if (userID !== file.userID) {
                return { success: false, message: `Luvaton poistamispyyntö tiedostolle ${file.fileName}.`}
            }

            // User document
            const userRef = doc(db, "users", userID);
            const userSnap = await transaction.get(userRef);
            const userDoc = userSnap.data();
            if (userDoc.usedSpace < file.fileSize) {
                return { success: false, message: 'Käyttäjän tallennustilan käyttö ei voi olla negatiivinen.'}
            }

            // Handle possible folder fileCount
            if (file.folderID) {
                const folderRef = doc(db, "folders", file.folderID);
                const folderSnap = await transaction.get(folderRef);

                if (!folderSnap.exists()) {
                    return { success: false, message: `Tiedoston ${file.fileName} kansioita ei löytynyt. Yritä uudelleen.`}
                }

                const folder = folderSnap.data();

                if (folder.fileCount <= 0) {
                    return { success: false, message: `Kansion ${folder.folderName} tiedostomäärä ei voi olla negatiivine.`}
                }

                transaction.update(folderRef, { fileCount: increment(-1) });
            }

            // Update user space
            transaction.update(userRef, { usedSpace: increment(-file.fileSize) });

            // Delete the file document
            transaction.delete(fileRef);
        });

        // Delete the file from Firebase Storage
        const fileStorageRef = ref(storage, `file-base/${userID}/${fileID}`);
        await deleteObject(fileStorageRef);

        // Log the storage transaction
        console.log(`File deleted: ${fileID}, User: ${userID}`);

        return { success: true, message: "Tiedosto poistettu onnistuneesti." };
    } catch (error) {
        console.error("Error deleting file: ", error);
        return { success: false, message: `Tiedoston ${fileID} poistaminen epäonnistui. Yritä uudelleen.` };
    }
};





// MOVING FILES
export const moveFileToFolder = async (userID, fileID, folderID) => {
    try {
        if (!userID) {
            return { success: false, message: 'Käyttäjätietoja ei löytynyt.' };
        }

        await runTransaction(db, async (transaction) => {
            const fileRef = doc(db, "files", fileID);
            const fileSnap = await transaction.get(fileRef);

            if (!fileSnap.exists()) {
                return { success: false, message: 'Siirrettävää tiedostoa ei löydy.' }
            }

            const file = fileSnap.data();

            if (userID !== file.userID) {
                return { success: false, message: `Ei siirto-oikeutta tiedostoon ${file.fileName}.` }
            }

            // Handle target folder
            const toFolderRef = doc(db, "folders", folderID);
            const toFolderSnap = await transaction.get(toFolderRef);

            if (!toFolderSnap.exists()) {
                transaction.update(fileRef, {
                    folderID: null,
                });
        
                if (file.folderID) {
                    const fromFolderRef = doc(db, "folders", file.folderID);
                    transaction.update(fromFolderRef, { fileCount: increment(-1) });
                }
    
                return { success: true };
            }

            const toFolder = toFolderSnap.data();

            if (userID !== toFolder.userID) {
                return { success: false, message: `Ei oikeuksia kansioon ${toFolder.folderName}.` }
            }

            // Handle from folder (if applicable)
            const fromFolderID = file.folderID;
            if (fromFolderID) {
                const fromFolderRef = doc(db, "folders", fromFolderID);
                const fromFolderSnap = await transaction.get(fromFolderRef);

                if (!fromFolderSnap.exists()) {
                    return { success: false, message: `Kansiota ${fromFolderID} ei löydy.` }
                }

                const fromFolder = fromFolderSnap.data();

                if (userID !== fromFolder.userID) {
                    return { success: false, message: `Ei oikeuksia kansioon ${fromFolder.folderName}.` }
                }

                // Prevent same folder transfer
                if (toFolder.folderID == fromFolder.folderID) {
                    return { success: false, message: `Tiedosto on jo kansiossa ${toFolder.folderName}.` }
                };

                // Prevent negative fileCount
                if (fromFolder.fileCount <= 0) {
                    return { success: false, message: `Kansion ${fromFolder.folderName} tiedostomäärä ei voi olla negatiivinen.` }
                }

                // Decrement file count in the "from folder"
                transaction.update(fromFolderRef, { fileCount: increment(-1) });
            }

            // Update the file's folderID
            transaction.update(fileRef, { folderID });

            // Increment file count in the "to folder"
            transaction.update(toFolderRef, { fileCount: increment(1) });
        });

        // Log the successful operation
        console.log(`File ${fileID} moved to folder ${folderID} by user ${userID}.`);

        return { success: true, message: "Tiedosto siirretty onnistuneesti." };
    } catch (error) {
        console.error("Error moving file to folder: ", error);
        return { success: false, message: "Tiedoston siirtäminen epäonnistui. Yritä uudelleen." };
    }
};




// SHARING FILES
// Changing file link sharing
export const setFileLinkSharing = async (userID, fileID, shareValue) => {
    try {
        const fileRef = doc(db, "files", fileID);
        const fileSnap = await getDoc(fileRef);

        if (!fileSnap.exists()) {
            return { success: false, message: `Tiedostoa ${fileID} ei löytynyt.` }
        }

        const file = fileSnap.data();

        if (userID !== file.userID) {
            return { success: false, message: 'Luvaton muutospyyntö.' }
        }

        await updateDoc(fileRef, { linkShare: shareValue });

        return { success: true }
    } catch (error) {
        console.error("Error changing file link sharing: " + error);
        return { success: false, message: 'Tiedoston jako-asetusten muuttaminen epäonnistui, yritä uudelleen.'}
    }
} 