import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getApp } from '@react-native-firebase/app';
import auth, {
    GoogleAuthProvider,
    signInWithCredential,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    sendPasswordResetEmail
} from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import Toast from 'react-native-toast-message';
import { FIREBASE_WEB_CLIENT_ID } from '@env';
import { createUserProfile, updateUserProfile } from './userProfileSlice';
const getAuth = () => auth(getApp());


GoogleSignin.configure({
    webClientId: FIREBASE_WEB_CLIENT_ID,
    offlineAccess: true,
});
// Helper to sanitize user object for Redux
const serializeUser = (user) => {
    if (!user) return null;
    return {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
    };
};
const getReadableErrorMessage = (errorCode) => {
    switch (errorCode) {
        case 'auth/invalid-email':
            return 'The email address is not valid.';
        case 'auth/user-disabled':
            return 'This user account has been disabled.';
        case 'auth/user-not-found':
            return 'No user found with this email.';
        case 'auth/wrong-password':
            return 'Incorrect password. Please try again.';
        case 'auth/email-already-in-use':
            return 'This email is already registered.';
        case 'auth/weak-password':
            return 'Password is too weak. Use at least 6 characters.';
        case 'auth/invalid-credential':
            return 'Invalid credentials. Please check your login details.';
        case 'auth/network-request-failed':
            return 'Network error. Please check your internet connection.';
        default:
            return 'An unexpected error occurred. Please try again.';
    }
};

export const loginWithEmail = createAsyncThunk(
    'auth/loginWithEmail',
    async ({ email, password }, thunkAPI) => {
        try {
            // Pass the explicit auth instance
            const userCredential = await signInWithEmailAndPassword(
                getAuth(),
                email,
                password
            );
            Toast.show({ type: 'success', text1: 'Success', text2: 'Logged in successfully!' });
            return serializeUser(userCredential.user);
        } catch (error) {
            const message = getReadableErrorMessage(error.code);
            Toast.show({ type: 'error', text1: 'Login Failed', text2: message });
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// export const loginWithGoogle = createAsyncThunk(
//     'auth/loginWithGoogle',
//     async (_, thunkAPI) => {
//         console.log('FIREBASE_WEB_CLIENT_ID', FIREBASE_WEB_CLIENT_ID);
//         try {
//             await GoogleSignin.hasPlayServices();
//             const { idToken } = await GoogleSignin.signIn();

//             const googleCredential = GoogleAuthProvider.credential(idToken);

//             const userCredential = await signInWithCredential(
//                 getAuth(),
//                 googleCredential
//             );
//             Toast.show({ type: 'success', text1: 'Success', text2: 'Signed in with Google!' });
//             return serializeUser(userCredential.user);
//         } catch (error) {
//             const message = error.code === '7' ? 'Network Error' : getReadableErrorMessage(error.code);
//             Toast.show({ type: 'error', text1: 'Google Sign-In Error', text2: message });
//             console.log("RAW ERROR:", error);
//             console.log("Error Code:", error.code);
//             console.log("Error Message:", error.message);
//             return thunkAPI.rejectWithValue(message);
//         }
//     }
// );
export const loginWithGoogle = createAsyncThunk(
    'auth/loginWithGoogle',
    async (_, thunkAPI) => {
        console.log('GoogleLogin');

        try {
            await GoogleSignin.hasPlayServices();

            // 1. New way to get the response
            const response = await GoogleSignin.signIn();

            // 2. Safely extract idToken (v10.x+ uses response.data)
            const idToken = response.data?.idToken || response.idToken;

            if (!idToken) {
                return thunkAPI.rejectWithValue('Google Sign-In failed: No ID Token found');
            }

            // 3. Create credential
            const googleCredential = GoogleAuthProvider.credential(idToken);

            // 4. Sign in to Firebase
            const userCredential = await signInWithCredential(
                getAuth(),
                googleCredential
            );

            Toast.show({ type: 'success', text1: 'Success', text2: 'Signed in!' });
            return serializeUser(userCredential.user);

        } catch (error) {
            // Log exactly what the error is before trying to access .code
            // console.log("ACTUAL ERROR:", error);

            const errorCode = error?.code || 'unknown';
            const message = getReadableErrorMessage(errorCode);

            Toast.show({
                type: 'error',
                text1: 'Sign-In Error',
                text2: message
            });
            return thunkAPI.rejectWithValue(message);
        }
    }
);
export const logoutUser = createAsyncThunk(
    'auth/logoutUser',
    async (_, thunkAPI) => {
        try {
            await signOut(getAuth());
            await GoogleSignin.signOut();
            Toast.show({ type: 'info', text1: 'Logged Out', text2: 'See you soon!' });
            return null;
        } catch (error) {
            // console.log('Logout error', error);

            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

export const signupWithEmail = createAsyncThunk(
    'auth/signupWithEmail',
    async ({ email, password }, thunkAPI) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(
                getAuth(),
                email,
                password
            );
            const user = userCredential.user;
            // 2. FORCE Firestore creation immediately
            // .unwrap() ensures that if Firestore fails, we jump to the catch block
            await thunkAPI.dispatch(
                createUserProfile({
                    uid: user.uid,
                    provider: 'password',
                })
            )
            Toast.show({ type: 'success', text1: 'Account Created', text2: 'Welcome to the app!' });
            return serializeUser(userCredential.user);
        } catch (error) {
            // This will catch BOTH Auth errors and Firestore creation errors
            const message = typeof error === 'string'
                ? error
                : getReadableErrorMessage(error.code);

            Toast.show({
                type: 'error',
                text1: 'Signup Failed',
                text2: message
            });
            return thunkAPI.rejectWithValue(message);
        }
    }
);
export const forgotPassword = createAsyncThunk(
    'auth/forgotPassword',
    async (email, thunkAPI) => {
        try {
            await sendPasswordResetEmail(getAuth(), email);

            Toast.show({
                type: 'success',
                text1: 'Reset Link Sent',
                text2: 'Check your email to reset your password',
            });

            return true;
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Reset Failed',
                text2: error.message || 'Unable to send reset link',
            });

            return thunkAPI.rejectWithValue(error.message);
        }
    }
);
const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        loginLoading: false,
        logoutLoading: false,
        signUpLoading: false,
        googleLoginLoading: false,
        forgotPasswordLoading: false,
        error: null,
        authError: null
    },
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            // =====================
            // LOGIN WITH EMAIL
            // =====================
            .addCase(loginWithEmail.pending, (state) => {
                state.loginLoading = true;
                state.error = null;
            })
            .addCase(loginWithEmail.fulfilled, (state) => {
                state.loginLoading = false;
            })
            .addCase(loginWithEmail.rejected, (state, action) => {
                state.loginLoading = false;
                state.error = action.payload;
            })

            // =====================
            // LOGIN WITH GOOGLE
            // =====================
            .addCase(loginWithGoogle.pending, (state) => {
                state.googleLoginLoading = true;
                state.error = null;
            })
            .addCase(loginWithGoogle.fulfilled, (state) => {
                state.googleLoginLoading = false;
            })
            .addCase(loginWithGoogle.rejected, (state, action) => {
                state.googleLoginLoading = false;
                state.error = action.payload;
            })

            // =====================
            // SIGNUP WITH EMAIL
            // =====================
            .addCase(signupWithEmail.pending, (state) => {
                state.signUpLoading = true;
                state.error = null;
            })
            .addCase(signupWithEmail.fulfilled, (state) => {
                state.signUpLoading = false;
            })
            .addCase(signupWithEmail.rejected, (state, action) => {
                state.signUpLoading = false;
                state.error = action.payload;
            })

            // =====================
            // LOGOUT
            // =====================
            .addCase(logoutUser.pending, (state) => {
                state.logoutLoading = true;
                state.error = null;
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.logoutLoading = false;
                state.user = null; // safe, listener will also clear
            })
            .addCase(logoutUser.rejected, (state, action) => {
                state.logoutLoading = false;
                state.error = action.payload;
            })

            .addCase(forgotPassword.pending, (state) => {
                state.forgotPasswordLoading = true;
                state.authError = null;
            })
            .addCase(forgotPassword.fulfilled, (state) => {
                state.forgotPasswordLoading = false;
            })
            .addCase(forgotPassword.rejected, (state, action) => {
                state.forgotPasswordLoading = false;
                state.authError = action.payload;
            })
            // =====================
            // UPDATE PROFILE (From UserSlice)
            // =====================
            .addCase(updateUserProfile.fulfilled, (state, action) => {
                if (state.user) {
                    state.user = {
                        ...state.user,
                        ...action.payload // This will now overwrite displayName and name
                    };
                }
            });

    },
});

export const { setUser } = authSlice.actions;
export default authSlice.reducer;
