import { ChevronRight, Home, Folder } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

function Breadcrumbs({ paths }) {
    return (
        <nav aria-label="Breadcrumb" className="px-2 shadow-sm">
            <ol className="flex items-center gap-2 text-sm text-gray-600">
                <li className='flex gap-1 items-center'>
                    <Link href='/kansiot' className='flex items-center gap-1 text-navlink hover:text-primary transition-colors'>
                        <Home size={20} /> Kansiot
                    </Link>
                    <ChevronRight className="text-gray-400" />
                </li>
                {paths?.map((path, index) => (
                    <li key={index} className='flex gap-1 items-center'>
                        <Link href={path.href} className='flex items-center gap-1 text-gray-600 hover:text-primary transition-colors'>
                            <Folder size={20} /> {path.name}
                        </Link>
                        {index < paths.length - 1 && <ChevronRight className="text-gray-400" />}
                    </li>
                ))}
            </ol>
        </nav>
    );
}

export default Breadcrumbs;