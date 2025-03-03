"use server"
import { getFileInfo } from "@/app/file-requests/api"
import { NextResponse } from "next/server"

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url)
        const fileID = searchParams.get('fileID')

        if (!fileID) {
            return NextResponse.json({ message: "Tiedostoa ei löytynyt." }, { status: 400 })
        }

        const file = await getFileInfo(fileID)

        // Building public file object
        const publicFile = {
            id: file.fileID,
            name: file.fileName,
            url: file.fileUrl,
            size: file.fileSize,
            type: file.fileType,
            shared: file.shared,
            password: file.password ? true : false,
            uploadedAt: file.uploadedAt,
            user: {
                id: file.userID,
                name: file.uploadedBy
            }
        }

        return NextResponse.json({ file: publicFile }, { status: 200 })
    } catch (error) {
        console.error("Error fetching file: ", error)
        return NextResponse.json({ message: "Palvelinvirhe! Yritä uudelleen." }, { status: 500 })
    }
}