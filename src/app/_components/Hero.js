import React from 'react'
import { ChevronsLeft, ChevronsRight } from 'lucide-react'

function Hero() {
    return (
        <main>
            <div className="flex flex-col items-center gap-6 mx-auto mt-10 max-w-2xl text-center">
                <img className="w-40" src="/logo.svg" alt="logo" />

                <h1 className="text-3xl font-extrabold sm:text-5xl">
                    <strong className='text-primary'>Säilytä</strong> ja <strong className='text-primary'>jaa</strong> tärkeimmät tiedostosi 
                    turvallisesti.
                </h1>

                <p className="text-lg">
                    Datakaappi on helppo ja turvallinen tapa säilyttää ja jakaa tärkeät tiedostosi.
                    <br />
                    Luo <strong>ilmainen</strong> tili ja aloita kättö tänään!
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
        </main>
    )
}

export default Hero