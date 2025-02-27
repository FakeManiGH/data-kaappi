import DownloadBtn from "@/app/(pages)/tiedosto/[id]/_components/DownloadBtn";
import { cleanDataType } from "./DataTranslation";

export const getCardPreview = ({ file }) => {
    if (file.fileType.includes('image')) {
        return (
            <img src={file.fileUrl} alt={file.fileName} style={{height: '100%', width: '100%', objectFit: 'contain'}} />
        );
    } else if (file.fileType.includes('video')) {
        return (
            <video src={file.fileUrl} controls style={{height: '100%', width: '100%', objectFit: 'contain'}} />
        );
    } else if (file.fileType.includes('audio')) {
        return (
            <img src='/icons/audio.png' alt='Audio PNG illustration' style={{height: '100%', width: '100%', objectFit: 'contain'}} />
        );
    } else {
        return (
            <img src='/icons/file.png' alt='File PNG illustration' style={{height: '100%', width: '100%', objectFit: 'contain'}} />
        );
    }
}

export const getSharedCardPreview = ({ file }) => {
    if (file.fileType.includes('image')) {
        if (file.password) {
            return (
                <img src='/icons/image.png' alt={file.fileName} style={{height: '100%', width: '100%', objectFit: 'contain'}} />
            );
        } else {
            return (
                <img src={file.fileUrl} alt={file.fileName} style={{height: '100%', width: '100%', objectFit: 'contain'}} />
            );
        }
    } else if (file.fileType.includes('video')) {
        if (file.password) {
            return (
                <img src='/icons/video.png' alt={file.fileName} style={{height: '100%', width: '100%', objectFit: 'contain'}} />
            );
        } else {
            return (
                <video src={file.fileUrl} controls style={{height: '100%', width: '100%', objectFit: 'contain'}} />
            );
        }
    } else if (file.fileType.includes('audio')) {
        if (file.password) {
            return (
                <img src='/icons/audio.png' alt='Audio-file PNG illustration' style={{height: '100%', width: '100%', objectFit: 'contain'}} />
            );
        } else {
            return (
                <img src='/icons/audio.png' alt='Audio PNG illustration' style={{height: '100%', width: '100%', objectFit: 'contain'}} />
            );
        }
    } else {
        if (file.password) {
            return (
                <img src='/icons/file.png' alt='Audio-file PNG illustration' style={{height: '100%', width: '100%', objectFit: 'contain'}} />
            );
        } else {
            return (
                <img src='/icons/file.png' alt='File PNG illustration' style={{height: '100%', width: '100%', objectFit: 'contain'}} />
            );
        }
    }
}

export const getFilepagePreview = (file) => {
    if (file.fileType.includes('image')) {
        return (
            <img src={file.fileUrl} alt={file.fileName} style={{height: '100%', width: '100%', objectFit: 'contain'}} />
        );
    } else if (file.fileType.includes('video')) {
        return (
            <video src={file.fileUrl} controls style={{height: '100%', width: '100%', objectFit: 'contain'}} />
        );
    } else if (file.fileType.includes('audio')) {
        return (
            <div className='flex flex-col gap-2 items-center'>
                <img src='/icons/audio.png' alt='Audio PNG illustration' style={{height: '100%', maxHeight: '300px', width: '100%', objectFit: 'contain'}} />
                <audio src={file.fileUrl} controls className="h-auto rounded-lg" />
            </div>
        );
    } else {
        return (
            <img src='/icons/file.png' alt='File PNG illustration' style={{height: '100%', maxHeight: '300px', width: '100%', maxWidth: '250px' , objectFit: 'contain'}} />
        );
    }
}

