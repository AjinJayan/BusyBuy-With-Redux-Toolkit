import Table from "../componnets/Table"
import { useSelector } from "react-redux"
import { productSelector } from "../redux/reducers/productReducer"

function Content() {
    const { myOrders } = useSelector(productSelector)

    if (myOrders.length === 0) return <div className="font-bold text-3xl absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">No Orders Found</div>
    return <>
        <h1 className="text-3xl font-bold text-center my-10">Your Orders</h1>
        {myOrders.map((order, index) => <Table key={index} order={order} />)}
    </>
}

export default function MyOrders() {
    return <Content />
}