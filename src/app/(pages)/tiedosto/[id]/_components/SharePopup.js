import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useAlert } from '@/app/contexts/AlertContext';
import CopyClipboard from '@/app/_components/_common/CopyClipboard';

const exampleGroups = [
    { id: 1, name: 'Group 1' },
    { id: 2, name: 'Group 2' },
    { id: 3, name: 'Group 3' },
    { id: 4, name: 'Group 4' },
];

function SharePopup({ file, setFile, setSharePopup }) {
    const [shareLink, setShareLink] = useState(file.shared);
    const [shareGroup, setShareGroup] = useState(false);
    const [selectedGroups, setSelectedGroups] = useState([]);
    const [availableGroups, setAvailableGroups] = useState(exampleGroups);
    const fileID = file.id;
    const { showAlert } = useAlert();

    useEffect(() => {
        const handleClick = (e) => {
            let overlay = document.getElementById('overlay');
            if (e.target === overlay) {
                setSharePopup(false);
            }
        };

        document.addEventListener('click', handleClick);
        return () => document.removeEventListener('click', handleClick);
    }, []);

    const handleLinkSharing = async (e) => {
        setShareLink(e.target.checked);
    };

    const handleGroupSharing = async (e) => {
        setShareGroup(e.target.checked);
    };

    const handleSelectGroup = (e) => {
        const groupId = parseInt(e.target.value);
        const group = availableGroups.find(g => g.id === groupId);
        if (group) {
            setSelectedGroups([...selectedGroups, group]);
            setAvailableGroups(availableGroups.filter(g => g.id !== groupId));
        }
    };

    const handleRemoveGroup = (groupId) => {
        const group = selectedGroups.find(g => g.id === groupId);
        if (group) {
            setSelectedGroups(selectedGroups.filter(g => g.id !== groupId));
            setAvailableGroups([...availableGroups, group]);
        }
    };

    return (
        <div className='fixed z-50 inset-0 flex justify-center items-center bg-black/50 px-4 py-2'>
            <div className='relative flex flex-col gap-2 w-full max-w-2xl p-4 z-50 bg-gradient-to-br from-background to-contrast shadow-md max-h-full overflow-y-auto'>
                <button
                    className="absolute top-2 right-2 p-2 text-white bg-red-500 hover:bg-red-600"
                    onClick={() => setSharePopup(false)}
                >
                    <X size={20} />
                </button>

                <h2 className="text-2xl md:text-3xl mb-2 text-center font-bold">Jaa tiedosto</h2>

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
                    <CopyClipboard content={file.shortUrl} />

                    <p className='text-sm p-2 border border-red-500'>
                        Huomaa, että osoite on julkinen ja kaikki osoitteen tietävät pääsevät näkemään tiedoston. 
                        Jaa siis linkkiä harkiten ja aseta tarvittaessa salasana.
                    </p>
                </>
                )}


                {/* TO DO */}
                <label className='flex items-center cursor-pointer w-fit mt-2'>
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
                            <label htmlFor="groupSelect" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Valitse ryhmät</label>
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

                        <div className="flex flex-wrap gap-2">
                            {selectedGroups.map(group => (
                                <div key={group.id} className="flex items-center bg-gray-400 dark:bg-gray-600 text-foreground px-3 py-1">
                                    <span>{group.name}</span>
                                    <button
                                        type="button"
                                        className="ml-2 text-foreground hover:text-gray-700 dark:hover:text-gray-400"
                                        onClick={() => handleRemoveGroup(group.id)}
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                        <button type="submit" className="w-full py-2.5 px-3 bg-primary text-white text-sm hover:bg-primary/90 transition-colors">Tallenna</button>
                    </form>
                )}
            </div>
        </div>
    );
}

export default SharePopup;