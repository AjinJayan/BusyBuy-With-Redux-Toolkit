import { Link, useNavigate, Navigate } from "react-router-dom"
import { createRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import { signInAsync, authSelector } from "../redux/reducers/authReducer"

function Content() {
    const { currentUser } = useSelector(authSelector)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const emailRef = createRef()
    const passwordRef = createRef()

    function submitBtnHandler(e) {
        e.preventDefault()
        // dispatch action for signin
        dispatch(signInAsync({ email: emailRef.current.value, password: passwordRef.current.value }))
        if (currentUser) navigate("/")
    }

    // if user is already signed in and we are trying to access /signin then it will navigate back to home page
    if (currentUser !== null) return <Navigate to="/" replace={true} />

    return <>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <h1 className="font-bold text-5xl font-serif">Sign In</h1>
            <form onSubmit={(e) => submitBtnHandler(e)} className="mt-12 mb-3 flex flex-col gap-3">
                <input ref={emailRef} required className="h-12 pl-3 w-72 rounded-xl border-2 border-blue-300 focus:outline-sky-500" name="email" type="email" placeholder="Enter Email" />
                <input ref={passwordRef} className="h-12 pl-3 w-72 rounded-xl border-2 border-blue-300 focus:outline-sky-500" required type="password" placeholder="Enter Password" />
                <button type="submit" className="text-white w-72 h-10 bg-blue-600 hover:bg-blue-700 font-medium rounded-lg px-5 py-1 text-center">Sign In</button>
            </form>

            <Link to="/signup"><p className="font-bold mt-3 font-serif hover:text-sky-700">Or SignUp Instead</p></Link>
        </div>
    </>
}

export default function SignIn() {
    return <Content />
}