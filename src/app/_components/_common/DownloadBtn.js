import { DownloadCloud } from 'lucide-react'
import React, { useState} from 'react'

function DownloadBtn({ url, fileName, downloadName }) {
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
            className='flex items-center gap-2 justify-center whitespace-nowrap text-sm text-white w-[30%] min-w-fit bg-primary rounded-full p-2.5 px-4 hover:bg-primary/90'
            onClick={downloadFile}
        >
            <DownloadCloud size={18} />
            Lataa teidosto
        </button>
    )
}

export default DownloadBtn