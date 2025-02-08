import { SignIn } from '@clerk/nextjs'

export default function Page() {
    return (
        <section className="bg-background">
            <div className="container mx-auto px-4">
            <div className="flex flex-col justify-center items-center h-screen">
                <h1 className="text-3xl font-bold text-center mb-8">Kirjaudu sisään <span className='text-primary'>Data-Kaappiin</span></h1>
                <SignIn className="w-full max-w-md" />
            </div>
            </div>
        </section>
    )
}