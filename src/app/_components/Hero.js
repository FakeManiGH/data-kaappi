import React from 'react'
import Constant from '../../utils/Constant'

function Hero() {
    return (
        <main>
            <div className="flex flex-col items-center gap-6 mx-auto mt-10 max-w-2xl text-center">
                <img className="w-40" src="/logo.svg" alt="logo" />

                <h1 className="text-3xl font-extrabold sm:text-5xl">
                    <strong className='text-primary'>Tallenna</strong> ja <strong className='text-primary'>säilytä</strong> tärkeimmät tiedostosi 
                    turvallisesti.
                </h1>

                <p className="sm:text-xl/relaxed">
                    Lisäksi voit <strong>jakaa</strong> tiedostoja helposti läheistesi kanssa ja <strong>lisä-suojata</strong> tärkeimmät tiedostosi salasanalla.
                </p>

                <div className="flex flex-col items-center gap-3 w-full">
                    <a
                        className="flex items-center justify-center w-full sm:w-72 rounded-full bg-primary text-white px-12 py-3 text-md md:text-xl font-semibold hover:bg-primary/90 active:bg-primary/90"
                        href="/tallenna"
                    >
                        Aloita tästä
                    </a>

                    <a
                        className="flex items-center justify-center w-full sm:w-64 rounded-full bg-secondary text-white px-12 py-3 text-sm font-normal hover:bg-secondary/90 active:bg-secondary/90"
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