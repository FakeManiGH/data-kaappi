import { ChevronLeft, Folders } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

function Breadcrumbs({ folder }) {
    return (
        <nav aria-label="Breadcrumb" className='flex items-center gap-1'>
            <Link href='/kansiot' className='flex items-center gap-1 text-primary hover:text-primary/75 transition-colors'>
                <Folders size={18} /> 
                Kansiot
            </Link>

            <p>&#9656;</p>

            {folder.parent.id &&
                <>
                <Link href={`/kansio/${folder.parent.id}`} className='flex items-center gap-1 text-primary hover:text-primary/75 transition-colors'>
                    {folder.parent.name}
                </Link>

                <p>&#9656;</p>
                </>
            }

            <p className='font-semibold'>{folder.name}</p>
        </nav>
    );
}

export default Breadcrumbs;