import React from 'react'

function Footer() {

    const currentYear = new Date().getFullYear()

    return (
        <footer className='absolute bottom-0 w-full bg-contrast1 text-center text-sm text-foreground p-4'>
            <p>&copy; {currentYear} Data-Kaappi. All rights reserved.</p>
        </footer>
    )
}

export default Footer