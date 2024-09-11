import { useProductValue } from "../contest/productContest"

export default function Item({ product }) {
    const { addToCartHandler } = useProductValue()

    return <>
        <div className="shadow-2xl p-8 w-80 md:w-96 grid-col-1">
            <div className="h-4/5 flex items-center">
                <img className="mb-4" alt={product.title} src={product.image} />
            </div>
            <div className="h-1/5">
                <h1 className="text-xl text-left overflow-hidden truncate ...">{product.title}</h1>
                <h1 className="font-bold text-xl mt-1 mb-4 text-left">${product.price}</h1>
                <button onClick={() => addToCartHandler(product)} className="text-white w-full h-10 bg-violet-700 hover:bg-violet-800 font-medium rounded-lg px-5 py-1 text-center">Add to Cart</button>
            </div>
        </div>
    </>

}