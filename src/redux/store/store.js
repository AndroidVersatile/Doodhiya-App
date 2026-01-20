
import { configureStore } from '@reduxjs/toolkit';
import authReducer from "../slice/authSlice";
import userReducer from "../slice/userProfileSlice";
import customerReducer from "../slice/customersSlice";
import milkReducer from "../slice/milkSlice"

export const store = configureStore({
    reducer: {
        auth: authReducer,
        user: userReducer,
        customer: customerReducer,
        milk: milkReducer,

    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false, // Required for Firebase objects
        }),

});