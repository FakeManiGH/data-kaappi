import { ChevronRight, Home, LucideFolderTree } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

function BreadGrumps() {
    return (
        <nav aria-label="Breadcrumb">
            <ol className="flex items-center gap-2 text-sm text-navlink">
                <li className='flex gap-1 items-center'>
                    <Link href='/kansiot' className='flex items-center gap-1 hover:text-primary'>
                        <LucideFolderTree size={16} /> Kansiot
                    </Link>
                    <ChevronRight />
                </li>
            </ol>
        </nav>
    )
}

export default BreadGrumps