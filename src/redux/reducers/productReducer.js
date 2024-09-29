import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { db } from "../../firebase_init";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { addDoc, collection, onSnapshot, updateDoc, doc, deleteDoc, getDocs } from "firebase/firestore";


export const getIntialProductStateAsync = createAsyncThunk(
    "product/getIntialProductState",
    (arg, thunkAPI) => {
        // fetching all product information from database (realtime)
        const unsubscribe = onSnapshot(collection(db, "products"), (snapshot) => {
            const fetchedData = snapshot.docs.map((doc) => ({ ...doc.data() }));
            //setting intial State
            thunkAPI.dispatch(productActions.setIntialProductState(fetchedData))
        });

        thunkAPI.signal.addEventListener("abort", () => {
            unsubscribe() // Unsubscribe when the thunk is aborted
        })
    })


export const getMyOrdersStateAsync = createAsyncThunk(
    "product/getMyOrdersState",
    (currentUser, thunkAPI) => {
        // fetch the current user orders information from database (realtime)
        const unsubscribe = onSnapshot(collection(db, "usersOrders", currentUser.uid, "orders"), (snapshot) => {
            const fetchedData = snapshot.docs.map((doc) => ({ ...doc.data() }));
            // update the myorder state in realtime
            thunkAPI.dispatch(productActions.setMyOrders(fetchedData));
        });

        thunkAPI.signal.addEventListener("abort", () => {
            unsubscribe() // Unsubscribe when the thunk is aborted
        })
    })

export const getCartStateAsync = createAsyncThunk(
    "product/getCartsState",
    (currentUser, thunkAPI) => {
        // fetching the current user orders information from database (realtime)
        const unsubscribe = onSnapshot(collection(db, "usersCarts", currentUser.uid, "myCart"), (snapshot) => {
            const fetchedData = snapshot.docs.map((doc) => ({ ...doc.data() }));
            // update the cart state in realtime
            thunkAPI.dispatch(productActions.setCart(fetchedData));
        });

        thunkAPI.signal.addEventListener("abort", () => {
            unsubscribe() // Unsubscribe when the thunk is aborted
        })
    })

export const addItemToCartDatabaseAsync = createAsyncThunk(
    "product/addNewItemToCartDatabase",
    async (product, thunkAPI) => {
        const { currentUser } = thunkAPI.getState().authReducer;
        const { cart } = thunkAPI.getState().productReducer;
        const productIndex = cart.findIndex((p) => p.id === product.id)

        try {
            if (productIndex === -1) {
                // adding the product to the cart database for the first time, mentioning quatity as 1 
                const docRef = await addDoc(collection(db, "usersCarts", currentUser.uid, "myCart"), { ...product, quantity: 1 })
                await updateDoc(doc(db, "usersCarts", currentUser.uid, "myCart", docRef.id), { cartDocId: docRef.id })
                toast.success("Product Added Sucessfully!")
            }
            else {
                // if product already exist in the cart datababse and same product added again from the home page to cart database, will increase the quanity
                await updateDoc(doc(db, "usersCarts", currentUser.uid, "myCart", cart[productIndex].cartDocId), { quantity: cart[productIndex].quantity + 1 })
                toast.success("Increased the Product Count!")
            }
        }
        catch (error) {
            toast.error(error.message)
        }

    })

export const incrementCartItemInDatabaseAsync = createAsyncThunk(
    "product/incrementCartItemInDatabase",
    async (product, thunkAPI) => {
        try {
            const { cart } = thunkAPI.getState().productReducer;
            const { currentUser } = thunkAPI.getState().authReducer;
            const productIndex = cart.findIndex((p) => p.id === product.id)
            // increase the quantity of items in the cart database by pressing the + icon in cart page 
            await updateDoc(doc(db, "usersCarts", currentUser.uid, "myCart", cart[productIndex].cartDocId), { quantity: cart[productIndex].quantity + 1 })
        }
        catch (error) {
            toast.error(error.message)
        }
    })

export const decrementCartItemInDatabaseAsync = createAsyncThunk(
    "product/decrementCartItemInDatabase",
    async (product, thunkAPI) => {
        const { cart } = thunkAPI.getState().productReducer;
        const { currentUser } = thunkAPI.getState().authReducer;
        const productIndex = cart.findIndex((p) => p.id === product.id)
        try {
            // if product quantity is 1 and if pressed - minus icon. it will remove product from the cart database
            if (product.quantity === 1) await deleteDoc(doc(db, "usersCarts", currentUser.uid, "myCart", product.cartDocId))
            // decrease the quantity of items in the cart by pressing the - icon in cart page 
            else await updateDoc(doc(db, "usersCarts", currentUser.uid, "myCart", cart[productIndex].cartDocId), { quantity: cart[productIndex].quantity - 1 })
        }
        catch (error) {
            toast.error(error.message)
        }
    })

export const removeCartItemInDatabaseAsync = createAsyncThunk(
    "product/removeCartItemInDatabase",
    async (product, thunkAPI) => {
        try {
            const { currentUser } = thunkAPI.getState().authReducer;
            // remove product from the cart database
            await deleteDoc(doc(db, "usersCarts", currentUser.uid, "myCart", product.cartDocId))
            toast.success("Product Removed Sucessfully!")
        }
        catch (error) {
            toast.error(error.message)
        }
    })

export const placeOrderAsync = createAsyncThunk(
    "product/placeOrder",
    async (product, thunkAPI) => {
        try {
            const { currentUser } = thunkAPI.getState().authReducer;
            const { cart } = thunkAPI.getState().productReducer;

            // this add the all the items in the cart to orders databse, also date is added to it 
            await addDoc(collection(db, "usersOrders", currentUser.uid, "orders"), { orderedProducts: cart, orderedOn: (new Date()).toISOString() })

            // deleting all the docs inside the myCart database of the current user
            const allDocs = await getDocs(collection(db, "usersCarts", currentUser.uid, "myCart"))
            allDocs.forEach(async (document) => await deleteDoc(doc(db, "usersCarts", currentUser.uid, "myCart", document.id)))
            toast.success("Order Placed Sucessfully!")
        }
        catch (error) {
            toast.error(error.message)
        }
    })

const INTIAL_STATE = {
    products: [], loading: true, filteredProducts: [],
    priceFilter: 1000, categoryFilter: [], searchBarFilter: "",
    myOrders: [], cart: []
}

const productSlice = createSlice({
    name: "product",
    initialState: INTIAL_STATE,
    reducers: {
        setIntialProductState: (state, action) => {
            state.products = action.payload
            state.filteredProducts = action.payload
            state.loading = false
        },
        setPriceFilter: (state, action) => {
            state.priceFilter = action.payload
        },
        setCategoryFilter: (state, action) => {
            state.categoryFilter = action.payload
        },
        setSearchBarFilter: (state, action) => {
            state.searchBarFilter = action.payload
        },
        setFilteredProducts: (state, action) => {
            state.filteredProducts = action.payload
        },
        setMyOrders: (state, action) => {
            state.myOrders = action.payload
            // to sort the orders in decending order
            state.myOrders.sort((a, b) => new Date(b.orderedOn) - new Date(a.orderedOn))
        },
        setCart: (state, action) => {
            state.cart = action.payload
        },
        resetAllProductStates: (state, action) => {
            state.filteredProducts = state.products
            state.priceFilter = INTIAL_STATE.priceFilter
            state.categoryFilter = INTIAL_STATE.categoryFilter
            state.searchBarFilter = INTIAL_STATE.searchBarFilter
            state.myOrders = INTIAL_STATE.myOrders
            state.cart = INTIAL_STATE.cart
        }
    }
})

export const productReducer = productSlice.reducer
export const productSelector = (state) => state.productReducer
export const productActions = productSlice.actions
