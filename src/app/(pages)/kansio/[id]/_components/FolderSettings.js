import React, { useEffect, useState } from 'react'
import { useAlert } from '@/app/contexts/AlertContext'
import { useUser } from '@clerk/nextjs'
import CopyClipboard from '@/app/_components/_common/CopyClipboard';
import { changeFolderLinkSharing, removeFolderPassword, updateFolderName } from '@/app/file-requests/folders';
import PageLoading from '@/app/_components/_common/PageLoading';
import { updateFolderPassword } from '@/app/file-requests/folders';
import { Eye, EyeOff, LockKeyhole, X } from 'lucide-react';
import { folderNameRegex, passwordRegex } from '@/utils/Regex';
import { getUserGroups } from '@/app/file-requests/groups';
import PopupLoader from '@/app/_components/_common/PopupLoader';


function FolderSettings({ folder, setFolder, settings, setSettings }) {
    const [nameError, setNameError] = useState(null);
    const [shareLink, setShareLink] = useState(folder.sharing.link);
    const [shareGroup, setShareGroup] = useState(folder.sharing.group);
    const [selectedGroups, setSelectedGroups] = useState([]);
    const [availableGroups, setAvailableGroups] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [passwordErr, setPasswordErr] = useState(null);
    const [loading, setLoading] = useState(true);
    const [apiLoading, setApiLoading] = useState(false);
    const { showAlert } = useAlert();
    const { user } = useUser();


    useEffect(() => {
        const fetchUserGroups = async () => {
            try {
                const response = await getUserGroups(user.id);
                if (response.success) {
                    setAvailableGroups(response.groups);
                } else {
                    showAlert(response.message || 'Virhe ryhmien hakemisessa, päivitä sivu ja yritä uudelleen.', 'error');
                }
            } catch (error) {
                console.error("Error fetching user groups: " + error);
                showAlert('Virhe ryhmien hakemisessa, päivitä sivu ja yritä uudelleen.', 'error');
            } finally {
                setLoading(false);
            }
        }

        fetchUserGroups();
    },[showAlert, user]);

    
    // Handle renaming
    const handleFolderRenaming = async (e) => {
        e.preventDefault();
        setLoading(true);
        const newName = e.target.folderName.value;

        if (!newName || newName === folder.name) {
            setNameError('Anna kansiolle ensin uusi nimi.');
            setLoading(false);
            return;
        }

        if (!folderNameRegex.test(newName)) {
            setNameError('Kansion nimen tulee olla 2-50 merkkiä, eikä saa sisältää <, >, /, \\ -merkkejä.');
            setLoading(false);
            return;
        }

        try {
            const response = await updateFolderName(user.id, folder.id, newName);
    
            if (response.success) {
                setFolder({ ...folder, name: newName })
                showAlert(response.message, 'success');
            } else {
                showAlert(response.message, 'error');
            }
        } catch (error) {
            console.error("Error updating folder name: ", error);
            showAlert('Kansion nimen päivittämisessä tapahtui virhe.', 'error');
        } finally {
            setLoading(false);
        }
    }

    // Link sharing
    const handleLinkSharing = async (e) => {
        setApiLoading(true);
        try {
            const newShareValue = e.target.checked;
            const response = await changeFolderLinkSharing(user.id, folder.id, newShareValue);
    
            if (response.success) {
                showAlert('Kansion jakamista muutettu.', 'info');
                setShareLink(newShareValue); 
                setFolder({ 
                    ...folder, 
                    sharing: { 
                        ...folder.sharing, 
                        link: newShareValue 
                    } 
                }); 
            } else {
                showAlert(response.message, 'error');
            }
        } catch (error) {
            console.error("Error changing file sharing: " + error);
            showAlert('Tiedoston jakamisasetusten muuttamisessa tapahtui virhe, yritä uudelleen.', 'error');
        } finally {
            setApiLoading(false);
        }
    };

    // Group sharing
    const handleGroupSharing = async (e) => {
        setShareGroup(e.target.checked);
    }

    // Select group
    const handleSelectGroup = (e) => {
        const groupId = parseInt(e.target.value);
        const group = availableGroups.find(g => g.id === groupId);
        if (group) {
            setSelectedGroups([...selectedGroups, group]);
            setAvailableGroups(availableGroups.filter(g => g.id !== groupId));
        }
    };

    // Remove selected group
    const handleRemoveGroup = (groupId) => {
        const group = selectedGroups.find(g => g.id === groupId);
        if (group) {
            setSelectedGroups(selectedGroups.filter(g => g.id !== groupId));
            setAvailableGroups([...availableGroups, group]);
        }
    };

    // Change password visibility
    const changeVisibility = () => setShowPassword(!showPassword);

    // Save folder password
    const savePassword = async (e) => {
        e.preventDefault()
        const newPassword = e.target.password.value;

        if (!newPassword || newPassword.lenght === 0) {
            setPasswordErr('Anna ensin kelvollinen salasana.');
            return;
        }

        if (!passwordRegex.test(newPassword)) {
            setPasswordErr('Salasana ei voi sisältää <, >, /, \\ -merkkejä.');
            return;
        }

        try {
            const response = await updateFolderPassword(user.id, folder.id, newPassword);

            if (response.success) {
                setFolder({ ...folder, passwordProtected: true })
                showAlert(response.message || 'Kansion salasana tallennettu.', 'success');
            } else {
                setPasswordErr(response.message || 'Virhe salasanan tallentamisessa.');
            }
        } catch (error) {
            console.error('Error setting folder password: ' + error);
            showAlert('Virhe, salasanan tallentaminen epäonnistui.', 'error');
        }
    }

    // Remove password in use
    const removePassword = async () => {
        setLoading(true);
        try {
            const response = await removeFolderPassword(user.id, folder.id);
            if (response.success) {
                showAlert(response.message || 'Salasana poistettu käytöstä.', 'info');
                setFolder({ ...folder, passwordProtected: false });
            } else {
                showAlert(response.message || 'Salasanan poistaminen epäonnistui.', 'error');
            }
        } catch (error) {
            console.error("Error removing password from use " + error);
            showAlert('Virhe, salasanan poistaminen käytöstä epäonnistui.', 'error');
        } finally {
            setLoading(false);
        }
    }


    if (loading) return <PageLoading />

    return (
        <>
        <main className={`flex flex-col transition-transform origin-right
            ${settings ? 'scale-x-100' : 'scale-x-0'}`}
        >   

            <div className='flex items-center gap-2 justify-between'>
                <h1 className='text-3xl font-black truncate'>Kansion asetukset</h1>
                <button 
                    onClick={() => setSettings(false)}
                    className='text-red-500 hover:text-red-600 self-end'
                >
                    <X size={32} />
                </button>
            </div>
            
            <p className='text-xs text-orange-500'>* Muista tallentaa tallennusta vaativat muutokset.</p>    

            <section className='flex flex-col gap-4 bg-gradient-to-b from-contrast via-secondary to-contrast p-4 rounded-lg'>
                <h2 className='font-semibold text-2xl'>Nimi</h2>
                <p className='text-sm'>Muuta kansion nimeä. Nimen tulee olla 2-50 merkkiä pitkä ja se ei saa sisältää &lt;, &gt;, / tai \ merkkiä.</p>

                <form className='flex flex-col gap-2 text-sm' onSubmit={handleFolderRenaming}>
                    <label htmlFor='folderName' className='sr-only'></label>
                    <input
                        id='folderName'
                        name='folderName'
                        defaultValue={folder.name || ''}
                        className='relative w-full py-2.5 px-3 bg-background text-sm border border-transparent outline-none focus:border-primary focus:ring-1'
                        placeholder='Anna kansiolle nimi...'
                    />

                    {nameError && 
                        <div className='flex items-center justify-between gap-4 px-3 py-2.5 rounded-lg text-white text-sm bg-red-500'>
                            <p>{nameError}</p>
                            <button onClick={() => setNameError('')}><X size={20} /></button>
                        </div>
                    }

                    <button
                        type='submit'
                        className='w-full py-2 px-3 rounded-lg text-white bg-primary hover:bg-primary/75 transition-colors'
                    >
                        Tallenna
                    </button>
                </form>
            </section>

            
            {/* SHARING */}
            <section className='flex flex-col gap-4 bg-gradient-to-b from-contrast via-secondary to-contrast p-4 rounded-lg mt-2'>
                <h2 className='font-semibold text-2xl'>Jakaminen</h2>
                <p className='text-sm'>Jaa kansio linkillä julkisesti tai yksityisesti valitsemassasi ryhmässä.</p>

                <div className='flex flex-col gap-2'>
                    <div className='flex flex-col gap-2'>
                        <label className='flex items-center cursor-pointer w-fit'>
                            <input 
                                type="checkbox" 
                                value="" 
                                className="sr-only peer" 
                                checked={shareLink}
                                onChange={handleLinkSharing} 
                            />
                            <div className="relative w-11 h-6 bg-gray-400 dark:bg-gray-500 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 
                                dark:peer-focus:ring-blue-800 rounded-lg peer peer-checked:after:translate-x-full 
                                rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] 
                                after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-lg after:h-5 after:w-5 after:transition-all 
                                dark:border-gray-600 peer-checked:bg-primary"></div>
                            <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">Jaa linkki</span>
                        </label>

                        {shareLink && (
                        <>
                            <CopyClipboard content={folder.sharing.url} />

                            <p className='text-sm text-red-500'>
                                <strong>Huom!</strong> Osoite on julkinen ja kaikki osoitteen tietävät pääsevät näkemään kansion sisällön. 
                                Jaa linkkiä harkiten ja aseta tarvittaessa salasana.
                            </p>
                        </>
                        )}
                    </div>

                    {/* TO DO */}
                    <div className='flex flex-col gap-2 mt-2'>
                        <label className='flex items-center cursor-pointer w-fit'>
                            <input 
                                type="checkbox" 
                                value="" 
                                className="sr-only peer" 
                                checked={shareGroup}
                                onChange={handleGroupSharing} 
                            />
                            <div className="relative w-11 h-6 bg-gray-400 dark:bg-gray-500 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 
                                dark:peer-focus:ring-blue-800 rounded-lg peer peer-checked:after:translate-x-full 
                                rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] 
                                after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-lg after:h-5 after:w-5 after:transition-all 
                                dark:border-gray-600 peer-checked:bg-primary"></div>
                            <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">Jaa ryhmässä</span>
                        </label>

                        {shareGroup && (
                            <form className='flex flex-col gap-2'>
                                <div>
                                    <label htmlFor="groupSelect" className="block text-sm font-medium text-gray-700 dark:text-gray-400">Valitse ryhmät</label>
                                    <select
                                        id="groupSelect"
                                        className="w-full py-2.5 px-3 bg-background text-sm border border-transparent outline-none focus:border-primary focus:ring-1"
                                        onChange={handleSelectGroup}
                                        value=""
                                    >
                                        <option value="" disabled>Valitse ryhmä</option>
                                        {availableGroups.map(group => (
                                            <option key={group.id} value={group.id}>{group.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="flex items-center flex-wrap gap-2">
                                    {selectedGroups.map(group => (
                                        <div key={group.id} className="flex items-center text-foreground px-3 py-1 border border-primary rounded-lg">
                                            <span>{group.name}</span>
                                            <button
                                                type="button"
                                                className="ml-2 text-foreground hover:text-gray-700 dark:hover:text-gray-400"
                                                onClick={() => handleRemoveGroup(group.id)}
                                                title='Poista jako ryhmässä'
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                <button 
                                    type="submit" 
                                    className="w-full py-2 px-3 rounded-lg bg-gradient-to-br from-primary to-blue-800 text-white 
                                    text-sm hover:bg-primary/75  transition-colors"
                                >
                                    Tallenna
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </section>

            
            {/* PASSWORD */}
            <section className='flex flex-col gap-4 bg-gradient-to-b from-contrast via-secondary to-contrast p-4 rounded-lg mt-2'>
                <h2 className='font-semibold text-2xl mb-[-10px]'>Salasana</h2>
                <p className='text-sm'>Anna kansion sisällölle lisäsuojaa asettamalla sille salasana. Tällöin vain kansion omistaja pääsee näkemään sisällön ilman salasanaa.</p>

                <div className='flex flex-col gap-2'>
                    {folder.passwordProtected && (
                        <div className="flex items-center justify-between gap-2 p-2 mb-4 border-b border-dashed border-navlink">
                            <div className='flex items-center gap-2 w-full '>
                                <LockKeyhole className='text-success' size={20} />
                                <p className="text-sm font-bold">Tiedosto on suojattu salasanalla.</p>
                            </div>

                            <button 
                                onClick={removePassword} 
                                className='text-sm font-semibold text-red-500 hover:text-red-600 whitespace-nowrap'
                                title='Poista salasana käytöstä'
                            >
                                Poista
                            </button>
                        </div>
                    )}

                    <form className="flex flex-col text-sm" onSubmit={savePassword}>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Aseta salasana</label>
                        <div className='relative'>
                            <input
                                id="password"
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                className="relative w-full py-2.5 px-3 bg-background text-sm border border-transparent outline-none focus:border-primary focus:ring-1 pe-12"
                                placeholder="Kirjoita salasana..."
                            />
                            <span className="flex items-center absolute inset-y-0 end-0 px-4">
                                <button 
                                    className="text-navlink hover:text-primary" 
                                    type="button"
                                    onClick={changeVisibility}
                                >
                                    {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                                </button>
                            </span>
                        </div>

                        {passwordErr &&
                            <div className='flex items-center gap-2 px-3 py-2 mt-2 rounded-md justify-between bg-red-500'>
                                <p className='text-white text-sm'>{passwordErr}</p>
                                <button className='text-white' onClick={() => setPasswordErr(null)}>
                                    <X />
                                </button>
                            </div>
                        }

                        <button 
                            type="submit" 
                            className="w-full py-2 px-3 mt-2 rounded-lg text-white bg-primary hover:bg-primary/75 transition-colors"
                        >
                            Tallenna salasana
                        </button>
                    </form>
                </div>
            </section>
        </main>

        {/* Loader for changes */}
        {apiLoading && <PopupLoader />}
        </>
    )
}

export default FolderSettings