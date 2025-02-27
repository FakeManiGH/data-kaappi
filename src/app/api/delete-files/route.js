"use server"
import { deleteFile } from "@/app/file-requests/api";
import { NextResponse } from "next/server";

export async function DELETE(request) {
    try {
        const { userID, files } = await request.json();
        
        if (!files || files.length === 0) {
            return NextResponse.json({ message: 'Yhtään tiedostoa ei löytynyt' }, { status: 404 });
        }

        for (const file of files) {
            if (file.userID !== userID) {
                return NextResponse.json({ message: 'Sinulla ei ole oikeutta poistaa tiedostoa tai tiedostoja.' }, { status: 403 });
            }
            await deleteFile(file);
        }

        return NextResponse.json({ message: 'Tiedosto(t) poistettu onnistuneesti.' });
    } catch (error) {
        console.error('Error deleting files:', error);
        return NextResponse.json({ message: 'Palvelinvirhe! Yritä uudelleen.' }, { status: 500 });
    }
}