const acceptedFileTypes = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/bmp",
    "image/webp",
    "image/svg+xml",
    "audio/mpeg",
    "audio/mp3",
    "audio/wma",
    "audio/ogg",
    "audio/wav",
    "video/mp4",
    "video/quicktime",
    "video/avi",
    "video/mpeg",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "text/plain",
    "application/zip",
    "application/x-rar-compressed",
    "application/x-7z-compressed",
    "application/x-tar",
    "application/x-gzip",
    "application/x-bzip2",
];

export const validateFile = (file) => {
    if (file && file.size > 5 * 1024 * 1024) {
        return "Tiedosto " + file.name + " on liian suuri. Maksimi koko on 5Mt"
    }
    if (file && !acceptedFileTypes.includes(file.type)) {
        return "Tiedoston " + file.name + " tyyppi ei ole sallittu (" + file.type + ")"
    }
    return null
}
