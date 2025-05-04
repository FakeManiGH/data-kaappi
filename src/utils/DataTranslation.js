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
        },
        fileCount: folder.fileCount,
        user: {
            name: folder.userName,
        },
        created: new Date(folder.createdAt.seconds * 1000),
        modified: new Date(folder.modifiedAt.seconds * 1000),
        passwordProtected: folder.pwdProtected,
        sharing: {
            link: folder.linkShare,
            url: folder.shareUrl,
            groups: folder.shareGroups,
        }
    };
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
        folder: file.folderID,
        passwordProtected: file.pwdProtected,
        sharing: {
            link: file.linkShare,
            url: file.shareUrl,
            groups: file.shareGroups
        },
        user: {
            name: file.userName,
        },
        uploaded: new Date(file.uploadedAt.seconds * 1000),
        modified: new Date(file.modifiedAt.seconds * 1000)
    };
}



// CONVERT GROUPS
// Convert group-data public
export const transformGroupDataPublic = (group) => {
    return {
        docType: group.docType,
        id: group.groupID,
        name: group.groupName,
        desc: group.groupDesc,
        visibility: group.groupVisibility,
        created: new Date(group.createdAt.seconds * 1000),
        passwordProtected: group.pwdProtected,
        members: group.groupMembers,
        user: {
            id: group.userID,
            name: group.userName,
            email: group.userEmail
        }
    }
}