import { useProductValue } from "../contest/productContest"
import { ProductContextProvider } from "../contest/productContest"
import CartItem from "../componnets/CartItem"

function Content() {
    const { cart, placeOrderBtnHandler } = useProductValue()

    if (cart.length === 0) return <div className="font-bold text-3xl absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">Cart is Empty</div>

    return <>
        <div className="h-screen flex">
            {/* Place Order */}
            <div className="sm:ml-5 h-32 min-w-60 relative top-1/3 bg-slate-400 px-2 sm:px-5 py-5">
                <div className="mb-5 font-bold font-mono text-center text-sky-950">Total Price:- ${cart.reduce((acc, p) => p.price * p.quantity + acc, 0).toFixed(3)}</div>
                <button onClick={placeOrderBtnHandler} className="text-white w-full h-10 bg-violet-700 hover:bg-violet-800 font-medium rounded-lg px-5 py-1 text-center">Place Order</button>
            </div>

            {/* Items in the Cart */}
            <div className="m-5 gap-5 min-w-64 flex-1 flex flex-wrap justify-center overflow-y-scroll scrollbar-hide">
                {cart.map((p, index) => <CartItem key={index} product={p} />)}
            </div>
        </div>
    </>
}

export default function Cart() {
    return <ProductContextProvider>
        <Content />
    </ProductContextProvider>
}