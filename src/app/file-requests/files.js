"use server"
import { getStorage, ref, deleteObject } from "firebase/storage";
import { doc, setDoc, deleteDoc, getDoc, updateDoc, orderBy, collection, query, where, getDocs, limit, increment, runTransaction } from "firebase/firestore";
import { db } from '@/../firebaseConfig';
import bcrypt from 'bcrypt';
import { fileNameRegex, passwordRegex } from "@/utils/Regex";
import { transformFileDataPrivate, transformFileDataPublic } from "@/utils/DataTranslation";

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
        if (!data.shared && userID !== data.userID) {
            return { success: false, message: 'Sisältö ei ole saatavilla tai sitä ei ole jaettu.'}
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

// Get files by folder
export const getUserFilesByFolder = async (userID, folderID) => {
    try {
        const q = query(
            collection(db, "files"),
            where("folderID", "==", folderID),
            where("userID", "==", userID),
            orderBy("uploadedAt", "asc")
        );
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) {
            console.log("No matching documents.");
            return [];
        }
        const files = querySnapshot.docs.map(doc => doc.data());
        const publicFiles = files.map(file => transformFileDataPublic(file));
        return publicFiles;
    } catch (error) {
        console.error("Error fetching folderless files: ", error);
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
            throw new Error("Tiedostoa ei löytynyt.");
        }

        const originalFile = docSnap.data();

        // Authorization
        if (userID !== originalFile.userID) {
            throw new Error("Luvaton muutospyyntö.");
        }

        // Data validation
        if (!passwordRegex.test(password)) {
            throw new Error("Salasana ei voi sisältää <, >, /, \\ -merkkejä.");
        }

        // Password hash
        const salt = bcrypt.genSaltSync(13)
        const hashPass = bcrypt.hashSync(password, salt)

        // Update password in db
        await updateDoc(fileRef, { pwd: hashPass, pwdProtected: true });
        return { success: true, message: "Tiedoston salasana asetettu." };
    } catch (error) {
        console.error("Error updating file password: ", error);
        return { success: false, message: error.message };
    }
}

// Remove file password
export const removeFilePassword = async (userID, fileID) => {
    try {
        // Original
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

        // Update
        await updateDoc(fileRef, { pwd: '', pwdProtected: false });
        return { success: true, message: "Salasana poistettu käytöstä." };

    } catch (error) {
        console.error("Error removing file password: ", error);
        return { success: false, message: error.message };
    }
}


// DELETE FILE FUNCTIONS
// Delete file
export const deleteFile = async (userID, fileID) => {
    try {
        // Firestore transaction
        await runTransaction(db, async (transaction) => {
            // Fetch the file
            const fileRef = doc(db, "files", fileID);
            const fileSnap = await transaction.get(fileRef);
            if (!fileSnap.exists()) throw new Error("Tiedostoa ei löytynyt.");

            const file = fileSnap.data();
            if (userID !== file.userID) throw new Error(`Ei oikeutta tiedostoon ${file.fileName}.`);

            // Handle possible folder fileCount
            if (file.folderID) {
                const folderRef = doc(db, "folders", file.folderID);
                const folderSnap = await transaction.get(folderRef);
                if (!folderSnap.exists()) throw new Error("Tiedoston kansiota ei löytynyt.");

                const folder = folderSnap.data();
                if (folder.fileCount <= 0) throw new Error("Kansion tiedostomäärä ei voi olla negatiivinen.");
                transaction.update(folderRef, { fileCount: increment(-1) });
            }

            // Handle user storage space
            const userRef = doc(db, "users", userID);
            const userSnap = await transaction.get(userRef);
            const userDoc = userSnap.data();
            if (userDoc.usedSpace < file.fileSize) {
                throw new Error("Käyttäjän tallennustila ei voi olla negatiivinen.");
            }
            transaction.update(userRef, { usedSpace: increment(-file.fileSize) });

            // Delete the file document
            transaction.delete(fileRef);
        });

        // Delete the file from Firebase Storage
        const fileStorageRef = ref(storage, `file-base/${fileID}`);
        await deleteObject(fileStorageRef);

        // Log the storage transaction
        console.log(`File deleted: ${fileID}, User: ${userID}`);

        return { success: true, message: "Tiedosto poistettu onnistuneesti." };
    } catch (error) {
        console.error("Error deleting file: ", error);
        return { success: false, message: "Tiedoston poistaminen epäonnistui. Yritä uudelleen." };
    }
};

// MOVING FILES
export const moveFileToFolder = async (userID, fileID, folderID) => {
    try {
        // Firestore transaction
        await runTransaction(db, async (transaction) => {
            // Fetch the file
            const fileRef = doc(db, "files", fileID);
            const fileSnap = await transaction.get(fileRef);
            if (!fileSnap.exists()) throw new Error("Tiedostoa ei löytynyt.");

            const file = fileSnap.data();
            if (userID !== file.userID) throw new Error(`Ei oikeutta tiedostoon ${file.fileName}.`);

            // Fetch the target folder
            const toFolderRef = doc(db, "folders", folderID);
            const toFolderSnap = await transaction.get(toFolderRef);
            if (!toFolderSnap.exists()) throw new Error(`Tulevaa kansiota (${folderID}) ei löytynyt.`);

            const toFolder = toFolderSnap.data();
            if (userID !== toFolder.userID) throw new Error("Ei oikeutta tulevaan kansioon.");

            // Handle the "from folder" (if applicable)
            const fromFolderID = file.folderID;
            if (fromFolderID) {
                const fromFolderRef = doc(db, "folders", fromFolderID);
                const fromFolderSnap = await transaction.get(fromFolderRef);
                if (!fromFolderSnap.exists()) throw new Error(`Entistä kansiota (${fromFolderID}) ei löytynyt.`);

                const fromFolder = fromFolderSnap.data();
                if (userID !== fromFolder.userID) throw new Error("Ei oikeutta entiseen kansioon.");

                // Prevent same folder transfer
                if (toFolder.folderID === fromFolder.folderID) throw new Error("Tiedosto on jo kansiossa.");

                // Prevent negative fileCount
                if (fromFolder.fileCount <= 0) throw new Error("Kansion tiedostomäärä ei voi olla negatiivinen.");

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