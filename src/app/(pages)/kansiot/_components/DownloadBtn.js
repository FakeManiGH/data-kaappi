import { DownloadCloud } from 'lucide-react'
import React, { useState} from 'react'

function DownloadBtn({ url, fileName, buttonStyle }) {
    const [fetching, setFetching] = useState(false)
    const [error, setError] = useState(false)

    const downloadFile = async () => {
        setFetching(true)
        try {
            const res = await fetch(url)
            const blob = await res.blob()
            const href = window.URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = href
            link.download = fileName
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            window.URL.revokeObjectURL(href)
        } catch (error) {
            setError(true)
        }
        setFetching(false)
    }

    return (
        <button 
            disabled={fetching}
            className={`flex items-center w-fit gap-2 px-3 py-2 text-sm bg-primary text-white hover:bg-primary/75 transition-colors
                ${buttonStyle} ${fetching ? 'cursor-not-allowed' : 'cursor-pointer'}`}
            onClick={downloadFile}
        >
            <DownloadCloud size={20} />
            Lataa valitut
        </button>
    )
}

export default DownloadBtn