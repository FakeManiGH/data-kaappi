import { getStorage, ref, deleteObject } from "firebase/storage";
import { doc, deleteDoc } from "firebase/firestore";
import { collection, query, where, getDocs } from "firebase/firestore";
import { app, db } from '@/../firebaseConfig';

// Config
const storage = getStorage();


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
