import { cleanDataType } from "./TranslateData";

export const getCardPreview = ({ file }) => {
    if (file.fileType.includes('image')) {
        return (
            <img src={file.fileUrl} alt={file.fileName} className="rounded-lg" />
        );
    } else if (file.fileType.includes('video')) {
        return (
            <video src={file.fileUrl} controls className="w-full object-cover rounded-lg" />
        );
    } else if (file.fileType.includes('audio')) {
        return (
            <div className='flex flex-col items-center justify-center gap-2 w-full h-full bg-background rounded-lg'>
                <img src='/icons/audio.png' alt='Audio PNG illustration' />
                <audio src={file.fileUrl} controls className="w-full object-cover rounded-lg" />
            </div>
        );
    } else {
        return (
            <div className='flex flex-col items-center justify-center gap-2 w-full h-full bg-background rounded-lg'>
                <img src='/icons/file.png' alt='File PNG illustration' />
                <p className="text-sm text-navlink">{cleanDataType(file.fileType)}</p>
            </div>
        );
    }
}