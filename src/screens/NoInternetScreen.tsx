// import { StyleSheet, Text, View, TouchableOpacity, Image, StatusBar } from 'react-native';
// import React from 'react';
// import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
// import { Responsive } from '../theme/responsive';

// const NoInternetScreen = () => {
//     const insets = useSafeAreaInsets();
//     return (
//         <View style={[styles.container, { paddingTop: insets.top + Responsive.spacing[10] }]}>
//             <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />


//             <Image
//                 source={require('../assets/images/NoInternet.jpg')}
//                 style={styles.image}
//                 resizeMode="contain"
//             />

//             {/* Title */}
//             <Text style={styles.title}>No Internet Connection</Text>

//             {/* Description */}
//             <Text style={styles.description}>
//                 It seems you are offline. Please check your connection and try again.
//             </Text>


//             <TouchableOpacity style={styles.button} >
//                 <Text style={styles.buttonText}>Retry</Text>
//             </TouchableOpacity>

//         </View>
//     );
// };

// export default NoInternetScreen;

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//         paddingHorizontal: 20,
//         backgroundColor: '#fff', // light background
//     },
//     image: {
//         width: 150,
//         height: 150,
//         marginBottom: 30,
//     },
//     title: {
//         fontSize: 24,
//         fontWeight: '700',
//         color: '#333',
//         marginBottom: 10,
//         textAlign: 'center',
//     },
//     description: {
//         fontSize: 16,
//         color: '#666',
//         textAlign: 'center',
//         marginBottom: 30,
//         lineHeight: 22,
//     },
//     button: {
//         backgroundColor: '#007bff',
//         paddingVertical: 12,
//         paddingHorizontal: 30,
//         borderRadius: 8,
//     },
//     buttonText: {
//         color: '#fff',
//         fontSize: 16,
//         fontWeight: '600',
//     },
// });
import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image,
    StatusBar,
    ActivityIndicator,
    Platform
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import NetInfo from "@react-native-community/netinfo";
import { Responsive } from '../theme/responsive';
import RNBootSplash from "react-native-bootsplash";
const NoInternetScreen = () => {
    const insets = useSafeAreaInsets();
    const [isRefreshing, setIsRefreshing] = useState(false);

    useEffect(() => {
        // Hide the splash screen as soon as the No Internet screen mounts
        const hideSplash = async () => {
            await RNBootSplash.hide({ fade: true });
        };
        hideSplash();
    }, []);
    const handleRetry = async () => {
        setIsRefreshing(true);
        await NetInfo.refresh();
        setTimeout(() => {
            setIsRefreshing(false);
        }, 1000);
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

            <View style={styles.content}>
                <Image
                    source={require('../assets/images/NoInternet.jpg')}
                    style={styles.image}
                    resizeMode="contain"
                    // Accessibility for images
                    accessible={true}
                    accessibilityLabel="Illustration showing no network connection"
                />

                {/* <Text
                    style={styles.title}
                    accessibilityRole="header"
                >
                    No Internet Connection
                </Text> */}

                <Text style={styles.description}>
                    It seems you are offline. Please check your connection and try again to continue.
                </Text>

                <TouchableOpacity
                    style={[styles.button, isRefreshing && styles.buttonDisabled]}
                    onPress={handleRetry}
                    disabled={isRefreshing}
                    activeOpacity={0.8}
                    accessibilityLabel="Retry network connection"
                    accessibilityRole="button"
                    accessibilityHint="Triggers a re-check of your internet status"
                >
                    {isRefreshing ? (
                        <ActivityIndicator color="#fff" size="small" />
                    ) : (
                        <Text style={styles.buttonText}>Try Again</Text>
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default NoInternetScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: Responsive.spacing[30],
    },
    image: {
        width: Responsive.size.wp(50),
        height: Responsive.size.wp(50),
        marginBottom: Responsive.spacing[20],
    },
    title: {
        fontSize: Responsive.fontSize[24],
        fontWeight: Platform.OS === 'ios' ? '700' : 'bold',
        color: '#1A1A1A',
        marginBottom: Responsive.spacing[12],
        textAlign: 'center',
        letterSpacing: 0.5,
    },
    description: {
        fontSize: Responsive.fontSize[16],
        color: '#666666',
        textAlign: 'center',
        marginBottom: Responsive.spacing[40],
        lineHeight: Responsive.fontSize[24],
        paddingHorizontal: Responsive.spacing[10],
    },
    button: {
        backgroundColor: '#007bff',
        paddingVertical: Responsive.padding[14],
        paddingHorizontal: Responsive.padding[50],
        borderRadius: 12, // More modern rounded corners
        // Soft shadow for depth
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 6,
            },
            android: {
                elevation: 4,
            },
        }),
    },
    buttonDisabled: {
        backgroundColor: '#A0CFFF', // Desaturated blue when loading
    },
    buttonText: {
        color: '#fff',
        fontSize: Responsive.fontSize[16],
        fontWeight: '600',
        letterSpacing: 1,
    },
});