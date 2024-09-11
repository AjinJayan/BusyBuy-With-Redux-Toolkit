import Navbar from "./componnets/navbar";
import Home from "./pages/home";
import SignIn from "./pages/signIn";
import SignUp from "./pages/signUp";
import Cart from "./pages/cart";
import MyOrders from "./pages/myOrders";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { createBrowserRouter, RouterProvider } from "react-router-dom";

function App() {
  // navbar is the parent rest all are its children
  const router = createBrowserRouter([{
    path: "/", element: <Navbar />, children: [
      { index: true, element: <Home /> },
      { path: "/signin", element: <SignIn /> },
      { path: "/signup", element: <SignUp /> },
      { path: "/cart", element: <Cart /> },
      { path: "/myorders", element: <MyOrders /> },
    ]
  }])
  return (<>
    <RouterProvider router={router}></RouterProvider>
    <ToastContainer />
  </>

  );
}

export default App;
