export const getFileIcon = (fileType) => {
    if (fileType.includes('image')) {
      return '/icons/image.png';
    } else if (fileType.includes('video')) {
      return '/icons/video.png';
    } else if (fileType.includes('audio')) {
      return '/icons/audio.png';
    } else {
      return '/icons/file.png';
    }
  };