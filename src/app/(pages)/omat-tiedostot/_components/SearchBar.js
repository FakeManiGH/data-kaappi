import { Search } from 'lucide-react'
import React from 'react'
import { parse, set } from 'date-fns'

function SearchBar({ files, setSearchedFiles, setSearch }) {

    const handleSearch = (e) => {
        if (e.target.value.length > 1) {
            const searchValue = e.target.value.toLowerCase()
            const filtered = files.filter((file) => {
                return file.fileName.toLowerCase().includes(searchValue)
            })
            setSearchedFiles(filtered)
            setSearch(true)
        } else {
            setSearchedFiles(files)
            setSearch(false)
        }
    }

    return (
        <div className="flex items-center gap-1 w-full">
            <div className="flex items-center w-full rounded-lg bg-background group">
                <label htmlFor="search" className='p-2.5 rounded-lg rounded-r-none border border-contrast2 border-r-0 cursor-pointer group-focus-within:bg-primary group-focus-within:text-white group-focus-within:border-primary'>
                    <Search size={20} />
                </label>
                <input 
                    type="text"
                    id="search"
                    className='p-2.5 w-full bg-contrast outline-none text-sm rounded-lg rounded-l-none text-foreground border border-contrast2 focus:border-gray-400 dark:focus:border-gray-600' 
                    placeholder="Hae tiedostoa" 
                    onChange={handleSearch}
                />
            </div>
        </div>
    )
}

export default SearchBar