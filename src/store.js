import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "./redux/reducers/authReducer";
import { productReducer } from "./redux/reducers/productReducer";

export const store = configureStore({
    reducer: {
        authReducer,
        productReducer
    }
})