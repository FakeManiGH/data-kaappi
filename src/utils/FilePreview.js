export const getCardPreview = ({ file }) => {
    if (file.fileType.includes('image')) {
        return (
            <img src={file.fileUrl} alt={file.fileName} className="w-full object-cover rounded-lg" />
        );
    } else if (file.fileType.includes('video')) {
        return (
            <video src={file.fileUrl} controls className="w-full object-cover rounded-lg" />
        );
    } else if (file.fileType.includes('audio')) {
        return (
            <audio src={file.fileUrl} controls className="w-full object-cover rounded-lg" />
        );
    } else {
        return (
            <img src='/icons/file.png' alt='File PNG illustration' />
        );
    }
}