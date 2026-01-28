/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import { Provider } from "react-redux";
import { store } from "./src/redux/store/store";
import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message';
import { Responsive } from './src/theme/responsive';
const Root = () => {
    return (
        <Provider store={store}>
            <App />
            <Toast position='bottom' bottomOffset={50} config={toastConfig} />
        </Provider>
    )
}


const toastConfig = {
    /* Overwrite the 'success' type or create a custom one like 'customSuccess'
    */
    success: (props) => (
        <BaseToast
            {...props}
            style={{
                backgroundColor: '#4CAF50',
                borderLeftColor: '#2E7D32',
                height: Responsive.size.hp(12),
                borderRadius: Responsive.radius[10],
            }}
            contentContainerStyle={{ paddingHorizontal: Responsive.padding[10] }}
            text1Style={{
                fontSize: Responsive.fontSize[16],
                fontWeight: 'bold',
                color: '#FFFFFF'
            }}
            text2Style={{
                fontSize: Responsive.fontSize[14],
                color: '#E8F5E9'
            }}
        />
    ),

    error: (props) => (
        <ErrorToast
            {...props}
            style={{
                backgroundColor: '#D32F2F', borderLeftColor: '#B71C1C', height: Responsive.size.hp(12),
                borderRadius: Responsive.radius[10],
            }}
            text1Style={{ color: 'white', fontSize: Responsive.fontSize[16] }}
            text2Style={{ color: 'white', fontSize: Responsive.fontSize[12] }}
        />
    )
};
AppRegistry.registerComponent(appName, () => Root);
