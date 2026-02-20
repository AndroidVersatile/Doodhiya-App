
import { configureStore } from '@reduxjs/toolkit';
import authReducer from "../slice/authSlice";
import userReducer from "../slice/userProfileSlice";
import customerReducer from "../slice/customersSlice";
import milkReducer from "../slice/milkSlice"
import networkReducer from "../slice/networkSlice"
import networkGuardMiddleware from './networkGaurd';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        user: userReducer,
        customer: customerReducer,
        milk: milkReducer,
        network: networkReducer,

    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
    // }).concat(networkGuardMiddleware),

});