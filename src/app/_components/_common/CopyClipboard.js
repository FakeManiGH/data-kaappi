import { Globe, Link } from 'lucide-react'
import React, { useState } from 'react'

function CopyClipboard({ content }) {
    const [copied, setCopied] = useState(false)

    const copyToClipboard = (e) => {
        navigator.clipboard.writeText(content)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }
        

    return (
    <div>
        <div className="flex items-center gap-1">
            <div className='flex  w-full'>
                <label htmlFor="copy-text" className='sr-only'>
                    Kopioi leikepöydälle
                </label>
                <input id="copy-text" type="text" className="w-full py-2.5 px-3 rounded-md bg-background text-sm border border-transparent outline-none focus:border-primary focus:ring-1" value={content} readOnly />
            </div>
            <button 
                className="w-fit h-fit px-3 py-2 rounded-lg text-white bg-primary text-sm hover:bg-primary/75 transition-colors"
                onClick={copyToClipboard}
            >   
                {copied ? 'Kopioitu!' : 'Kopioi'}
            </button>
        </div>
    </div>
  )
}

export default CopyClipboard