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
            className={`flex items-center justify-center p-4 group max-w-2xl mt-4
                text-white bg-success text-sm gap-2 hover:bg-success/75 transition-colors
                ${buttonStyle} ${fetching ? 'cursor-not-allowed' : 'cursor-pointer'}`}
            onClick={downloadFile}
        >
            <DownloadCloud />
            Lataa
        </button>
    )
}

export default DownloadBtn