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
        <div className="flex items-center gap-1 w-full">
            <div className="flex items-center w-full rounded-lg bg-background group">
                <label htmlFor="search" className='p-2.5 rounded-lg rounded-r-none border border-contrast2 cursor-pointer group-focus-within:bg-primary group-focus-within:text-white group-focus-within:border-primary'>
                    <Search size={20} />
                </label>
                <input 
                    type="text"
                    id="search"
                    className='p-2.5 w-full outline-none text-sm rounded-lg rounded-l-none text-foreground bg-background border border-contrast2 border-l-0' 
                    placeholder="Hae tiedostoa..." 
                    onChange={handleSearch}
                />
            </div>
        </div>
    )
}

export default SearchBar