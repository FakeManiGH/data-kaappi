import { parse, format } from 'date-fns';

export const translateFileSize = (bytes) => {
    if (bytes === 0) return '0 t';
    
    const k = 1024;
    const sizes = ['t', 'Kt', 'Mt', 'Gt', 'Tt'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

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

// Translate date to database format
export const DateDB = (date) => { 
    const dateDB = date.toLocaleString('fi-FI', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        timeZoneName: 'short'
    })
    return dateDB
}

// Translate date to public format
export const datePublic = (date) => {
    let dateDate = Date(date)
    const datePublic = dateDate.toLocaleString('fi-FI', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'none',
        timeZoneName: 'none'
    })
    return datePublic;
}


// CONVERT FOLDERS
// Transform folder data for public use
export const transformFolderDataPublic = (folder) => {
    return {
        docType: folder.docType,
        id: folder.folderID,
        name: folder.folderName,
        parent: folder.parentID,
        fileCount: folder.fileCount,
        user: {
            id: folder.userID,
            name: folder.userName,
            email: folder.userEmail
        },
        created: new Date(folder.createdAt.seconds * 1000),
        modified: new Date(folder.modifiedAt.seconds * 1000),
        passwordProtected: folder.pwdProtected,
        password: '',
        shared: folder.shared,
        sharedWith: folder.sharedWith
    }
}

// Transform folder data for private use
export const transformFolderDataPrivate = (folder) => {
    return {
        docType: 'folder',
        folderID: folder.id,
        folderName: folder.name,
        parentID: folder.parent,
        fileCount: folder.fileCount,
        userID: folder.user.id,
        userName: folder.user.name,
        userEmail: folder.user.email,
        createdAt: folder.created instanceof Date ? folder.created : new Date(folder.created.seconds * 1000),
        modifiedAt: folder.modified instanceof Date ? folder.modified : new Date(folder.modified.seconds * 1000),
        pwdProtected: folder.passwordProtected,
        pwd: folder.password,
        shared: folder.shared,
        sharedWith: folder.sharedWith
    }
}


// CONVERT FILES
// transform file data to public file data
export const transformFileDataPublic = (file) => {
    return {
        id: file.fileID,
        docType: file.docType,
        name: file.fileName,
        size: file.fileSize,
        type: file.fileType,
        url: file.fileUrl,
        shortUrl: file.shortUrl,
        folder: file.folderID,
        shared: file.shared,
        sharedWith: file.sharedWith,
        passwordProtected: file.pwdProtected,
        password: '',
        uploadedBy: file.uploadedBy,
        user: {
            id: file.userID,
            name: file.uploadedBy,
            email: file.userEmail
        },
        uploadedAt: new Date(file.uploadedAt.seconds * 1000),
        modifiedAt: new Date(file.modifiedAt.seconds * 1000)
    };
}

// transform file data to private file data
export const transformFileDataPrivate = (file) => {
    return {
        fileID: file.id,
        docType: file.docType,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        fileUrl: file.url,
        shortUrl: file.shortUrl,
        folderID: file.folder,
        shared: file.shared,
        sharedWith: file.sharedWith,
        pwdProtected: file.passwordProtected,
        pwd: file.password,
        uploadedBy: file.user.name,
        userEmail: file.user.email,
        userID: file.user.id,
        uploadedAt: file.uploadedAt instanceof Date ? file.uploadedAt : new Date(file.uploadedAt.seconds * 1000),
        modifiedAt: file.modifiedAt instanceof Date ? file.modifiedAt : new Date(file.modifiedAt.seconds * 1000)
    };
}