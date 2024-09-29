export default function Table({ order }) {
    return <div className="relative overflow-x-auto mx-10 mb-10">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <caption className="text-xl font-bold text-slate-500 mb-3">Ordered On:- {new Date(order.orderedOn).toDateString()}</caption>
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                    <th scope="col" className="px-6 py-3">
                        Product Name
                    </th>
                    <th scope="col" className="px-6 py-3">
                        Price
                    </th>
                    <th scope="col" className="px-6 py-3">
                        Quantity
                    </th>
                    <th scope="col" className="px-6 py-3">
                        Total Price
                    </th>
                </tr>
            </thead>
            <tbody>
                {order.orderedProducts.map((p, index) => {
                    return <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{p.title}</th>
                        <td className="px-6 py-4">$ {p.price}</td>
                        <td className="px-6 py-4">{p.quantity}</td>
                        <td className="px-6 py-4">$ {p.price * p.quantity}</td>
                    </tr>
                })}
                <tr className="bg-white border-b dark:bg-gray-900 dark:border-gray-700">
                    <td colSpan="2" className="px-6 py-4 text-lg font-bold">Total Price</td>
                    <td colSpan="2" className="px-6 py-4 text-lg font-bold">$ {order.orderedProducts.reduce((total, p) => p.price * p.quantity + total, 0)}</td>
                </tr>
            </tbody>
        </table>
    </div>
}