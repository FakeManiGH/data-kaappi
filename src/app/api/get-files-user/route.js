"use server"
import { getFiles } from "@/app/file-requests/api"
import { NextResponse } from "next/server"

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url)
        const userID = searchParams.get('userID')

        if (!userID) {
            return NextResponse.json({ message: "Käyttäjää ei löytynyt." }, { status: 400 })
        }

        const files = await getFiles(userID)

        // Building public file objects
        const publicFiles = files.map(file => ({
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
        }))

        return NextResponse.json({ files: publicFiles }, { status: 200 })
    } catch (error) {
        console.error("Error fetching files: ", error)
        return NextResponse.json({ message: "Palvelinvirhe! Yritä uudelleen." }, { status: 500 })
    }
}