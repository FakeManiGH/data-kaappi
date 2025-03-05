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
                        className="flex gap-1 items-center justify-center rounded-full border border-navlink w-72 px-5 py-3
                            text-lg text-navlink shadow-md shadow-black/25 hover:shadow-sm hover:border-primary 
                            hover:text-foreground transition-all"
                        href="/sign-in"
                    >   
                        <ChevronsRight className='text-primary' />
                        Aloita tästä
                        <ChevronsLeft className='text-primary' />
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