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
            className={`flex items-center justify-center px-3 py-2 group bg-success hover:bg-success/75 rounded-lg
                text-white text-sm gap-2 transition-colors
                ${buttonStyle} ${fetching ? 'cursor-not-allowed' : 'cursor-pointer'}`}
            onClick={downloadFile}
        >
            <DownloadCloud />
            Lataa
        </button>
    )
}

export default DownloadBtn