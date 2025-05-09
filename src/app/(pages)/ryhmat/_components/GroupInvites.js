import { ChevronDown, ChevronDownCircle, ChevronUp, ChevronUpCircle, PlusCircle, UserPlus, UserPlus2, Users2 } from 'lucide-react'
import React, { useState } from 'react'

function GroupInvites() {
    const [open, setOpen] = useState(false);

    const handleRequestApproval = async (e) => {
        e.preventDefault();
    }

    return (
        <form className={`flex flex-col py-2 text-sm border-b border-contrast`} onSubmit={handleRequestApproval}>
            <div className='flex items-center gap-2 justify-between cursor-pointer group' onClick={() => setOpen(!open)} >
                <h2 className='text-base font-semibold'>Saitko kutsun rymään?</h2>
                <button type='button' onClick={() => setOpen(!open)}>
                   {open ? <ChevronUpCircle className='text-red-500 hover:text-red-600 group-hover:text-red-600' /> : <ChevronDownCircle className='text-foreground hover:text-primary group-hover:text-primary' />}
                </button>
            </div>

            <div className={`transition-all origin-top ${open ? 'scale-y-100 h-full' : 'scale-y-0 h-0'}`}>
                <p className='text-xs text-orange-500 mb-2'>Syötä kutsussa saamasi koodi alla olevaan kenttään hyväksyäksesi kutsu.</p>

                <div className='flex flex-col'>
                    <label htmlFor='kutsukoodi' className='text-gray-700 dark:text-gray-300'>Kutsukoodi:</label>

                    <div className='flex items-center gap-2 flex-nowrap'>
                        <input
                            id='kutsukoodi'
                            name='kutsukoodi'
                            placeholder='Syötä kutsukoodi...'
                            className='w-full py-2.5 px-3 rounded-md bg-secondary text-sm border border-transparent outline-none focus:border-primary focus:ring-1'
                        />
                        <button
                            type='submit'
                            className='py-2 px-3 bg-primary text-white hover:bg-primary/75 rounded-lg whitespace-nowrap'
                        >
                            Hyväksy kutsu
                        </button>
                    </div>
                </div>
            </div>
        </form>
    )
}

export default GroupInvites