import { LockKeyhole, Share2 } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

function GridContainer({ folders }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-2">
      {/* Folders */}
        {folders.map(folder => (
            <div 
                key={folder.id} 
                className='relative flex flex-col items-center justify-center p-2 rounded-lg transition-colors group 
                    overflow-hidden bg-gradient-to-br from-secondary to-contrast text-sm'
            >   
                <Link href={`/kansio/${folder.id}`} className='flex flex-col items-center max-w-full overflow-hidden text-foreground hover:text-primary'>
                    <img src={folder.fileCount > 0 ? "/icons/folder_file.png" : "/icons/folder.png"} alt="folder" className="w-16 h-16" />
                    <h2 className="flex items-center gap-1 font-semibold truncate transition-colors ">
                      {folder.name}
                      <span title={`${folder.fileCount} tiedostoa`} className='text-navlink'>({folder.fileCount})</span>
                    </h2>
                </Link>

                <p className='text-xs'>{folder.user.name}</p>

                <div className='absolute top-2 left-2 flex flex-col gap-1 text-success'>
                    {folder.passwordProtected && <p title='Suojattu salasanalla'><LockKeyhole size={18} /></p>}
                </div>
            </div>
        ))}
    </div>
  )
}

export default GridContainer
