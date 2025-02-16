import { Search } from 'lucide-react'
import React from 'react'
import { parse } from 'date-fns'

function SearchBar({ files, setFilteredFiles }) {

    const handleSearch = (e) => {
        if (e.target.value.length > 1) {
            const searchValue = e.target.value.toLowerCase()
            const filtered = files.filter((file) => {
                return file.fileName.toLowerCase().includes(searchValue)
            })
            setFilteredFiles(filtered)
        } else {
            setFilteredFiles(files)
        }
    }

    const handleSort = (e) => {
        const sortValue = e.target.value
        let sortedFiles = [...files]

        if (sortValue === 'asc') {
            sortedFiles.sort((a, b) => a.fileName.localeCompare(b.fileName))
        } else if (sortValue === 'desc') {
            sortedFiles.sort((a, b) => b.fileName.localeCompare(a.fileName))
        } else if (sortValue === 'new') {
            sortedFiles.sort((a, b) => parse(b.createdAt, 'HHmmddMMyyyy', new Date()) - parse(a.createdAt, 'HHmmddMMyyyy', new Date()))
        } else if (sortValue === 'old') {
            sortedFiles.sort((a, b) => parse(a.createdAt, 'HHmmddMMyyyy', new Date()) - parse(b.createdAt, 'HHmmddMMyyyy', new Date()))
        }

        setFilteredFiles(sortedFiles)
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

            <div>
                <label htmlFor="sort" className='sr-only'></label>
                <select 
                    id='sort' 
                    className='p-[11px] bg-background text-sm rounded-lg text-foreground border border-contrast2 focus:border-gray-400 dark:focus:border-gray-600'
                    onChange={handleSort}
                >
                    <option value="asc">Nimi A-Ö</option>
                    <option value="desc">Nimi Ö-A</option>
                    <option value="new">Uusin ensin</option>
                    <option value="old">Vanhin ensin</option>
                </select>
            </div>
        </div>
    )
}

export default SearchBar