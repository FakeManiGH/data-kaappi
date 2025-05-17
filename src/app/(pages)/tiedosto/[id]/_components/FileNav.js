import React, { useEffect, useState, useRef } from 'react'

function FileNav({ setRenamePopup, setDeletePopup, setPasswordPopup, setMovePopup, setSharePopup }) {
    

    const handleRenamePopup = () => {
        closeAllPopups();
        setRenamePopup(true);
    }

    const handleSharePopup = () => {
        closeAllPopups();
        setSharePopup(true)
    }

    const handlePasswordPopup = () => {
        closeAllPopups();
        setPasswordPopup(true)
    }

    const handleMovePopup = () => {
        closeAllPopups();
        setMovePopup(true)
    }

    const handleDeletePopup = () => {
        closeAllPopups();
        setDeletePopup(true)
    }

    const closeAllPopups = () => {
        setRenamePopup(false);
        setSharePopup(false);
        setPasswordPopup(false);
        setMovePopup(false);
        setDeletePopup(false);
    }

    return (
        <div className='flex flex-wrap items-center gap-1 justify-end text-sm'>
            <button 
                className='px-3 py-2  text-white bg-primary hover:bg-primary/75'
                onClick={handleSharePopup}
            >
                Jaa
            </button>

            <button 
                className='px-3 py-2  text-white bg-primary hover:bg-primary/75'
                onClick={handleRenamePopup}
            >
                Nimeä uudelleen
            </button>

            <button 
                className='px-3 py-2  text-white bg-primary hover:bg-primary/75'
                onClick={handlePasswordPopup}
            >
                Salasana
            </button>

            <button 
                className='px-3 py-2  text-white bg-primary hover:bg-primary/75'
                onClick={handleMovePopup}
            >
                Siirrä
            </button>

            <button 
                className='px-3 py-2  text-white bg-red-500 hover:bg-red-600'
                onClick={handleDeletePopup}
            >
                Poista
            </button>
        </div>
    )
}

export default FileNav