import { Search } from 'lucide-react'
import React from 'react'

function SearchBar({ fileState, setFileState }) {

    const handleSearch = (e) => {
        const searchValue = e.target.value.toLowerCase()
        const filesToSearch = fileState.filtered ? fileState.filteredFiles : fileState.files

        if (searchValue.length > 1) {
            const searchedFiles = filesToSearch.filter((file) => {
                return file.fileName.toLowerCase().includes(searchValue)
            })
            setFileState(prevState => ({
                ...prevState,
                searchedFiles,
                searched: true
            }))
        } else {
            setFileState(prevState => ({
                ...prevState,
                searchedFiles: [],
                searched: false
            }))
        }
    }

    return (
        <div className="flex items-center gap-1 w-full mb-[-12px]">
            <div className="flex items-center group w-full bg-background border border-navlink rounded-full hover:border-primary focus-within:border-primary overflow-hidden">
                <label htmlFor="search" 
                    className='px-4 py-3 pr-3 text-navlink border-r border-navlink cursor-pointer group-focus-within:bg-primary 
                    group-focus-within:text-white group-hover:text-foreground group-hover:border-primary group-focus-within:group-hover:text-white
                    group-focus-within:border-primary'
                >
                    <Search size={20} />
                </label>
                <input 
                    type="text"
                    id="search"
                    className='px-4 py-3 w-full outline-none text-sm text-foreground bg-background' 
                    placeholder="Hae tiedostoa..." 
                    onChange={handleSearch}
                />
            </div>
        </div>
    )
}

export default SearchBar