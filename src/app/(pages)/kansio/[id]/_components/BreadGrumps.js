import { ChevronLeft, Folders, Home } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

function Breadcrumbs({ folder, grumps }) {
    return (
        <nav aria-label="Breadcrumb" className='flex items-center gap-2 text-sm'>
            <Link href='/kansiot' className='flex items-center gap-1 hover:text-primary transition-colors'>
                <img src='/icons/folder.png' className='w-5 h-5 object-contain' />
                Kansiot
            </Link>

            <p>&#9656;</p>

            {grumps && grumps.map(grump => (
                <>
                <Link 
                    className='hover:text-primary'
                    title='Siirry kansioon' 
                    key={grump.id} 
                    href={`${grump.id}`}
                >
                    {grump.name}
                </Link>
                <p>&#9656;</p>
                </>
            ))}

            <p className='text-navlink'>{folder.name}</p>
        </nav>
    );
}

export default Breadcrumbs;