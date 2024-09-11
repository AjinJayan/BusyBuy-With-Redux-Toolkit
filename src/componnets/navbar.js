import { Link, Outlet } from "react-router-dom"
import AuthProvider from "../contest/authContest"
import { useAuthValue } from "../contest/authContest"

function Content() {
    const { currentUser, handleSignOut } = useAuthValue()

    // signin and home only visible if user didn't signed in. If user signed in cart, myorder, home, signout will appear in navbar
    if (currentUser) {
        return (<>
            <div className="flex flex-wrap justify-between pl-5 pr-5 sm:pl-14 sm:pr-24 py-4 bg-slate-100 shadow-xl font-semibold font-mono">
                <Link to="/">
                    <div className="flex items-center gap-3">
                        <img className="w-10" alt="app-icon" src="https://cdn-icons-png.flaticon.com/128/7877/7877489.png" />
                        <span className=" hover:text-sky-700">BusyBuy</span>
                    </div>
                </Link>

                <div className="flex flex-wrap justify-around gap-3 sm:gap-10">
                    <Link to="/">
                        <div className="flex items-center gap-3">
                            <img className="w-10" alt="home-icon" src="https://cdn-icons-png.flaticon.com/128/10473/10473299.png" />
                            <span className=" hover:text-sky-700">Home</span>
                        </div>
                    </Link>
                    <Link to="/myorders">
                        <div className="flex items-center gap-3">
                            <img className="w-10" alt="myorder-icon" src="https://cdn-icons-png.flaticon.com/128/9422/9422789.png" />
                            <span className=" hover:text-sky-700">My Orders</span>
                        </div>
                    </Link>
                    <Link to="/cart">
                        <div className="flex items-center gap-3">
                            <img className="w-10" alt="cart-icon" src="https://cdn-icons-png.flaticon.com/128/872/872243.png" />
                            <span className=" hover:text-sky-700">Cart</span>
                        </div>
                    </Link>

                    <div onClick={handleSignOut} className="flex items-center gap-3">
                        <img className="w-10" alt="signout-icon" src="https://cdn-icons-png.flaticon.com/128/17730/17730631.png" />
                        <span className=" hover:text-sky-700">Sign Out</span>
                    </div>

                </div>
            </div>

            <Outlet />
        </>)
    }

    else {
        return (<>
            <div className="flex flex-wrap justify-between pl-5 pr-5 sm:pl-14 sm:pr-24 py-4 bg-slate-100 shadow-xl font-semibold font-mono">
                <Link to="/">
                    <div className="flex items-center gap-3">
                        <img className="w-10" alt="app-icon" src="https://cdn-icons-png.flaticon.com/128/7877/7877489.png" />
                        <span className=" hover:text-sky-700">BusyBuy</span>
                    </div>
                </Link>

                <div className="flex flex-wrap justify-around gap-3 sm:gap-10">
                    <Link to="/">
                        <div className="flex items-center gap-3">
                            <img className="w-10" alt="home-icon" src="https://cdn-icons-png.flaticon.com/128/10473/10473299.png" />
                            <span className=" hover:text-sky-700">Home</span>
                        </div>
                    </Link>
                    <Link to="/signin">
                        <div className="flex items-center gap-3">
                            <img className="w-10" alt="signIn-icon" src="https://cdn-icons-png.flaticon.com/128/16798/16798468.png" />
                            <span className=" hover:text-sky-700">SignIn</span>
                        </div>
                    </Link>
                </div>
            </div>

            <Outlet />
        </>)
    }
}

export default function Navbar() {
    return <AuthProvider>
        <Content />
    </AuthProvider>
}