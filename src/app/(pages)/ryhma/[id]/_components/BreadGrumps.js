import Link from 'next/link';
import React from 'react';

function Breadcrumbs({ group }) {
    return (
        <nav aria-label="Breadcrumb" className='flex items-center gap-2 text-sm'>
            <Link href='/ryhmat' className='flex items-center gap-1 hover:text-primary transition-colors'>
                <img src='/icons/group.png' className='w-5 h-5 object-contain' />
                Ryhmät
            </Link>

            <p>&#9656;</p>

            <p className='text-navlink'>{group.name}</p>
        </nav>
    );
}

export default Breadcrumbs;