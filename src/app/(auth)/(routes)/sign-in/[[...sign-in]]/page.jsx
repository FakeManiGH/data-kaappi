import { SignIn } from '@clerk/nextjs'
import { Home } from 'lucide-react'
import Link from 'next/link'

export default function Page() {
    return (
        <main className="bg-background relative">
            <div className="fixed flex top-0 left-0 right-0 flex-col justify-center items-center h-screen box-border">
                <div className="flex flex-col items-center gap-2 mb-4">
                    <h1 className="text-xl md:text-4xl text-center">Kirjaudu sisään <span className='text-primary'>Datakaappiin</span></h1>
                </div>
                <SignIn />
                <Link href='/' className='flex items-center gap-1 mt-4 px-3 py-2 rounded-lg bg-gradient-to-br text-white from-primary to-blue-800
                    hover:bg-primary/75 '
                >
                    <Home />
                    Palaa etusivulle
                </Link>
            </div>
        </main>
    )
}