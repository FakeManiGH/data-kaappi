import { getUserFolders } from "@/app/file-requests/api";
import { NextResponse } from "next/server";

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const userID = searchParams.get('userID');

        if (!userID) {
            return NextResponse.json({ message: 'Ei tarvittavia käyttäjätietoja.' }, { status: 400 });
        }

        const folders = await getUserFolders(userID);

        if (!folders) {
            console.error('No folders found for user:', userID);
            return NextResponse.json({ message: 'Kansioita ei löytynyt.' }, { status: 404 });
        }

        const publicFolders = folders.map(folder => ({
            id: folder.folderID,
            name: folder.folderName,
            parentID: folder.parentFolderID,
            fileCount: folder.fileCount,
            user: {
                id: folder.userID,
                name: folder.userName,
                email: folder.userEmail
            },
            created: folder.createdAt,
            modified: folder.modifiedAt,
            files: folder.files,
            password: folder.password ? true : false,
            shared: folder.shared,
            sharedWith: folder.sharedWith
        }));

        return NextResponse.json({ folders: publicFolders }, { status: 200 });
    } catch (error) {
        console.error('Error fetching folders:', error);
        return NextResponse.json({ message: 'Palvelinvirhe! Yritä uudelleen.' }, { status: 500 });
    }
}