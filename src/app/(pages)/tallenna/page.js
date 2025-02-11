"use client";
import React from 'react'
import UploadForm from './_components/UploadForm'


function Upload() {

  return (
    <main>
      <h1 className='text-2xl sm:text-3xl'><strong>Tallenna tiedostoja</strong></h1>
      <p className='text-sm sm:text-base'>Tallenna tiedostoja omaan data-kaappiisi.</p>
      <UploadForm />
    </main>
  )
}

export default Upload;