import React from 'react';
import { translateFileSize, cleanDataType, convertDate } from '@/utils/DataTranslation';
import { LockKeyhole, Share2 } from 'lucide-react';
import Link from 'next/link';

function FileInfo({ file, folder }) {
  if (!file) return null;

  // Define the file info fields
  const fileInfoFields = [
    {
      label: 'Koko:',
      value: translateFileSize(file.size),
    },
    {
      label: 'Tallennettu:',
      value: convertDate(file.uploaded),
    },
    {
      label: 'Kansio:',
      value: folder ? (
        <Link href={`/kansio/${folder.id}`} className="text-primary hover:text-primary/75">
          {folder.name}
        </Link>
      ) : (
        <Link href="/kansiot" className="text-primary hover:text-primary/75">
          Ei kansiota
        </Link>
      ),
    },
    {
      label: 'Tyyppi:',
      value: cleanDataType(file.type),
    },
    {
      label: 'Näkyvyys:',
      value: (
        <span className="flex gap-1 items-center">
          {file.linkShare && <span title="Jaettu" className="text-xs text-success"><Share2 size={18} /></span>}
          {file.linkShare ? 'Linkki' : 'Yksityinen'}
        </span>
      ),
    },
    {
      label: 'Salasana suojattu:',
      value: (
        <span className="flex gap-1 items-center">
          {file.passwordProtected && <span title="Salasana suojattu" className="text-xs text-success"><LockKeyhole size={18} /></span>}
          {file.passwordProtected ? 'Kyllä' : 'Ei'}
        </span>
      ),
    },
  ];

  return (
    <div className="flex flex-col w-full p-4 rounded-lg bg-secondary">
      <ul className="flex flex-col text-sm">
        {fileInfoFields.map((field, index) => (
          <li
            key={index}
            className="flex gap-4 items-baseline justify-between border-b border-dashed border-navlink p-1 last:border-none"
          >
            <strong className="whitespace-nowrap">{field.label}</strong>
            {field.value}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default FileInfo;