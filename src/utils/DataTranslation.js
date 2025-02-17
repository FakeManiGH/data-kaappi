import { parse, format } from 'date-fns';

export const translateFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bittiä', 'Kt', 'Mt', 'Gt', 'Tt'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};


export const formatDateToCollection = (date) => {
    return format(date, 'HHmmddMMyyyy')
}

export const formatDateFromCollection = (dateString) => {
    const parsedDate = parse(dateString, 'HHmmddMMyyyy', new Date())
    return format(parsedDate, 'd.M.yyyy HH:mm')
}

export const cleanDataType = (type) => {
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