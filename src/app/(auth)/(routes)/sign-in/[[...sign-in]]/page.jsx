import { SignIn } from '@clerk/nextjs'
import Link from 'next/link'

export default function Page() {
    return (
        <main className="bg-background relative">
            <div className="fixed flex top-0 left-0 right-0 flex-col justify-center items-center h-screen box-border">
                <div className="flex flex-col items-center gap-2 mb-4">
                    <h1 className="text-xl md:text-3xl font-bold text-center">Kirjaudu sisään <span className='text-primary'>Datakaappiin</span></h1>
                    <Link href='/' className='text-navlink hover:text-primary'>Palaa etusivulle</Link>
                </div>
                <SignIn />
            </div>
        </main>
    )
}