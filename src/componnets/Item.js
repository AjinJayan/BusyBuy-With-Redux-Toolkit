import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { addItemToCartDatabaseAsync } from "../redux/reducers/productReducer"
import { authSelector } from "../redux/reducers/authReducer"

export default function Item({ product }) {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { currentUser } = useSelector(authSelector)

    async function addToCartHandler(product) {
        // if user is not signed in and try to add items to cart, the will navigate to signin
        if (currentUser == null) navigate("/signin")
        else {
            dispatch(addItemToCartDatabaseAsync(product))
        }
    }

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