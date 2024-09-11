import GridSpinner from "../componnets/reactSpinner";
import Item from "../componnets/Item";
import Filter from "../componnets/Filter";
import SearchBar from "../componnets/SearchBar";
import { ProductContextProvider } from "../contest/productContest";
import { useProductValue } from "../contest/productContest";


// Move useProductValue Inside the Provider: The hook useProductValue() should be called inside the provider to access the context value.
function Content() {
    const { products, loading } = useProductValue();
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
                    {products.map((p, index) => (
                        <Item key={index} product={p} />
                    ))}
                </div>
            </div>
        </>);
}

export default function Home() {
    return (
        <ProductContextProvider>
            <Content />
        </ProductContextProvider>
    );
}