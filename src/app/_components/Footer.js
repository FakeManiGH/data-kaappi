import React from 'react'

function Footer() {

    const currentYear = new Date().getFullYear()

    return (
        <div>
            <footer className='absolute bottom-0 w-full text-center text-sm p-4'>
                <p>&copy; {currentYear} Datakaappi. Kaikki oikeudet pidätetään.</p>
            </footer>
        </div>
    )
}

export default Footer