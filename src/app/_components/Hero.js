import React from 'react'
import { ChevronsLeft, ChevronsRight } from 'lucide-react'

function Hero() {
    return (
        <>
        <div className='w-full flex flex-col sm:flex-row items-center gap-4 justify-center h-96 rounded-xl rounded-b-full bg-gradient-to-b from-transparent to-secondary shadow-lg shadow-black/25'>
            <img className="w-40" src="/logo.svg" alt="logo" />
            <h1 className='text-5xl font-bold'>Datakaappi</h1>
        </div>

        <main>
            <div className="flex flex-col items-center gap-6 mx-auto text-center">
                <div className='flex flex-col items-center gap-6 mx-auto max-w-2xl text-center'>
                    <h2 className="text-4xl font-semibold sm:text-5xl">
                        <strong className='text-primary'>Säilytä</strong> ja <strong className='text-primary'>jaa</strong> tärkeimmät tiedostosi 
                        turvallisesti.
                    </h2>

                    <p className="text-lg">
                        Datakaappi on helppo ja turvallinen tapa säilyttää ja jakaa tärkeät tiedostosi.
                        <br />
                        Luo ilmainen tili jo tänään!
                    </p>

                    <div className="flex flex-col items-center gap-3 w-full">
                        <a
                            className="flex gap-3 items-center justify-center bg-gradient-to-br from-primary to-blue-800 w-72 px-5 py-3 rounded-full
                                text-lg text-white hover:to-primary hover:gap-1 shadow-md shadow-black/25 transition-all"
                            href="/sign-in"
                        >   
                            <ChevronsRight />
                            Aloita tästä
                            <ChevronsLeft />
                        </a>

                        <a
                            className="text-md text-navlink hover:text-primary"
                            href="/tietoa"
                        >
                            Lue lisää
                        </a>
                    </div>
                </div>
            </div>
        </main>
        </>
    )
}

export default Hero