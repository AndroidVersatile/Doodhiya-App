import axios from 'axios';
import { BASE_URL } from './config';
import { Platform } from 'react-native';
// Create Axios instance 

const api = axios.create({
    baseURL: BASE_URL,
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor
api.interceptors.request.use(
    async (config) => {
        // Example: Add auth token if you have one
        const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5NDEwMTFjNzdhNWNmZjdiOTdjMDcwMiIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc2NTg2ODEyMSwiZXhwIjoxNzY2NDcyOTIxfQ.cZXvJttO85Gu4aqWvnEE06PQnrKJqHGVoCmBwQBqFZE'
        if (token) config.headers.Authorization = `Bearer ${token}`;

        console.log('Request:', config.method.toUpperCase(), config.url, config.data);
        return config;
    },
    (error) => {
        console.error('Request error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor
api.interceptors.response.use(
    (response) => {
        console.log('Response:', response.status, response.data);
        return response;
    },
    (error) => {
        if (error.response) {
            // Server responded with a status other than 2xx
            console.error('Response error:', error.response.status, error.response.data);
        } else if (error.request) {
            // Request was made but no response received
            console.error('No response:', error.request);
        } else {
            console.error('Error:', error.message);
        }
        return Promise.reject(error);
    }
);

export default api;
// import axios from 'axios';
//

// // Change this to your computer’s local IP
// const LOCAL_IP = '192.168.1.100';

// // Dynamically select baseURL
// const getBaseUrl = () => {
//   if (Platform.OS === 'android') {
//     // Android emulator
//     return 'http://10.0.2.2:5000/api';
//   } else if (Platform.OS === 'ios') {
//     // iOS simulator
//     return 'http://localhost:5000/api';
//   } else {
//     // Physical device (both Android and iOS)
//     return `http://${LOCAL_IP}:5000/api`;
//   }
// };

// const api = axios.create({
//   baseURL: getBaseUrl(),
//   timeout: 5000,
//   headers: { 'Content-Type': 'application/json' },
// });

// // Request interceptor
// api.interceptors.request.use(
//   (config) => {
//     console.log('Request:', config.method.toUpperCase(), config.url, config.data);
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // Response interceptor
// api.interceptors.response.use(
//   (response) => {
//     console.log('Response:', response.status, response.data);
//     return response;
//   },
//   (error) => {
//     console.error('API error:', error.response ? error.response.data : error.message);
//     return Promise.reject(error);
//   }
// );

// export default api;
