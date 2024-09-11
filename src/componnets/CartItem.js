import { useProductValue } from "../contest/productContest"

export default function CartItem({ product }) {
    const { removeFromCartHandler, incrementCartItemHandler, decrementCartItemHandler } = useProductValue()

    return <>
        <div className="shadow-2xl p-8 w-80 md:w-96 grid-col-1">
            <div className="h-4/5 flex items-center">
                <img className="mb-4" alt={product.title} src={product.image} />
            </div>
            <div className="h-1/5">
                <h1 className="text-xl text-left overflow-hidden truncate ...">{product.title}</h1>

                <div className="flex mt-2 mb-5 justify-between">
                    <h1 className="font-bold text-xl">${product.price}</h1>
                    <div className="flex gap-5 content-center">
                        <img onClick={() => decrementCartItemHandler(product)} className="w-6 h-6 hover:scale-110" src="https://cdn-icons-png.flaticon.com/128/1828/1828899.png" alt="minus-icon" />
                        <span className="text-lg">{product.quantity}</span>
                        <img onClick={() => incrementCartItemHandler(product)} className="w-6 h-6 hover:scale-110" src="https://cdn-icons-png.flaticon.com/128/1828/1828919.png" alt="plus-icon" />
                    </div>

                </div>

                <button onClick={() => removeFromCartHandler(product)} className="text-white w-full h-10 bg-red-600 hover:bg-red-700 font-medium rounded-lg px-5 py-1 text-center">Remove from Cart</button>
            </div >
        </div >
    </>

}