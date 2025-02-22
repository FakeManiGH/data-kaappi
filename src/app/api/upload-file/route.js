import { NextResponse } from 'next/server';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { doc, setDoc } from "firebase/firestore";
import { app, db } from '@/../firebaseConfig';
import { formatDateToCollection } from '@/utils/DataTranslation';
import { generateRandomString } from '@/utils/GenerateRandomString';
import { currentUser } from '@clerk/nextjs/server';

export async function POST(request) {
    try {
        const user = await currentUser();
        if (!user) {
            return NextResponse.json({ message: 'Kirjaudu sisään lähettääksesi tiedostoja.' }, { status: 401 });
        }

        const formData = await request.formData();
        const file = formData.get('file');

        if (!file) {
            return NextResponse.json({ message: 'Virheellinen pyyntö.' }, { status: 400 });
        }

        const storage = getStorage(app);
        const uniqueFileName = `${file.name}_${generateRandomString(6)}`;
        const fileRef = ref(storage, 'file-base/' + uniqueFileName);

        const uploadTask = await uploadBytesResumable(fileRef, file);
        const downloadURL = await getDownloadURL(uploadTask.ref);

        const docID = generateRandomString(6).toString();
        const fileDocRef = doc(db, 'files', docID);
        const shortUrl = process.env.NEXT_PUBLIC_BASE_URL + 'tiedosto/' + docID;

        await setDoc(fileDocRef, {
            fileID: docID,
            fileName: uniqueFileName,
            fileSize: file.size,
            uploadedAt: formatDateToCollection(new Date()),
            fileType: file.type,
            fileUrl: downloadURL,
            userID: user.id,
            userEmail: user.primaryEmailAddress.emailAddress,
            shared: false,
            password: '',
            shortUrl: shortUrl,
        });


        return NextResponse.json({ message: 'Tiedosto(t) tallennettu onnistuneesti.' });
    } catch (error) {
        console.error('Error uploading file:', error);
        return NextResponse.json({ message: 'Palvelinvirhe. Päivitä sivu ja yritä uudelleen.' }, { status: 500 });
    }
}