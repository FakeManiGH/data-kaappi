import React, { useState } from 'react'

function CopyClipboard({ message }) {
    const [copied, setCopied] = useState(false)

    const copyToClipboard = (e) => {
        navigator.clipboard.writeText(message)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }
        

    return (
    <div>
        <div className="flex gap-2">
            <div className='flex text-navlink rounded-lg overflow-hidden w-full'>
                <label htmlFor="copy-text" className='bg-contrast text-foreground font-bold p-2 px-3 border-r border-contrast2'>URL</label>
                <input id="copy-text" type="text" className="p-2 px-3 w-full outline-none" value={message} readOnly />
            </div>
            <button 
                className="text-white bg-primary rounded-full px-4 py-2 hover:bg-primary/90"
                onClick={copyToClipboard}
            >
                {copied ? 'Kopioitu!' : 'Kopioi'}
            </button>
        </div>
    </div>
  )
}

export default CopyClipboard