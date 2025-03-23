import React, { useState } from 'react';
import AlertMsg from './AlertMsg';
import { validateFile } from '@/utils/FileValidation';
import { useAlert } from '@/app/contexts/AlertContext';
import { getUser, updateUserDocumentValue } from '@/app/file-requests/api';
import { FilePlus2, Music2 } from 'lucide-react';
import { useUser } from '@clerk/nextjs';

function UploadForm({ uploadFile, files, setFiles, fileErrors, setFileErrors, setUploadProgress, setUserDoc }) {
  const [isDragging, setIsDragging] = useState(false);
  const dragCounter = React.useRef(0);
  const { showAlert } = useAlert();
  const { user } = useUser();

  // Handle drag enter
  const handleDragEnter = (event) => {
    event.preventDefault();
    dragCounter.current += 1; // Increment drag counter
    setIsDragging(true);
  };

  // Handle drag leave
  const handleDragLeave = (event) => {
    event.preventDefault();
    dragCounter.current -= 1; // Decrement drag counter
    if (dragCounter.current === 0) {
      setIsDragging(false); // Only reset if no more drag events
    }
  }; 
  
  // Handle file drop
  const handleFileDrop = (event) => {
    event.preventDefault();
    dragCounter.current = 0; // Reset drag counter
    setIsDragging(false);
    processFiles(event.dataTransfer.files);
  };

  // Handle file change
  const handleFileChange = (event) => {
    processFiles(event.target.files);
  };

  // Process files and validate
  const processFiles = (fileList) => {
    setFileErrors([]);
    let filesArray = [...files];
    let fileErrors = [];

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      const error = validateFile(file);
      if (error) {
        fileErrors.push(error);
        filesArray = filesArray.filter(f => f !== file);
      } else {
        filesArray.push(file);
      }
    }

    setFiles(filesArray);
    setFileErrors(fileErrors);
    setUploadProgress(new Array(filesArray.length).fill(0));
  };

  // Upload files to Firebase Storage
  const uploadFiles = async (files) => {
    const userDoc = await getUser(user.id);
    console.log(userDoc);
    
    if (!userDoc) {
      showAlert('Käyttäjää ei löytynyt.', 'error');
      return;
    }

    if (userDoc.usedSpace >= userDoc.totalSpace) {
      showAlert('Tilasi on täynnä. Poista tiedostoja tai ota yhteyttä ylläpitoon.', 'error');
      return;
    }

    // Upload files
    const uploadPromises = files.map(file => uploadFile(file));
    await Promise.all(uploadPromises);

    // Update used space
    const totalSize = files.reduce((acc, file) => acc + file.size, 0);
    await updateUserDocumentValue(user.id, 'usedSpace', userDoc.usedSpace + totalSize);
    setUserDoc({ ...userDoc, usedSpace: userDoc.usedSpace + totalSize });

    showAlert('Tiedosto(t) ladattu onnistuneesti.', 'success');
    setFiles([]);
  };
    
  // Handle form submit
  const handleSubmit = (event) => {
    event.preventDefault();
    uploadFiles(files);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <form className="w-full mb-1 text-center" onSubmit={handleSubmit}>
        <div
          className={`relative flex items-center justify-center w-full ${isDragging ? 'border-primary' : ''}`}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={(e) => e.preventDefault()} // Prevent default behavior
          onDrop={handleFileDrop}
        >
          {isDragging && (
            <span
              className="absolute w-full top-0 left-0 h-full z-10"
              onDragOver={(e) => e.preventDefault()} // Prevent default behavior
              onDrop={handleFileDrop} // Handle file drop
            ></span>
          )}

          <label
            htmlFor="dropzone-file"
            className={`flex flex-col items-center w-full max-w-full justify-center h-72 rounded-xl
              cursor-pointer border-4 border-dashed hover:border-primary transition-colors
              ${isDragging ? 'border-primary bg-primary/10' : 'border-contrast bg-background'}`}

          >
            <div className="flex flex-col max-w-full items-center justify-center p-4 text-center pt-5 pb-6">
              {isDragging ? (
                <p className="flex items-center flex-wrap gap-2 mb-2 text-xl text-foreground">
                  <Music2 size={24} className="text-primary" />
                  "<strong className='text-primary'>Let it go</strong>, let it go..."
                </p>
              ) : (
                <p className="flex items-center flex-wrap gap-2 mb-2 text-xl text-foreground">
                  <FilePlus2 size={24} className="text-primary" />
                  <strong className="text-primary">Klikkaa</strong> tai <strong className="text-primary">Tiputa</strong>
                </p>
              )}
              <p className="text-sm text-navlink">Kuva, Video ja Dokumetti -tiedostot (max. 5Mt / tiedosto)</p>
            </div>
            <input id="dropzone-file" type="file" accept="media_type" className="hidden" multiple onChange={handleFileChange} />
          </label>
        </div>

        <button 
          type="submit"
          className='w-full px-3 py-2.5 mt-2 rounded-full bg-gradient-to-br from-primary to-blue-800 shadow-black/25 shadow-md 
            text-white transition-all disabled:from-secondary disabled:to-contrast disabled:text-contrast disabled:shadow-none hover:to-primary'
          {...(files.length === 0 && { disabled: true })}
        >
          Tallenna
        </button>
      </form>
    </div>
  );
}

export default UploadForm;