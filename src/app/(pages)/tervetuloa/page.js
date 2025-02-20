"use client"
import { createUserDocument, getUser } from '@/app/(pages)/api/api'
import React, { useEffect, useState} from 'react'
import { useUser } from '@clerk/nextjs'
import PageLoading from '@/app/_components/_common/PageLoading'
import { useNavigation } from '@/app/contexts/NavigationContext'

function page() {
    const { user, isSignedIn, isLoaded } = useUser()
    const [loading, setLoading] = useState(true)
    const { navigatePage } = useNavigation()

    useEffect(() => {
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
            }
        }
        handleNewUser()
    }, [isLoaded, isSignedIn, user, navigatePage, setLoading])

    if (loading) return <PageLoading />

    return (
        <main>
            <h1 className='text-2xl md:text-3xl'><strong>Hei, {user.fullName}</strong></h1>
            <p>Tervetuloa käyttämään <strong className='text-primary'>Kuva-Kaappi</strong> pilvipalvelua!</p>
        </main>
    )
}

export default page