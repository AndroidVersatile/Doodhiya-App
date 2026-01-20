
// import axios from "axios";
// import * as Keychain from "react-native-keychain";

// import { logoutUser, setAccessToken } from "../redux/slice/authSlice";
// import { store } from "../redux/store/store";
// import { getRefreshToken } from "./tokenStorage";
// import { BASE_URL } from "./config";
// const API = axios.create({
//     baseURL: BASE_URL,
//     timeout: 10000,
// });

// /* ---------------- REQUEST ---------------- */
// API.interceptors.request.use((config) => {
//     const token = store.getState().auth.accessToken;

//     if (token) {
//         config.headers.Authorization = `Bearer ${token}`;
//     }

//     return config;
// });

// /* ---------------- RESPONSE ---------------- */
// API.interceptors.response.use(
//     (response) => response,
//     async (error) => {
//         const originalRequest = error.config;

//         if (error.response?.status === 401 && !originalRequest._retry) {
//             originalRequest._retry = true;

//             try {
//                 //  get refresh token from Keychain

//                 const refreshToken = await getRefreshToken();
//                 if (refreshToken) throw new Error("No refresh token");

//                 //  request new access token
//                 const res = await axios.post(
//                     `${BASE_URL}/api/auth/refreshToken`,
//                     { token: refreshToken }
//                 );

//                 const newAccessToken = res.data.accessToken;

//                 //  update Redux (single source of truth)
//                 store.dispatch(setAccessToken(newAccessToken));

//                 //  retry original request
//                 originalRequest.headers.Authorization =
//                     `Bearer ${newAccessToken}`;

//                 return API(originalRequest);
//             } catch (err) {
//                 // 2. Handle Refresh Failure
//                 // Only logout if the server actually rejected the refresh token (400, 401, 403)
//                 // If the refresh call itself failed due to internet, don't logout!
//                 if (err.response) {
//                     store.dispatch(logoutUser());
//                 }
//                 return Promise.reject(err);
//             }
//         }
//         // 3. Handle Network Errors (No Internet)
//         // If there's no response object, the request never reached the server
//         if (!error.response) {
//             console.log("Interceptor: Network Error detected. No logout triggered.");
//             // We return a custom error so the Thunk can recognize it as 'NETWORK_ERROR'
//             return Promise.reject(new Error("NETWORK_ERROR"));
//         }
//         return Promise.reject(error);
//     }
// );

// export default API;
