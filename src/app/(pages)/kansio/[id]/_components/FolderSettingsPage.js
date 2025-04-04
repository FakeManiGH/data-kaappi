import React, { useState } from 'react'
import { useAlert } from '@/app/contexts/AlertContext'
import { useUser } from '@clerk/nextjs'
import CopyClipboard from '@/app/_components/_common/CopyClipboard';
import { changeFolderLinkSharing, removeFolderPassword } from '@/app/file-requests/folders';
import PageLoading from '@/app/_components/_common/PageLoading';
import { updateFolderPassword } from '@/app/file-requests/folders';
import { Eye, EyeOff, LockKeyhole, X } from 'lucide-react';
import { passwordRegex } from '@/utils/Regex';

const exampleGroups = [
    { id: 1, name: 'Group 1' },
    { id: 2, name: 'Group 2' },
    { id: 3, name: 'Group 3' },
    { id: 4, name: 'Group 4' },
];


function FolderSettingsPage({ folder, setFolder, folderSettings, setFolderSettings }) {
    const [shareLink, setShareLink] = useState(folder.sharing.link);
    const [shareGroup, setShareGroup] = useState(folder.sharing.group);
    const [selectedGroups, setSelectedGroups] = useState([]);
    const [availableGroups, setAvailableGroups] = useState(exampleGroups);
    const [showPassword, setShowPassword] = useState(false);
    const [passwordErr, setPasswordErr] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const { showAlert } = useAlert();
    const { user } = useUser();

    // Link sharing
    const handleLinkSharing = async (e) => {
        setLoading(true);
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
            setLoading(false);
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
        <div className={`flex flex-col gap-4 transition-transform origin-top
            ${folderSettings ? 'scale-y-100' : 'scale-y-0'}`}
        >
            <p className='text-xs text-orange-500'>* Muista tallentaa tallennusta vaativat muutokset.</p>    


            <h2 className='font-semibold text-xl sm:text-2xl mb-[-10px]'>Jakaminen</h2>
            <p className='text-sm'>Jaa kansio linkillä julkisesti tai yksityisesti valitsemassasi ryhmässä.</p>

            <div className='flex flex-col gap-2 py-2 px-4 bg-secondary rounded-xl'>
                <div className='flex flex-col gap-2'>
                    <label className='flex items-center cursor-pointer w-fit'>
                        <input 
                            type="checkbox" 
                            value="" 
                            className="sr-only peer" 
                            checked={shareLink}
                            onChange={handleLinkSharing} 
                        />
                        <div className="relative w-11 h-6 bg-gray-400 dark:bg-contrast peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 
                            dark:peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full 
                            rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] 
                            after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all 
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
                        <div className="relative w-11 h-6 bg-gray-400 dark:bg-contrast peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 
                            dark:peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full 
                            rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] 
                            after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all 
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
                                    <div key={group.id} className="flex items-center text-foreground px-3 py-1 border border-primary rounded-full">
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
                                className="w-full py-2.5 px-3 rounded-full bg-gradient-to-br from-primary to-blue-800 text-white 
                                text-sm hover:bg-primary/75  transition-colors"
                            >
                                Tallenna
                            </button>
                        </form>
                    )}
                </div>
            </div>

            <h2 className='font-semibold text-xl sm:text-2xl mb-[-10px]'>Salasana</h2>
            <p className='text-sm'>Anna kansion sisällölle lisäsuojaa asettamalla sille salasana. Tällöin vain kansion omistaja pääsee näkemään sisällön ilman salasanaa.</p>

            <div className='flex flex-col gap-2 py-2 px-4 bg-secondary rounded-xl'>
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
                        className="w-full py-2 px-3 mt-2 rounded-full text-white bg-primary hover:bg-primary/75  transition-colors"
                    >
                        Tallenna salasana
                    </button>
                </form>
            </div>
        </div>
    )
}

export default FolderSettingsPage