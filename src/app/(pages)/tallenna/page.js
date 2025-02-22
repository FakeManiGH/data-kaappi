"use client";
import React from 'react'
import UploadForm from './_components/UploadForm'


function Page() {
  return (
    <main className='mt-4'>
      <h1 className='text-2xl md:text-3xl'><strong>Tallenna tiedostoja</strong></h1>
      <p className='text-sm'>Tallenna tiedostoja Datakaappiisi.</p>
      <UploadForm />
    </main>
  )
}

export default Page;