"use client"
import ContentNotFound from '@/app/_components/_common/ContentNotFound';
import PageLoading from '@/app/_components/_common/PageLoading';
import { useAlert } from '@/app/contexts/AlertContext';
import { useNavigation } from '@/app/contexts/NavigationContext';
import { getPrivateGroupInformation, validateGroupPassword } from '@/app/file-requests/groups';
import { useUser } from '@clerk/nextjs';
import React, { use, useEffect, useState } from 'react'
import ErrorView from '../../_components/ErrorView';
import Hero from './_components/Hero';
import Breadcrumbs from './_components/BreadGrumps';

function Page({ params }) {
    const { id } = use(params);
    const { user, isLoaded } = useUser();
    const { navigatePage, setCurrentIndex } = useNavigation();
    const { showAlert } = useAlert();
    
    const [pageLoading, setPageLoading] = useState(true);
    const [group, setGroup] = useState(null);
    const [contentError, setContentError] = useState(null);
    const [serverError, setServerError] = useState(null);

    useEffect(() => {
        const getGroupData = async () => {
            if (isLoaded && !user) {
                showAlert('Sisäänkirjautumien vaaditaan.', 'error');
                navigatePage('/sign-in');
                return;
            } else if (!id) {
                showAlert('Ryhmätietoa ei löytynyt.', 'error');
                navigatePage('/ryhmat');
                return;
            } else {
                try {
                    const response = await getPrivateGroupInformation(user.id, id);
                    if (response.success) {
                        if (response.password) {
                            let passwordValid = false;

                            // While loop for passwordPropting (toDO)
                                
                        }
                        setGroup(response.group);
                    } else {
                        setContentError(response.message);
                    }
    
                } catch (error) {
                    console.error('Error fetching group data:', error);
                    setServerError(error.message || 'Ryhmän tietojen hakemisessa tapahtui virhe, yritä uudelleen.')
                } finally {
                    setPageLoading(false);
                }
            }
        }

        getGroupData();
        setCurrentIndex('/ryhmat');
    }, [isLoaded, user, id, navigatePage, setCurrentIndex]);


    if (pageLoading) return <PageLoading />
    if (contentError) return <ContentNotFound message={contentError} />
    if (serverError) return <ErrorView message={serverError} />

    return (
        <main>
            <Breadcrumbs group={group} />
            <Hero group={group} setGroup={setGroup} />
            
        </main>
    )
}

export default Page