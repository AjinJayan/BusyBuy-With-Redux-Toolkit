import { createRef, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { productActions, productSelector } from "../redux/reducers/productReducer"

export default function SearchBar() {
    const dispatch = useDispatch()
    const { searchBarFilter } = useSelector(productSelector)
    const searchInputRef = createRef()

    useEffect(() => {
        // this will fill the search field (set by user when he left home page) once user came back to home page
        searchInputRef.current.value = searchBarFilter
    }, [])

    function searchInputHandler() {
        dispatch(productActions.setSearchBarFilter(searchInputRef.current.value))
    }

    return <>
        <div className="text-center mt-5 ml-64 ">
            <input onChange={searchInputHandler} ref={searchInputRef} className="rounded-xl h-12 pl-3 min-w-40 w-1/3 border-2 border-blue-300 focus:outline-sky-500" type="text" placeholder="Search By Name" />
        </div>
    </>
}