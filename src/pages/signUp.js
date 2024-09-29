import { createRef } from "react"
import { Navigate, useNavigate } from "react-router-dom"
import { signUpAsync, authSelector } from "../redux/reducers/authReducer"
import { useDispatch, useSelector } from "react-redux"

function Content() {

    const { currentUser } = useSelector(authSelector)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const emailRef = createRef()
    const passwordRef = createRef()
    const nameRef = createRef()

    function submitBtnHandler(e) {
        e.preventDefault()
        // dispatch action for signup
        dispatch(signUpAsync({ email: emailRef.current.value, password: passwordRef.current.value, name: nameRef.current.value }))
        if (currentUser) navigate("/")
    }

    // if user is already signed in and we are trying to access /signup then it will navigate back to home page
    if (currentUser !== null) return <Navigate to="/" replace="true" />

    return <>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <h1 className="font-bold text-5xl font-serif">Sign Up</h1>
            <form onSubmit={(e) => submitBtnHandler(e)} className="mt-12 mb-3 flex flex-col gap-3">
                <input ref={nameRef} required className="h-12 pl-3 w-72 rounded-xl border-2 border-blue-300 focus:outline-sky-500" type="text" placeholder="Enter Name" />
                <input ref={emailRef} required className="h-12 pl-3 w-72 rounded-xl border-2 border-blue-300 focus:outline-sky-500" type="email" placeholder="Enter Email" />
                <input ref={passwordRef} className="h-12 pl-3 w-72 rounded-xl border-2 border-blue-300 focus:outline-sky-500" required type="password" placeholder="Enter Password" />
                <button type="submit" className="text-white w-72 h-10 bg-blue-600 hover:bg-blue-700 font-medium rounded-lg px-5 py-1 text-center">Sign Up</button>
            </form>
        </div>
    </>
}

export default function SignUp() {
    return <Content />
}