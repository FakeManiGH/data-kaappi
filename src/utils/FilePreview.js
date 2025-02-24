import DownloadBtn from "@/app/_components/_common/DownloadBtn";
import { cleanDataType } from "./DataTranslation";

export const getCardPreview = ({ file }) => {
    if (file.fileType.includes('image')) {
        return (
            <img src={file.fileUrl} alt={file.fileName} style={{height: '100%', width: '100%', objectFit: 'cover'}} />
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
                <>
                <img src='/icons/image.png' alt={file.fileName} style={{height: '100%', width: '100%', objectFit: 'contain'}} />
                <p className="text-sm text-navlink italic">Salasana suojattu</p>
                </>
            );
        } else {
            return (
                <img src={file.fileUrl} alt={file.fileName} style={{height: '100%', width: '100%', objectFit: 'cover'}} />
            );
        }
    } else if (file.fileType.includes('video')) {
        if (file.password) {
            return (
                <>
                <img src='/icons/video.png' alt={file.fileName} style={{height: '100%', width: '100%', objectFit: 'contain'}} />
                <p className="text-sm text-navlink italic">Salasana suojattu</p>
                </>
            );
        } else {
            return (
                <video src={file.fileUrl} controls style={{height: '100%', width: '100%', objectFit: 'contain'}} />
            );
        }
    } else if (file.fileType.includes('audio')) {
        if (file.password) {
            return (
                <>
                <img src='/icons/audio.png' alt='Audio-file PNG illustration' style={{height: '100%', width: '100%', objectFit: 'contain'}} />
                <p className="text-sm text-navlink italic">Salasana suojattu</p>
                </>
            );
        } else {
            return (
                <img src='/icons/audio.png' alt='Audio PNG illustration' style={{height: '100%', width: '100%', objectFit: 'contain'}} />
            );
        }
    } else {
        if (file.password) {
            return (
                <>
                <img src='/icons/file.png' alt='Audio-file PNG illustration' style={{height: '100%', width: '100%', objectFit: 'contain'}} />
                <p className="text-sm text-navlink italic">Salasana suojattu</p>
                </>
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
            <img src={file.fileUrl} alt={file.fileName} className="h-64 w-auto max-w-80 object-contain rounded-lg" />
        );
    } else if (file.fileType.includes('video')) {
        return (
            <video src={file.fileUrl} controls className="h-64 w-auto object-contain rounded-lg" />
        );
    } else if (file.fileType.includes('audio')) {
        return (
            <div className='flex flex-col gap-2 items-center'>
                <img src='/icons/audio.png' alt='Audio PNG illustration' className="h-64 w-auto object-contain rounded-lg" />
                <audio src={file.fileUrl} controls className="max-w-52 h-auto rounded-lg" />
            </div>
        );
    } else {
        return (
            <img src='/icons/file.png' alt='File PNG illustration' className="h-64 w-auto object-contain rounded-lg" />
        );
    }
}

export const getFullSizePreview = (file) => {
    if (file.fileType.includes('image')) {
        return (
            <img src={file.fileUrl} alt={file.fileName} />
        );
    } else if (file.fileType.includes('video')) {
        return (
            <video src={file.fileUrl} controls className="h-full w-full" />
        );
    } else if (file.fileType.includes('audio')) {
        return (
            <div className='flex flex-col gap-2 items-center'>
                <img src='/icons/audio.png' alt='Audio PNG illustration' className="h-full w-full" />
                <audio src={file.fileUrl} controls className="h-full w-full rounded-lg" />
            </div>
        );
    } else if (file.fileType.includes('pdf')) {
        return (
            <iframe src={file.fileUrl} className="h-full w-full" />
        );
    } else {
        return (
            <div className="flex flex-col gap-4 h-full w-full items-center justify-center">
                <h1 className="text-3xl text-center">Tiedostoa <strong>ei pysty</strong> esikatselemaan.</h1>
                <DownloadBtn url={file.fileUrl} fileName={file.fileName} />
            </div>
        );
    }
}