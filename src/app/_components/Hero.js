import React from 'react'
import { ChevronsLeft, ChevronsRight } from 'lucide-react'

function Hero() {
    return (
        <main>
            <div className='flex flex-col gap-2 justify-center items-center bg-[url(/images/hero.png)] bg-center bg-contain bg-h-full rounded-r-full ml-[-2rem] h-80' />

            <div 
                className="flex flex-col gap-6 px-4 py-4 mt-4 mx-auto max-w-3xl"
            >
                <h1 className='text-5xl font-extrabold text-foreground'>Datakaappi</h1>

                <p className="text-2xl font-semibold">
                    <span className='text-primary font-semibold'>Säilytä</span> ja <span className='text-primary font-semibold'>jaa</span> tärkeimmät tiedostosi turvallisesti ja helposti.
                </p>

                <p>
                    Datakaappi on suunniteltu kiinnittäen ertityistä huomiota käyttäjäystävällisyyteen ja turvallisuuteen.
                    Palvelun avulla <strong>säilytät</strong>, <strong>selaat</strong> ja <strong>jaat</strong> tiedostoja helposti ja turvallisesti 
                    läheisten-, ystävien-, tai esimerkiksi kollegoiden kanssa. Luo ilmainen tili jo tänään.
                </p>

                <div className="flex flex-col items-center gap-4">
                    <a
                        className="flex gap-3 items-center justify-center bg-primary w-72 px-5 py-3 font-semibold 
                            text-lg text-white hover:bg-primary/75 hover:gap-1 transition-all"
                        href="/sign-in"
                    >   
                        <ChevronsRight />
                        Aloita tästä
                        <ChevronsLeft />
                    </a>

                    <a
                        className="text-md text-primary hover:text-primary/75"
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