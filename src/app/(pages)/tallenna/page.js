"use client";
import React from 'react'
import UploadForm from './_components/UploadForm'


function Upload() {

  return (
    <div className='p-4 px-6 md:px-16'>
      <h2 className='text-center text-3xl sm:text-4xl mt-5 mb-4'><strong className='text-primary'>Tallenna</strong> tiedostoja kaappiisi</h2>
      <UploadForm />
    </div>
  )
}

export default Upload;