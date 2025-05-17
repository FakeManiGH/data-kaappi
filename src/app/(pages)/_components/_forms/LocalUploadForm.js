import { X, FilePlus2, Music2, FolderPlus } from 'lucide-react'
import React, { useState, useRef } from 'react';
import { validateFile } from '@/utils/FileValidation';
import { useAlert } from '@/app/contexts/AlertContext';
import { useUser } from '@clerk/nextjs';
import { app, db } from '@/../firebaseConfig';
import { getStorage, getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { doc, increment, Timestamp, runTransaction } from "firebase/firestore";
import { getFileIcon } from '@/utils/GetFileIcon';
import { cleanDataType, simplifyFileType, transformFileDataPublic, translateFileSize } from '@/utils/DataTranslation';
import { generateRandomString } from '@/utils/GenerateRandomString';

function LocalUploadForm({ setFiles, currentFolder, setUploadPopup }) {
    const [isDragging, setIsDragging] = useState(false);
    const [newFiles, setNewFiles] = useState([]);
    const [fileErrors, setFileErrors] = useState([]);
    const [uploadProgress, setUploadProgress] = useState([]);
    const [uploading, setUploading] = useState(false);
    const dragCounter = useRef(0);
    const { showAlert } = useAlert();
    const { user } = useUser();
    const storage = getStorage(app);

    // Change selected folder
    const handleFolderChange = (e) => {
        const folder = e.target.value;
        setSelectedFolder(folder);
    }
    
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
        let filesArray = [...newFiles];
    
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
    
        setNewFiles(filesArray);
        setFileErrors(fileErrors);
        setUploadProgress(new Array(filesArray.length).fill(0));
    };
    
    // Handle form reset
    const handleFormReset = (e) => {
        setNewFiles([]);
        setFileErrors([]);
    }
    
    // Upload files
    const uploadFiles = async () => {
        if (uploading) {
            showAlert('Tallennus kesken...', 'info');
            return;
        }
    
        if (newFiles.length > 50) {
            showAlert('Voit ladata enintään 50 tiedostoa kerralla.', 'warning');
            return;
        }
    
        setUploading(true);
        const filesToUpload = [...newFiles];
        const maxConcurrentUploads = 5; // Limit to 5 concurrent uploads
        const uploadQueue = [...filesToUpload]; // Queue of files to upload
        const uploadProgressArray = new Array(filesToUpload.length).fill(0); // Track progress for each file
        const uploadedFiles = []; // Store successfully uploaded files
        let activeUploads = 0; // Track the number of active uploads
    
        const processNext = async () => {
            if (uploadQueue.length === 0) return;
    
            const file = uploadQueue.shift(); // Get the next file from the queue
            const index = filesToUpload.indexOf(file); // Get the index of the file
            activeUploads++; // Increment active uploads count
    
            const uploadPromise = new Promise(async (resolve, reject) => {
                const fileID = generateRandomString(11);
                const storageRef = ref(storage, `file-base/${user.id}/${fileID}`);
    
                try {
                    // Upload the file to Firebase Storage
                    const uploadTask = uploadBytesResumable(storageRef, file);
    
                    uploadTask.on(
                        'state_changed',
                        (snapshot) => {
                            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                            uploadProgressArray[index] = progress; // Update progress for this file
                            setUploadProgress([...uploadProgressArray]); 
                        },
                        (error) => {
                            console.error('Error uploading file:', error);
                            setFileErrors((prevErrors) => [...prevErrors, error.message]);
                            reject(error);
                        },
                        async () => {
                            try {
                                // Get the download URL after the file is uploaded
                                const downloadURL = await getDownloadURL(storageRef);
    
                                // Prepare file data for Firestore
                                const fileData = {
                                    docType: 'file',
                                    fileID,
                                    fileName: file.name,
                                    fileSize: parseFloat(file.size),
                                    fileBase: simplifyFileType(file.type),
                                    fileType: file.type,
                                    fileUrl: downloadURL,
                                    folderID: currentFolder ? currentFolder.id : null,
                                    linkShare: false,
                                    shareUrl: process.env.NEXT_PUBLIC_BASE_URL + 'jaettu-tiedosto/' + fileID,
                                    shareGroups: [],
                                    pwdProtected: false,
                                    pwd: '',
                                    userName: user.fullName,
                                    userID: user.id,
                                    userEmail: user.primaryEmailAddress.emailAddress,
                                    uploadedAt: Timestamp.fromDate(new Date()),
                                    modifiedAt: Timestamp.fromDate(new Date()),
                                };
    
                                // Firestore transaction (file-document)
                                await runTransaction(db, async (transaction) => {
                                    const userRef = doc(db, 'users', user.id);
                                    const userSnap = await transaction.get(userRef);
    
                                    if (!userSnap.exists()) {
                                        throw new Error('Käyttäjätietoja ei löytynyt.');
                                    }
    
                                    if (currentFolder) {
                                        const folderRef = doc(db, 'folders', currentFolder.id);
                                        const folderSnap = await transaction.get(folderRef);
    
                                        if (!folderSnap.exists()) {
                                            throw new Error(`Kansiota ei löytynyt tiedostolle ${file.name}`);
                                        }
    
                                        transaction.update(folderRef, { fileCount: increment(1) });
                                    }
    
                                    const fileRef = doc(db, 'files', fileID);
                                    transaction.set(fileRef, fileData);
    
                                    const currentUsedSpace = userSnap.data().usedSpace || 0;
                                    transaction.update(userRef, { usedSpace: currentUsedSpace + file.size });
                                });
    
                                uploadedFiles.push(transformFileDataPublic(fileData));
                                resolve();
                            } catch (error) {
                                console.error('Error saving file data or updating Firestore:', error);
    
                                // Delete the uploaded file if Firestore transaction fails
                                await deleteObject(storageRef).catch((deleteError) => {
                                    console.error('Error deleting file from storage:', deleteError);
                                });
    
                                setFileErrors((prevErrors) => [...prevErrors, `Tiedoston ${file.name} tallentaminen epäonnistui.`]);
                                reject(error);
                            }
                        }
                    );
                } catch (error) {
                    console.error('Error uploading file:', error);
                    setFileErrors((prevErrors) => [...prevErrors, `Tiedoston ${file.name} tallentaminen epäonnistui.`]);
                    reject(error);
                }
            });
    
            uploadPromise.finally(() => {
                activeUploads--; // Decrement active uploads count
                processNext(); // Start the next upload
            });
    
            await uploadPromise; // Wait for this upload to complete
        };
    
        // Start initial uploads
        const initialUploads = [];
        for (let i = 0; i < maxConcurrentUploads && uploadQueue.length > 0; i++) {
            initialUploads.push(processNext());
        }
    
        try {
            await Promise.all(initialUploads);
            while (activeUploads > 0 || uploadQueue.length > 0) {
                await new Promise((resolve) => setTimeout(resolve, 100)); // Wait for all uploads to finish
            }
            setFiles((prevFiles) => [...prevFiles, ...uploadedFiles]);
            setNewFiles([]);
            showAlert('Tiedostot tallennettu onnistuneesti.', 'success');
            setUploadPopup(false);
        } catch (error) {
            console.error('Error uploading files:', error);
            showAlert('Virhe tiedostojen tallentamisessa. Yritä uudelleen.', 'error');
        } finally {
            setUploading(false);
        }
    };

    // Remove file from filelist
    const removeFile = (file) => {
        setNewFiles((prevFiles) => prevFiles.filter((f) => f !== file));
    };


    return (
        <form className="w-full text-center mt-2">
            <div
                className='relative flex items-center justify-center w-full'
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={(e) => e.preventDefault()} 
                onDrop={handleFileDrop}
            >
                {isDragging && (
                    <span
                        className="absolute w-full top-0 left-0 h-full z-10"
                        onDragOver={(e) => e.preventDefault()} 
                        onDrop={handleFileDrop}
                    />
                )}
                <label
                    htmlFor="dropzone-file"
                    className={`flex flex-col items-center w-full max-w-full justify-center h-72 
                    cursor-pointer border-2 border-dashed border-primary hover:border-primary/75 bg-background transition-all
                    ${isDragging ? 'bg-contrast' : 'bg-background'}`}

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


            {/* File errors */}
            {fileErrors?.map((error, index) => (
                <div key={index} className='flex items-center gap-2 px-3 py-2 mt-2  justify-between text-sm text-white bg-red-500'>
                    <p>{error}</p>
                    <button onClick={() => setFileErrors((prevErrors) => prevErrors.filter((_, i) => i !== index))}>
                        <X />
                    </button> 
                </div>
            ))}
                        

            {/* File preview */}
            <div className='grid grid-cols-1 lg:grid-cols-2 w-full gap-2 mt-2'>
            {newFiles?.map((file, index) => (
                <div key={index} className='flex flex-1 items-center gap-3 p-2 bg-contrast  '>
                <img
                    src={getFileIcon(file?.type)} 
                    alt='file' 
                    width={40} 
                    height={40} 
                />
                <div className='flex flex-col justify-center gap-2 w-full overflow-hidden'>
                        <div className='flex items-center flex-wrap gap-2 overflow-hidden'>
                            <p className='text-sm text-foreground truncate'>{file.name}</p>
                            <p className='text-xs text-navlink'>{cleanDataType(file.type)}</p>
                            <p className='text-xs text-navlink'>{translateFileSize(file.size)}</p>
                        </div>

                        {uploadProgress[index] > 0 && 
                        <div className='text-center w-full bg-gray-300  dark:bg-gray-600'>
                            <div 
                                className={`h-full text-center text-xs text-white  ${uploadProgress[index] == 100 ? 'bg-success' : 'bg-primary'}`}
                                style={{ width: `${uploadProgress[index]}%` }}
                            >
                                {`${Number(uploadProgress[index]).toFixed(0)}%`}
                            </div>
                        </div>
                        }
                    </div>

                    <button 
                        title='Poista tiedosto' 
                        onClick={() => removeFile(file)}
                        className='cursor-pointer text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-500'
                    >
                        <X />
                    </button>
                </div>
            ))}
            </div>


            {/* Buttons */}
            {newFiles.length > 0 && !uploading &&
                <div className='flex items-center gap-1 mt-2'>
                    <button 
                        type="button"
                        className='w-full px-3 py-2  bg-primary text-white transition-all hover:bg-primary/75'
                        {...(newFiles.length === 0 && { disabled: true })}
                        onClick={uploadFiles}
                    >
                        Tallenna
                    </button>

                    <button 
                        type="reset"
                        onClick={handleFormReset}
                        className='w-full px-3 py-2  bg-gray-500 hover:bg-gray-600 text-white transition-colors'
                    >
                        Tyhjennä
                    </button>
                </div>
            }
        </form>
    )
}

export default LocalUploadForm