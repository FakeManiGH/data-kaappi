import { Search } from 'lucide-react'
import React from 'react'

function SearchBar({ fileState, setFileState }) {

    const handleSearch = (e) => {
        const searchValue = e.target.value.toLowerCase()
        const filesToSearch = fileState.filtered ? fileState.filteredFiles : fileState.files

        if (searchValue.length > 1) {
            const searchedFiles = filesToSearch.filter((file) => {
                return file.name.toLowerCase().includes(searchValue)
            })
            setFileState(prevState => ({
                ...prevState,
                searchedFiles,
                searched: true,
            }))
            
            // If files are sorted, search from sorted files
            if (fileState.sorted) {
                setFileState(prevState => ({
                    ...prevState,
                    sortedFiles: searchedFiles
                }))
            }

        } else {
            setFileState(prevState => ({
                ...prevState,
                searchedFiles: [],
                searched: false
            }))

            if (fileState.sorted) {
                setFileState(prevState => ({
                    ...prevState,
                    sortedFiles: fileState.filtered ? fileState.filteredFiles : fileState.files
                }))
            }
        }
    }

    return (
        <div className="flex items-center gap-1 w-full">
            <div className="flex items-center group w-full bg-background overflow-hidden">
                <label htmlFor="search" 
                    className='p-3 text-foreground border-2 border-r-0 border-transparent cursor-pointer group-focus-within:bg-primary 
                    group-focus-within:text-white group-hover:text-white group-hover:border-primary group-hover:bg-primary group-focus-within:group-hover:text-white
                    group-focus-within:border-primary transition-colors'
                >
                    <Search size={20} />
                </label>
                <input 
                    type="text"
                    id="search"
                    className='px-4 py-3 w-full outline-none text-sm text-foreground dark:bg-contrast border-2 border-transparent focus:border-primary group-hover:border-primary transition-colors' 
                    placeholder="Hae tiedostoa..." 
                    onChange={handleSearch}
                />
            </div>
        </div>
    )
}

export default SearchBar