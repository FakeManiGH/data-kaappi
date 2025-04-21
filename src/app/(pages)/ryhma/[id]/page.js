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
import PasswordPrompt from './_components/PasswordPrompt';

function Page({ params }) {
    const { id } = use(params);
    const { user, isLoaded } = useUser();
    const { navigatePage, setCurrentIndex } = useNavigation();
    const { showAlert } = useAlert();
    
    const [pageLoading, setPageLoading] = useState(true);
    const [apiLoading, setApiLoading] = useState(false);
    const [group, setGroup] = useState(null);
    const [contentError, setContentError] = useState(null);
    const [serverError, setServerError] = useState(null);

    const [reqPassword, setReqPassword] = useState(false);
    const [passwordError, setPasswordError] = useState(null);
    const [passwordResolve, setPasswordResolve] = useState(null);

    // Password submit
    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        if (apiLoading) {
            showAlert('ladataan... odota hetki.', 'info');
            return;
        }
    
        setApiLoading(true);
        const password = e.target.password.value;
    
        if (!password || !password.length) {
            setPasswordError('Anna ensin kelvollinen salasana.');
            setApiLoading(false);
            return;
        }
    
        try {
            const response = await validateGroupPassword(id, password);
            if (response.success) {
                setPasswordResolve(true); // Resolve the promise with `true`
                setReqPassword(false); // Close the prompt
            } else {
                setPasswordError(response.message || 'Virheellinen salasana.'); // Keep the prompt open
            }
        } catch (error) {
            setPasswordError('Virhe tapahtui salasanan tarkistuksessa.'); // Handle unexpected errors
        } finally {
            setApiLoading(false);
        }
    };

    // Password Cancel
    const handlePasswordCancel = () => {
        if (passwordResolve) passwordResolve(false); // Resolve the promise with `false`
        setReqPassword(false); // Close the prompt
    };


    useEffect(() => {
        const getGroupData = async () => {
            if (isLoaded && !user) {
                showAlert('Sisäänkirjautuminen vaaditaan.', 'error');
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
                        setGroup(response.group);
                        if (response.password) {
                            setPageLoading(false);
                            const passwordValid = await new Promise((resolve) => {
                                setPasswordResolve(() => resolve); // Store the resolve function
                                setReqPassword(true); // Show the password prompt
                            });
    
                            if (!passwordValid) {
                                navigatePage('/ryhmat');
                                return;
                            }
                        }
                    } else {
                        setContentError(response.message);
                    }
                } catch (error) {
                    console.error('Error fetching group data:', error);
                    setServerError(
                        error.message || 'Ryhmän tietojen hakemisessa tapahtui virhe, yritä uudelleen.'
                    );
                } finally {
                    setPageLoading(false);
                }
            }
        };
    
        getGroupData();
        setCurrentIndex('/ryhmat');
    }, [isLoaded, user, id, navigatePage, setCurrentIndex]);


    
    if (pageLoading) return <PageLoading />
    if (contentError) return <ContentNotFound message={contentError} />
    if (serverError) return <ErrorView message={serverError} />
    if (reqPassword) return (
        <PasswordPrompt 
            handleSubmit={handlePasswordSubmit}
            error={passwordError}
            loading={apiLoading}
            setError={setPasswordError}
            handleCancel={handlePasswordCancel} 
        />
    )

    return (
        <main>
            <Breadcrumbs group={group} />
            <Hero group={group} setGroup={setGroup} />
            
        </main>
    )
}

export default Page