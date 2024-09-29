import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { app, db } from "../../firebase_init";
import {
    getAuth, createUserWithEmailAndPassword,
    setPersistence, signInWithEmailAndPassword, browserLocalPersistence, signOut, onAuthStateChanged
} from 'firebase/auth';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { doc, setDoc } from "firebase/firestore";

const auth = getAuth(app);

export const signInAsync = createAsyncThunk(
    "auth/signIn",
    async (arg) => {
        try {
            /* setting Perisistance as browserLocalPersistence. So the user won't get signed out even after closing browser or refresh
            An explicit signout is required to signout*/
            await setPersistence(auth, browserLocalPersistence)
            await signInWithEmailAndPassword(auth, arg.email, arg.password);
            toast.success('User signed in successfully!');
        } catch (error) {
            toast.error(error.message);
        }
    })

export const signUpAsync = createAsyncThunk(
    "auth/signUp",
    async (arg) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, arg.email, arg.password);

            // when sign up happens the user get added to usercart and userOrder collection in database
            const userCartRef = doc(db, "usersCarts", userCredential.user.uid)
            await setDoc(userCartRef, { name: arg.name });

            const userOrderRef = doc(db, "usersOrders", userCredential.user.uid)
            await setDoc(userOrderRef, { name: arg.name });

            toast.success('User signed up successfully!');
        } catch (error) {
            toast.error(error.message);
        }
    })

export const signOutAsync = createAsyncThunk(
    "auth/signOut",
    async (arg, thunkAPI) => {
        try {
            // signout the currentuser
            await signOut(auth);
            toast.success('User signed out successfully!');
        } catch (error) {
            toast.error(error.message);
        }
    })

export const getCurrentUserAsync = createAsyncThunk(
    "auth/getCurrentUser",
    (arg, thunkAPI) => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) thunkAPI.dispatch(authActions.setCurrentUser({ uid: user.uid })) // Set the current user in state
            else thunkAPI.dispatch(authActions.setCurrentUser(null)); // Reset the current user in state
        })

        thunkAPI.signal.addEventListener("abort", () => {
            unsubscribe(); // Unsubscribe when the thunk is aborted
        });

    })

const INTIAL_STATE = { currentUser: null }

const authSlice = createSlice({
    name: "auth",
    initialState: INTIAL_STATE,
    reducers: {
        setCurrentUser: (state, action) => {
            state.currentUser = action.payload
        }
    },
})

export const authReducer = authSlice.reducer
export const authSelector = (state) => state.authReducer
export const authActions = authSlice.actions
