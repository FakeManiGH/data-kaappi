import { Trash2 } from 'lucide-react';
import React, { useState } from 'react'

function FolderDeleteButton({ setDeletePopup }) {
    const [deleteConfirm, setDeleteConfirm] = useState(false);

    return (
        <button
            className='flex items-center gap-1 px-3 py-2 w-fit text-sm  text-white bg-red-500 hover:bg-red-600'
            onClick={() => setDeletePopup(true)}
        >
            Poista kansio
        </button>
    )
}

export default FolderDeleteButton