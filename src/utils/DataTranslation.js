import { parse, format } from 'date-fns';

export const translateFileSize = (bytes) => {
    if (bytes === 0) return '0 t';
    
    const k = 1024;
    const sizes = ['t', 'Kt', 'Mt', 'Gt', 'Tt'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const returnGeneralFiletype = (type) => {
    if (type.includes('image')) {
        return 'image';
    } else if (type.includes('video')) {
        return 'video';
    } else if (type.includes('audio')) {
        return 'audio';
    } else if (type.includes('pdf')) {
        return 'pdf';
    } else {
        return 'document';
    }
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

// Convert date to simple form: d.m.yyyy klo. hh:mm
export const convertDate = (date) => {
    if (!(date instanceof Date)) {
        throw new Error("Invalid date object");
    }

    const day = date.getDate().toString().padStart(2, '0'); 
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); 
    const year = date.getFullYear(); 
    const hours = date.getHours().toString().padStart(2, '0'); 
    const minutes = date.getMinutes().toString().padStart(2, '0'); 

    return `${day}.${month}.${year} klo. ${hours}:${minutes}`;
};


// CONVERT FOLDERS
// Transform folder data for public use
export const transformFolderDataPublic = (folder) => {
    return {
        docType: folder.docType,
        id: folder.folderID,
        name: folder.folderName,
        parent: {
            id: folder.parentID,
            name: folder.parentFolderName
        },
        fileCount: folder.fileCount,
        user: {
            id: folder.userID,
            name: folder.userName,
            email: folder.userEmail
        },
        createdAt: new Date(folder.createdAt.seconds * 1000),
        modifiedAt: new Date(folder.modifiedAt.seconds * 1000),
        passwordProtected: folder.pwdProtected,
        sharing: {
            link: folder.linkShare,
            url: folder.shareUrl,
            group: folder.groupShare,
            groups: folder.shareGroups,
        }
    };
}

// Transform folder data for private use
export const transformFolderDataPrivate = (folder) => {
    return {
        docType: 'folder',
        folderID: folder.id,
        folderName: folder.name,
        parentFolderName: parentFolder.name,
        parentID: parent.id,
        fileCount: folder.fileCount,
        userID: folder.user.id,
        userName: folder.user.name,
        userEmail: folder.user.email,
        createdAt: folder.created instanceof Date ? folder.created : new Date(folder.created.seconds * 1000),
        modifiedAt: folder.modified instanceof Date ? folder.modified : new Date(folder.modified.seconds * 1000),
        pwdProtected: folder.passwordProtected,
        pwd: folder.password,
        linkShare: folder.sharing.link,
        groupShare: folder.sharing.group,
        shareGroups: folder.sharing.groups,
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
        shareUrl: file.shareUrl,
        folder: file.folderID,
        linkShare: file.linkShare,
        groupShare: file.groupShare,
        shareGroups: file.shareGroups,
        passwordProtected: file.pwdProtected,
        password: '',
        uploadedBy: file.uploadedBy,
        user: {
            id: file.userID,
            name: file.userName,
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
        shareUrl: file.shareUrl,
        folderID: file.folder,
        linkShare: file.linkShare,
        groupShare: file.groupShare,
        shareGroups: file.shareGroups,
        pwdProtected: file.passwordProtected,
        pwd: file.password,
        userName: file.user.name,
        userEmail: file.user.email,
        userID: file.user.id,
        uploadedAt: file.uploadedAt instanceof Date ? file.uploadedAt : new Date(file.uploadedAt.seconds * 1000),
        modifiedAt: file.modifiedAt instanceof Date ? file.modifiedAt : new Date(file.modifiedAt.seconds * 1000)
    };
}