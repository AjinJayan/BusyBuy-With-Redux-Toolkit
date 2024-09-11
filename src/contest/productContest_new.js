import { useState, useEffect, useContext, createContext, useReducer } from "react";
import { addDoc, collection, onSnapshot, updateDoc, doc, deleteDoc, getDocs } from "firebase/firestore";
import { db } from "../firebase_init";
import { useAuthValue } from "./authContest";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const productContext = createContext();

// custom hook
export const useProductValue = () => {
    const value = useContext(productContext);
    return value;
};

export const ProductContextProvider = ({ children }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filteredProducts, setFilteredProducts] = useState([])
    const [priceFliter, setPriceFliter] = useState(1000) // setting intial price filter as 1000 dollars 
    const [categoryFilter, setCategoryFilter] = useState([])
    const [searchBarFilter, setSearchBarFilter] = useState("")
    const [cart, dispatch] = useReducer(cartReducer, [])
    const [myOrders, setMyOrders] = useState([])

    const { currentUser } = useAuthValue()
    const navigate = useNavigate()

    useEffect(() => {
        // fetching all product information from database (realtime)
        const unsubscribe = onSnapshot(collection(db, "products"), (snapshot) => {
            const fetchedData = snapshot.docs.map((doc) => ({ ...doc.data() }));
            setProducts(fetchedData);
            setFilteredProducts(fetchedData)
            setLoading(false);
        });

        // Unsubscribe on cleanup to avoid memory leaks
        return () => unsubscribe();
    }, []);

    function cartReducer(state, action) {
        switch (action.type) {
            case "ADD_TO_CART":
                return [...state, action.product];
            case "INCREMENT_ITEM": {
                return state.map((p) =>
                    p.id === action.product.id ? { ...p, quantity: p.quantity + 1 } : p
                );
            }
            case "REMOVE_FROM_CART": {
                return state.filter((p) => p.id !== action.product.id);
            }
            case "DECREMENT_ITEM": {
                return state.map((p) =>
                    p.id === action.product.id ? { ...p, quantity: p.quantity - 1 } : p
                );
            }
            case "CLEAR_CART":
                return [];
            default:
                return state;
        }
    }


    useEffect(() => {
        // fetching the current user myCart information from database (realtime)
        if (currentUser) {
            const unsubscribe = onSnapshot(collection(db, "usersCarts", currentUser.uid, "myCart"), (snapshot) => {
                const fetchedData = snapshot.docs.map((doc) => ({ ...doc.data() }));
                // setCart(fetchedData);
                fetchedData.forEach(product => dispatch({ type: "ADD_TO_CART", product }))
            });
            // Unsubscribe on cleanup to avoid memory leaks
            return () => unsubscribe();
        }
        else {
            // setCart([])
            dispatch({ type: "CLEAR_CART" })
        }
    }, [currentUser])

    useEffect(() => {
        // fetching the current user orders information from database (realtime)
        if (currentUser) {
            const unsubscribe = onSnapshot(collection(db, "usersOrders", currentUser.uid, "orders"), (snapshot) => {
                const fetchedData = snapshot.docs.map((doc) => ({ ...doc.data() }));
                setMyOrders(fetchedData);
            });
            // Unsubscribe on cleanup to avoid memory leaks
            return () => unsubscribe();
        }
        else {
            setMyOrders([])
        }
    }, [currentUser])

    // useEffect hook for price filter, category filter, search bar input
    useEffect(() => {
        let filtered_products = products.filter((p) => p.price < priceFliter)
        setFilteredProducts([...filtered_products])

        if (categoryFilter.length !== 0) {
            filtered_products = filtered_products.filter((p) => categoryFilter.includes(p.category))
            setFilteredProducts([...filtered_products])
        }

        if (searchBarFilter !== "") {
            filtered_products = filtered_products.filter((p) => p.title.replaceAll(/\s/g, '').toLowerCase().includes(searchBarFilter.replaceAll(/\s/g, '').toLowerCase()))
            setFilteredProducts([...filtered_products])
        }
    }, [priceFliter, products, categoryFilter, searchBarFilter])


    async function addToCartHandler(product) {
        // if user is not signed in and try to add items to cart, the will navigate to signin
        if (currentUser == null) navigate("/signin")
        else {
            const productIndex = cart.findIndex((p) => p.id === product.id)
            // adding the product to the cart first time, mentioning quatity as 1 
            if (productIndex === -1) {
                product.quantity = 1
                // setCart((prevState) => [...prevState, product])
                dispatch({ type: "ADD_TO_CART", product })

                // updating the database
                const docRef = await addDoc(collection(db, "usersCarts", currentUser.uid, "myCart"), { ...product })
                await updateDoc(doc(db, "usersCarts", currentUser.uid, "myCart", docRef.id), { cartDocId: docRef.id })
                toast.success("Product Added Sucessfully!")
            }
            else {
                // if product already exist in the cart and same product again from the home page to cart will increase the quanity
                // cart[productIndex].quantity += 1
                // setCart([...cart])
                dispatch({ type: "INCREMENT_ITEM", product })

                // updating the database
                await updateDoc(doc(db, "usersCarts", currentUser.uid, "myCart", cart[productIndex].cartDocId), { quantity: cart[productIndex].quantity })
                toast.success("Increased the Product Count!")
            }

        }
    }

    // handler to remove product from the cart page
    async function removeFromCartHandler(product) {
        // const productIdx = cart.findIndex((p) => p.id === product.id)
        // cart.splice(productIdx, 1)
        // setCart([...cart])
        dispatch({ type: "REMOVE_FROM_CART", product })

        // deleting from the cart collection in database
        await deleteDoc(doc(db, "usersCarts", currentUser.uid, "myCart", product.cartDocId))
        toast.success("Product Removed Sucessfully!")
    }

    // handler to increase the quantity of items in the cart by pressing the + icon in cart page 
    async function incrementCartItemHandler(product) {
        const productIndex = cart.findIndex((p) => p.id === product.id)
        // cart[productIndex].quantity += 1
        // setCart([...cart])
        dispatch({ type: "INCREMENT_ITEM", product })

        // updfating the database 
        await updateDoc(doc(db, "usersCarts", currentUser.uid, "myCart", cart[productIndex].cartDocId), { quantity: cart[productIndex].quantity })
    }

    // handler to decrease the quantity of items in the cart by pressing the - icon in cart page 
    async function decrementCartItemHandler(product) {
        const productIndex = cart.findIndex((p) => p.id === product.id)
        // if product quantity is 1 and if pressed - minus icon. it will that product from the cart as well as from the database
        if (product.quantity === 1) {
            // cart.splice(productIndex, 1)
            dispatch({ type: "REMOVE_FROM_CART", product })
            await deleteDoc(doc(db, "usersCarts", currentUser.uid, "myCart", product.cartDocId))
        }
        else {
            // cart[productIndex].quantity -= 1
            // setCart([...cart])

            dispatch({ type: "DECREMENT_ITEM", product })

            // updfating the database 
            await updateDoc(doc(db, "usersCarts", currentUser.uid, "myCart", cart[productIndex].cartDocId), { quantity: cart[productIndex].quantity })
        }
    }

    // handler for the placeOrder buton present in the cart page
    async function placeOrderBtnHandler() {
        // it will add the all the things in the cart to myOrders, also date is added to it 
        setMyOrders((prevState) => [...prevState, { orderedProducts: cart, orderedOn: new Date() }])
        // updating the myorder collection in database
        await addDoc(collection(db, "usersOrders", currentUser.uid, "orders"), { orderedProducts: cart, orderedOn: new Date() })

        // empty the cart
        // setCart([])
        dispatch({ type: "CLEAR_CART" })
        // deleting all the docs inside the myCart of the particular user form the database
        const allDocs = await getDocs(collection(db, "usersCarts", currentUser.uid, "myCart"))
        allDocs.forEach(async (document) => await deleteDoc(doc(db, "usersCarts", currentUser.uid, "myCart", document.id)))
        toast.success("Order Placed Sucessfully!")
    }

    return (
        <productContext.Provider value={{
            products: filteredProducts, loading, priceFliter,
            setPriceFliter, setCategoryFilter, setSearchBarFilter, addToCartHandler,
            cart, removeFromCartHandler, incrementCartItemHandler, decrementCartItemHandler, placeOrderBtnHandler,
            myOrders
        }}>
            {children}
        </productContext.Provider>
    );
};
