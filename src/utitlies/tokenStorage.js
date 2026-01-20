// // tokenStorage.js
// import * as Keychain from "react-native-keychain";

// const SERVICE = "refreshToken";

// export const saveRefreshToken = (token) =>
//     Keychain.setGenericPassword("refresh", token, { service: SERVICE });

// export const getRefreshToken = async () => {
//     const creds = await Keychain.getGenericPassword({ service: SERVICE });
//     return creds?.password;
// };

// export const clearRefreshToken = () =>
//     Keychain.resetGenericPassword({ service: SERVICE });
