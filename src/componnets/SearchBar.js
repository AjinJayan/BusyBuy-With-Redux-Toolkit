import { createRef } from "react"
import { useProductValue } from "../contest/productContest"

export default function SearchBar() {
    const { setSearchBarFilter } = useProductValue()
    const searchInputRef = createRef()

    function searchInputHandler() {
        setSearchBarFilter(searchInputRef.current.value)
    }

    return <>
        <div className="text-center mt-5 ml-64 ">
            <input onChange={searchInputHandler} ref={searchInputRef} className="rounded-xl h-12 pl-3 min-w-40 w-1/3 border-2 border-blue-300 focus:outline-sky-500" type="text" placeholder="Search By Name" />
        </div>
    </>
}