
import { getApp } from '@react-native-firebase/app';
import auth, { onAuthStateChanged } from '@react-native-firebase/auth';
import { setUser } from '../redux/slice/authSlice';
// import { createUserProfile, fetchUserProfile } from '../redux/slice/userSlice';
import { clearProfile, createUserProfile, fetchUserProfile } from '../redux/slice/userProfileSlice';

export const listenToAuthChanges = (dispatch) => {
    const app = getApp();

    return onAuthStateChanged(auth(app), async (user) => {
        try {
            if (!user) {
                dispatch(setUser(null));
                dispatch(clearProfile());
                return;
            }

            // 1️⃣ Auth state
            // console.log('User in auth listner', user);

            dispatch(setUser({
                uid: user.uid,
                email: user.email,
                displayName: user.displayName,
                photoURL: user.photoURL,
            }));

            // 2️⃣ Ensure Firestore profile exists
            // await dispatch(
            //     createUserProfile({
            //         uid: user.uid,
            //         provider: user.providerData[0]?.providerId,
            //     })
            // );
            await dispatch(
                createUserProfile({
                    uid: user.uid,
                    provider: user.providerData[0]?.providerId || 'email',
                })
            )

            // 3️⃣ Fetch Firestore profile
            await dispatch(fetchUserProfile(user.uid))
        } catch (error) {
            console.error("Auth Listener Sync Error:", error);

        }
    });
};
