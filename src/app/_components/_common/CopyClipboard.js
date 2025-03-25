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
        <div className="flex gap-1">
            <div className='flex w-full'>
                <label htmlFor="copy-text" className='sr-only'>
                    Kopioi leikepöydälle
                </label>
                <input id="copy-text" type="text" className="w-full py-2.5 px-3 bg-background text-sm border border-transparent outline-none focus:border-primary focus:ring-1" value={content} readOnly />
            </div>
            <button 
                className="flex items-center justify-center px-3 py-2.5 rounded-lg text-white bg-primary text-sm gap-2 hover:border-primary/75 transition-colors"
                onClick={copyToClipboard}
            >   
                {copied ? 'Kopioitu!' : 'Kopioi'}
            </button>
        </div>
    </div>
  )
}

export default CopyClipboard