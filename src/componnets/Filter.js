
import { createRef, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { productActions, productSelector } from "../redux/reducers/productReducer"

export default function Filter() {
    const dispatch = useDispatch()
    let { priceFilter, categoryFilter } = useSelector(productSelector)

    const rangeInputRef = createRef()
    const mensClothingRef = createRef()
    const womensClothingRef = createRef()
    const jeweleryRef = createRef()
    const electronicsRef = createRef()

    useEffect(() => {
        // this will set the all the filters back once user came back to home page
        if (categoryFilter.includes("men's clothing")) mensClothingRef.current.checked = true
        if (categoryFilter.includes("women's clothing")) womensClothingRef.current.checked = true
        if (categoryFilter.includes("jewelery")) jeweleryRef.current.checked = true
        if (categoryFilter.includes("electronics")) electronicsRef.current.checked = true
    }, [])

    function checkboxHandler() {
        let selectedCategory = [] // array to store the selected category from the filter
        if (mensClothingRef.current.checked) selectedCategory.push("men's clothing")
        if (womensClothingRef.current.checked) selectedCategory.push("women's clothing")
        if (jeweleryRef.current.checked) selectedCategory.push("jewelery")
        if (electronicsRef.current.checked) selectedCategory.push("electronics")
        dispatch(productActions.setCategoryFilter(selectedCategory))
    }

    function inputRangeHandler() {
        dispatch(productActions.setPriceFilter(rangeInputRef.current.value))
    }

    return <>
        <div className="sm:ml-5 h-80 min-w-60 relative top-1/4 bg-slate-400 sm:px-2 py-5">
            <div className="flex flex-col items-center gap-2">
                <h1 className="font-extrabold text-2xl mb-5">Filter</h1>
                <label className="" htmlFor="price">Price: {priceFilter}</label>
                <input onChange={() => inputRangeHandler(rangeInputRef)} ref={rangeInputRef} id="price" type="range" value={priceFilter} min="0" max="1000" className="mb-1" />
            </div>

            <div className="m-5">
                <h1 className="my-4 text-center font-extrabold text-xl">Category</h1>
                <div className="">
                    <input ref={mensClothingRef} onChange={checkboxHandler} className="mr-4" id="mensClothing" type="checkbox" />
                    <label htmlFor="mensClothing" >Men's Clothing</label>
                </div>

                <div className="">
                    <input ref={womensClothingRef} onChange={checkboxHandler} className="mr-4" id="womensClothing" type="checkbox" />
                    <label htmlFor="womensClothing" >Womens's Clothing</label>
                </div>

                <div className="">
                    <input ref={jeweleryRef} onChange={checkboxHandler} className="mr-4" id="jewelery" type="checkbox" />
                    <label htmlFor="jewelery" >Jewelery</label>
                </div>

                <div className="">
                    <input ref={electronicsRef} onChange={checkboxHandler} className="mr-4" id="electronics" type="checkbox" />
                    <label htmlFor="electronics" >Electronics</label>
                </div>
            </div>
        </div>

    </>

}