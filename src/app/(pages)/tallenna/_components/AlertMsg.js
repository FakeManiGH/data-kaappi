import { AlertCircle } from 'lucide-react'
import { X } from 'lucide-react'
import React from 'react'

function AlertMsg({ msg, success }) {
  const [isOpen, setIsOpen] = React.useState(true)

  return (
    isOpen &&
      <div className={`flex items-center flex-1 text-sm justify-center w-full gap-2 p-4 mt-4 text-white dark:bg-opacity-40 
      rounded-lg ${success ? 'bg-success' : 'bg-red-500 dark:bg-red-500'}`}>
          <AlertCircle size='24' />
          <p>{msg}</p>
          <button className='ml-auto' onClick={() => setIsOpen(false)}>
            <X size='24' />
          </button>
      </div>
  )
}

export default AlertMsg