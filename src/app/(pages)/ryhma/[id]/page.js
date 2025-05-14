"use client"
import ContentNotFound from '@/app/_components/_common/ContentNotFound';
import PageLoading from '@/app/_components/_common/PageLoading';
import { useAlert } from '@/app/contexts/AlertContext';
import { useNavigation } from '@/app/contexts/NavigationContext';
import { getPrivateGroupInformation, getSharedBaseFoldersForGroup, validateGroupPassword } from '@/app/file-requests/groups';
import { useUser } from '@clerk/nextjs';
import React, { use, useEffect, useState } from 'react'
import ErrorView from '../../_components/ErrorView';
import Hero from './_components/Hero';
import Breadcrumbs from './_components/BreadGrumps';
import PasswordPrompt from './_components/PasswordPrompt';
import NavigationBar from './_components/NavigationBar';
import GridContainer from './_components/GridContainer';
import MemberList from './_components/MemberList';

function Page({ params }) {
    const { id } = use(params);
    const { user, isLoaded } = useUser();
    const { navigatePage, setCurrentIndex } = useNavigation();
    const { showAlert } = useAlert();
    
    const [pageLoading, setPageLoading] = useState(true);
    const [apiLoading, setApiLoading] = useState(false);
    const [group, setGroup] = useState(null);
    const [members, setMembers] = useState(null);
    const [folders, setFolders] = useState(null);
    const [contentError, setContentError] = useState(null);
    const [serverError, setServerError] = useState(null);

    // MODAL STATES
    const [coverImagePopup, setCoverImagePopup] = useState(false);
    const [memberList, setMemberList] = useState(false);


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
                        setMembers(response.members);
                        await getSharedFolders(id);
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

    // Shared Folders (base)
    const getSharedFolders = async () => {
        try {
            const folderResponse = await getSharedBaseFoldersForGroup(id);
            if (folderResponse.success) {
                setFolders(folderResponse.folders)
            } else {
                showAlert(folderResponse.message || 'Jaettujen kansioiden hakemisessa tapahtui virhe, päivitä sivu.', 'error');
            }
        } catch (error) {
            console.error("Error fetching shared folders: " + error.message);
            showAlert('Jaettujen kansioiden hakemisessa tapahtui virhe, päivitä sivu.', 'error');
        }
    }

    // Shared files (base)


    if (pageLoading) return <PageLoading />
    if (contentError) return <ContentNotFound message={contentError} />
    if (serverError) return <ErrorView message={serverError} />

    return (
        <>
        <main>
            <Breadcrumbs group={group} />
            <Hero group={group} setCoverImagePopup={setCoverImagePopup} />
            <NavigationBar members={members} memberList={memberList} setMemberList={setMemberList} />
            <GridContainer folders={folders} />
        </main>

        {/* MODALS */}
        <MemberList group={group} members={members} memberList={memberList} setMemberList={setMemberList} />
        </>
    )
}

export default Page