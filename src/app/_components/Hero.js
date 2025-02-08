import React from 'react'
import Constant from '../../utils/Constant'

function Hero() {
    return (
        <section>
            <div className="mx-auto max-w-screen-xl px-4 py-32 lg:flex">
                <div className="mx-auto max-w-xl text-center">
                <h1 className="text-3xl font-extrabold sm:text-5xl">
                    <strong className='text-primary'>Tallenna</strong>, <strong className='text-primary'>säilytä</strong> ja <strong className='text-primary'>jaa</strong> tiedostoja helposti kaikilla laitteillasi.
                </h1>

                <p className="mt-6 sm:text-xl/relaxed">
                    {Constant.desc}
                </p>

                <div className="mt-8 flex flex-wrap justify-center gap-4">
                    <a
                    className="block w-full rounded-full bg-primary px-12 py-3 text-sm font-semibold text-white shadow hover:bg-primary/90 focus:outline-none focus:ring active:bg-red-500 sm:w-auto"
                    href="/tallenna"
                    >
                    Tallenna tiedosto
                    </a>

                    <a
                    className="block w-full rounded-full bg-secondary px-12 py-3 text-sm font-semibold text-white shadow hover:bg-secondary/90 focus:outline-none focus:ring active:text-red-500 sm:w-auto"
                    href="/tietoa"
                    >
                    Lue lisää
                    </a>
                </div>
                </div>
            </div>
        </section>
    )
}

export default Hero