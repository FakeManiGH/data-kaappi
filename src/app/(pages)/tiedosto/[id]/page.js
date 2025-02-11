"use client"
import React, { useEffect, use, useState } from 'react'
import { getDoc, doc } from 'firebase/firestore'
import { db } from '@/../firebaseConfig'
import Link from 'next/link'
import { ArrowLeftSquare, Settings, Share } from 'lucide-react'
import FilePreview from './_components/FilePreview'
import FileNav from './_components/FileNav'

function page({ params }) {
    const { id } = use(params)
    const [file, setFile] = useState({})
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        id && getFileInfo()
    }, [])

    const getFileInfo = async () => {
        const docRef = doc(db, 'files', id)
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
            console.log('Document data:', docSnap.data())
            setFile(docSnap.data())
        } else {
            console.log('No such document!')
        }
    }

    return (
        <main>
            <FileNav file={file} />

            <FilePreview file={file} />
        </main>
    )
}

export default page