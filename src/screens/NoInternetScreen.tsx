import { StyleSheet, Text, View, TouchableOpacity, Image, StatusBar } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

const NoInternetScreen = ({ onRetry }: { onRetry?: () => void }) => {
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor={'#fff'} barStyle={'dark-content'} />
            {/* Optional icon */}
            <Image
                source={require('../assets/images/NoInternet.jpg')}
                style={styles.image}
                resizeMode="contain"
            />

            {/* Title */}
            <Text style={styles.title}>No Internet Connection</Text>

            {/* Description */}
            <Text style={styles.description}>
                It seems you are offline. Please check your connection and try again.
            </Text>

            {/* Retry button */}
            {onRetry && (
                <TouchableOpacity style={styles.button} onPress={onRetry}>
                    <Text style={styles.buttonText}>Retry</Text>
                </TouchableOpacity>
            )}
        </SafeAreaView>
    );
};

export default NoInternetScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        backgroundColor: '#fff', // light background
    },
    image: {
        width: 150,
        height: 150,
        marginBottom: 30,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: '#333',
        marginBottom: 10,
        textAlign: 'center',
    },
    description: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: 30,
        lineHeight: 22,
    },
    button: {
        backgroundColor: '#007bff',
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 8,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});
