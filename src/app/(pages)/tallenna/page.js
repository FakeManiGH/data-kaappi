"use client";
import React from 'react'
import UploadForm from './_components/UploadForm'



function Upload() {

  return (
    <main className='mt-4'>
      <h1 className='text-2xl md:text-3xl'><strong>Tallenna tiedostoja</strong></h1>
      <p className='text-sm'>Tallenna tiedostoja data-kaappiisi.</p>
      <UploadForm />
    </main>
  )
}

export default Upload;