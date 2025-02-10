"use client"
import React, { useEffect, use, useState } from 'react'
import { getDoc, doc } from 'firebase/firestore'
import { db } from '@/../firebaseConfig'

function page({ params }) {
    const { id } = use(params)
    const [file, setFile] = useState({})

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
        <div>page</div>
    )
}

export default page