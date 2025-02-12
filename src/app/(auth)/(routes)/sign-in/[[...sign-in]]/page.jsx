import { SignIn } from '@clerk/nextjs'

export default function Page() {
    return (
        <main className="bg-background relative">
            <div className="fixed flex top-0 left-0 right-0 flex-col justify-center items-center h-screen box-border">
                <h1 className="text-3xl font-bold text-center mb-6">Kirjaudu sisään <span className='text-primary'>Data-Kaappiin</span></h1>
                <SignIn />
            </div>
        </main>
    )
}