"use client"
import { createUserDocument, getUser } from '@/app/file-requests/api'
import React, { useEffect, useState} from 'react'
import { useUser } from '@clerk/nextjs'
import PageLoading from '@/app/_components/_common/PageLoading'
import { useNavigation } from '@/app/contexts/NavigationContext'
import { CloudUpload, Plus } from 'lucide-react'
import Link from 'next/link'

function page() {
    const { user, isSignedIn, isLoaded } = useUser()
    const [loading, setLoading] = useState(true)
    const { navigatePage, setCurrentIndex } = useNavigation()

    /* useEffect(() => {
        const handleNewUser = async () => {
            if (isSignedIn && isLoaded) {
                setLoading(true)
                getUser(user.id).then((userDoc) => {
                    if (!userDoc) {
                        createUserDocument(user)
                        setLoading(false)
                    } else {
                        navigatePage('/kojelauta')
                    }
                })
            } else {
                navigatePage('/sign-in')
            }
        }
        setCurrentIndex('/tervetuloa')
        handleNewUser()
    }, [isLoaded, isSignedIn, user, navigatePage, setLoading, setCurrentIndex]) */

    if (loading) return <PageLoading />

    return (
        <main>
            <p className='md:text-lg'>Hei, {user?.fullName}</p>
            <h1 className="text-4xl font-extrabold sm:text-4xl">Tervetuloa käyttämään <strong className='text-primary'>Datakaappi</strong> pilvipalvelua!</h1>
        </main>
    )
}

export default page