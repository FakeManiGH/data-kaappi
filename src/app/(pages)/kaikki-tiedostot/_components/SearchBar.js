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
            <div className="flex items-center group w-full overflow-hidden">
                <label htmlFor="search" 
                    className='p-2.5 text-foreground cursor-pointer group-hover:text-primary transition-colors'
                >
                    <Search />
                </label>
                <input 
                    type="text"
                    id="search"
                    className='px-3 py-2.5 w-full outline-none text-sm text-foreground bg-background border-b border-contrast 
                        focus:border-primary ring-primary group-hover:border-primary transition-colors' 
                    placeholder="Hae tiedostoa..." 
                    onChange={handleSearch}
                />
            </div>
        </div>
    )
}

export default SearchBar