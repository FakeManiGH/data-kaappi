import React from 'react';
import { translateFileSize, cleanDataType, convertDate } from '@/utils/DataTranslation';
import { LockKeyhole, Share2 } from 'lucide-react';
import Link from 'next/link';

function FileInfo({ file }) {
  if (!file) return null;

  // Define the file info fields
  const fileInfoFields = [
    {
      label: 'Koko:',
      value: translateFileSize(file.size),
    },
    {
      label: 'Tallennettu:',
      value: convertDate(file.uploadedAt),
    },
    {
      label: 'Tyyppi:',
      value: cleanDataType(file.type),
    },
  ];

  return (
    <div className="flex flex-col w-full p-4 rounded-lg bg-secondary shadow-lg shadow-black/25">
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