import { Globe, Link } from 'lucide-react'
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
        <div className="flex gap-1">
            <div className='flex rounded-full border border-contrast overflow-hidden w-full'>
                <label htmlFor="copy-text" className='bg-bacground text-foreground p-2 px-3 pr-2 border-r border-contrast'>
                    <Globe />
                </label>
                <input id="copy-text" type="text" className="text-sm font-light p-2 px-3 w-full outline-none bg-background focus:text-foreground" value={message} readOnly />
            </div>
            <button 
                className="flex items-center justify-center px-3 py-2 border border-contrast rounded-full text-navlink text-sm gap-2 hover:text-foreground hover:border-primary transition-colors"
                onClick={copyToClipboard}
            >   
                <Link className='text-primary' />
                {copied ? 'Kopioitu!' : 'Kopioi'}
            </button>
        </div>
    </div>
  )
}

export default CopyClipboard