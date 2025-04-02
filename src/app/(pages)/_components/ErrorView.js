import { CloudAlert, RotateCw } from 'lucide-react'
import React from 'react'

function ErrorView({ message }) {
  return (
    <main>
        <div className='flex flex-col gap-4 items-center justify-center h-96'>
            <CloudAlert size={72} className='text-red-500' />
            <h1 className='text-2xl md:text-4xl text-red-500 font-bold'>Jotain meni vikaan...</h1>

            {message &&
            <p className='text-center text-md text-navlink'>
                <strong className='text-foreground'>Virhe: </strong>
                {message}
            </p>}

            <button 
                className='flex items-center gap-2 text-sm text-primary hover:text-primary/75'
                onClick={() => window.location.reload()}
            >
                <RotateCw size={20} />
                Yritä uudelleen
            </button>

            <div className='flex flex-col gap-2 p-6 border border-contrast bg-background rounded-lg mt-4'>
                <p className='text-sm'>Jos ongelma jatkuu, ota yhteyttä ylläpitoon.</p>
                <p className='text-sm'><strong>Sähköposti:</strong> <a href='mailto:timo.anjala@gmail.com' className='text-primary hover:text-primary/75'>timo.anjala@gmail.com</a></p>
            </div>
        </div>
    </main>
  )
}

export default ErrorView