import { parse, format } from 'date-fns';

export const translateFileSize = (bytes) => {
    if (bytes === 0) return '0 Tavua';
    
    const k = 1024;
    const sizes = ['Tavua', 'Kt', 'Mt', 'Gt', 'Tt'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const formatDateFromCollection = (timestamp) => {
    return format(timestamp, 'd.M.yyyy HH:mm');
}

export const cleanDataType = (type) => {
    if (type.includes('word')) return 'WordDoc';
    if (type.includes('presentationml')) return 'PowerPoint';
    if (type.includes('spreadsheetml')) return 'Excel';
    if (type.includes('pdf')) return 'PDF';
    return type.split('/')[1].toUpperCase();
}

export const simplifyFileType = (type) => {
    if (type.includes('image') || type.includes('video') || type.includes('audio')) {
        return 'media';
    } else if (type.includes('application') || type.includes('text')) {
        return 'document';
    } else {
        return 'other';
    }
}