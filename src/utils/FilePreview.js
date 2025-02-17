import { cleanDataType } from "./DataTranslation";

export const getCardPreview = ({ file }) => {
    if (file.fileType.includes('image')) {
        return (
            <img src={file.fileUrl} alt={file.fileName} style={{maxHeight: '120px', objectFit:'contain'}} />
        );
    } else if (file.fileType.includes('video')) {
        return (
            <video src={file.fileUrl} controls className="w-full object-cover rounded-lg" />
        );
    } else if (file.fileType.includes('audio')) {
        return (
            <div className='flex flex-col items-center justify-center gap-2 w-full h-full bg-background rounded-lg'>
                <img src='/icons/audio.png' alt='Audio PNG illustration' style={{maxHeight: '100px'}} />
                <audio src={file.fileUrl} className="w-full object-cover rounded-lg" />
            </div>
        );
    } else {
        return (
            <div className='flex flex-col items-center justify-center gap-2 w-full h-full bg-background rounded-lg'>
                <img src='/icons/file.png' alt='File PNG illustration' style={{maxHeight: '100px'}} />
                <p className="text-sm text-navlink">{cleanDataType(file.fileType)}</p>
            </div>
        );
    }
}

export const getFilepagePreview = (file) => {
    if (file.fileType.includes('image')) {
        return (
            <img src={file.fileUrl} alt={file.fileName} className="h-64 w-auto object-contain rounded-lg" />
        );
    } else if (file.fileType.includes('video')) {
        return (
            <video src={file.fileUrl} controls className="h-64 w-auto object-contain rounded-lg" />
        );
    } else if (file.fileType.includes('audio')) {
        return (
            <div className='flex flex-col gap-2 items-center'>
            <img src='/icons/audio.png' alt='Audio PNG illustration' className="h-48 w-auto object-contain rounded-lg" />
            <audio src={file.fileUrl} controls className="max-w-52 h-auto rounded-lg" />
            </div>
        );
    } else {
        return (
            <img src='/icons/file.png' alt='File PNG illustration' className="h-64 w-auto object-contain rounded-lg" />
        );
    }
}