import GridSpinner from "../componnets/reactSpinner";
import Item from "../componnets/Item";
import Filter from "../componnets/Filter";
import SearchBar from "../componnets/SearchBar";
import { productSelector, getIntialProductStateAsync, productActions } from "../redux/reducers/productReducer";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

function Content() {
    const dispatch = useDispatch()
    const { filteredProducts, products, loading,
        priceFilter, categoryFilter, searchBarFilter } = useSelector(productSelector)

    // Fetch products details from database and set the IntialState
    useEffect(() => {
        const promise = dispatch(getIntialProductStateAsync());
        return () => {
            promise.abort(); // Aborts the thunk when the component unmounts
        };
    }, [dispatch]);


    // useEffect hook for price filter, category filter, search bar input
    useEffect(() => {
        let filtered_products = products.filter((p) => p.price < priceFilter)
        dispatch(productActions.setFilteredProducts([...filtered_products]))

        if (categoryFilter.length !== 0) {
            filtered_products = filtered_products.filter((p) => categoryFilter.includes(p.category))
            dispatch(productActions.setFilteredProducts([...filtered_products]))
        }
        if (searchBarFilter !== "") {
            filtered_products = filtered_products.filter((p) => p.title.replaceAll(/\s/g, '').toLowerCase().includes(searchBarFilter.replaceAll(/\s/g, '').toLowerCase()))
            dispatch(productActions.setFilteredProducts([...filtered_products]))
        }
    }, [priceFilter, products, categoryFilter, searchBarFilter, dispatch])



    // code used to fetch the data of products and store it inside firebase database

    // useEffect(() => {
    //     async function fetchdata() {
    //         const response = await fetch("https://fakestoreapi.com/products")
    //         if (response.ok) {
    //             const d = await response.json()
    //             setData(d)
    //         }
    //     }
    //     fetchdata()
    // }, [])

    // useEffect(() => {
    //     async function adddata() {
    //         data.map(async (item, indx) => {
    //             await addDoc(collection(db, "products"), {
    //                 id: item.id,
    //                 title: item.title,
    //                 price: item.price,
    //                 category: item.category,
    //                 image: item.image
    //             });
    //         })

    //     }
    //     adddata()
    // }, [])

    return loading ? <GridSpinner /> :
        (<>
            <SearchBar />
            <div className="h-screen flex">
                <Filter />
                <div className="m-10 gap-5  min-w-64 flex-1 flex flex-wrap justify-center overflow-y-scroll scrollbar-hide">
                    {filteredProducts.map((p, index) => (
                        <Item key={index} product={p} />
                    ))}
                </div>
            </div>
        </>);
}

export default function Home() {
    return (
        <Content />
    );
}