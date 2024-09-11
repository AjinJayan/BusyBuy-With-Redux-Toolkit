import { useContext, createContext, useState, useEffect } from 'react';
import {
    getAuth, createUserWithEmailAndPassword,
    setPersistence, signInWithEmailAndPassword, browserLocalPersistence, signOut, onAuthStateChanged
} from 'firebase/auth';
import { app } from '../firebase_init';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { db } from "../firebase_init";
import { doc, setDoc } from "firebase/firestore";

const authContest = createContext()


export function useAuthValue() {
    const value = useContext(authContest)
    return value
}

const AuthProvider = ({ children }) => {
    const auth = getAuth(app);
    const navigate = useNavigate()
    const [currentUser, setCurrentUser] = useState(null)

    useEffect(() => {
        // Set up the listener for authentication state changes
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setCurrentUser(user); // Set the current user in state
            } else {
                setCurrentUser(null); // Reset the current user in state
            }
        });

        // Clean up the subscription when the component unmounts
        return () => unsubscribe();
    }, []);


    const handleSignUp = async (email, password, name) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);

            // when sign up happens the user get added to usercart and userOrder collection in database
            const userCartRef = doc(db, "usersCarts", userCredential.user.uid)
            await setDoc(userCartRef, { name });

            const userOrderRef = doc(db, "usersOrders", userCredential.user.uid)
            await setDoc(userOrderRef, { name });

            toast.success('User signed up successfully!');
            navigate("/")
        } catch (error) {
            toast.error(error.message);
        }
    };

    const handleSignIn = async (email, password) => {
        try {
            /* setting Perisistance as browserLocalPersistence. So the user won't get signed out even after closing browser or refresh
            An explicit signout is required to signout*/
            await setPersistence(auth, browserLocalPersistence)
            await signInWithEmailAndPassword(auth, email, password);
            toast.success('User signed in successfully!');
            navigate("/")
        } catch (error) {
            toast.error(error.message);
        }
    };

    const handleSignOut = async () => {
        try {
            await signOut(auth);
            toast.success('User signed out successfully!');
            navigate("/")
        } catch (error) {
            toast.error(error.message);
        }
    };

    return (
        <authContest.Provider value={{ handleSignUp, handleSignIn, handleSignOut, currentUser }}>
            {children}
        </authContest.Provider>
    );
};
export default AuthProvider;