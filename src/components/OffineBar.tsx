import React from "react";
import { StyleSheet, Text, View, Platform, } from "react-native";
import { useSelector } from 'react-redux';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Responsive } from "../theme/responsive";

export const OfflineBar = ({ title }) => {
    // Access the state from your network slice
    const isConnected = useSelector((state) => state.network.isConnected);

    if (isConnected) return null;

    return (
        <View
            style={styles.outerContainer}

            accessibilityRole="alert"
            accessibilityLabel={`Alert: ${title}`}
            accessibilityLiveRegion="assertive"
            importantForAccessibility="yes"
        >
            <View style={styles.content}>
                <MaterialIcons
                    name="wifi-off"
                    size={Responsive.fontSize[20]}
                    color="white"
                    importantForAccessibility="no-hide-descendants"
                    accessibilityElementsHidden={true}
                />
                <Text
                    style={styles.offlineText}
                    accessibilityLabel={title}
                >
                    {title}
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    outerContainer: {
        backgroundColor: '#D32F2F',
        width: '100%',
        elevation: 8,
        shadowColor: 'blue',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: Responsive.radius[10],
        padding: Responsive.padding[2],
        borderRadius: Responsive.radius[8],
        marginBottom: Responsive.spacing[10]

    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: Responsive.padding[5],
        gap: Responsive.spacing[10],
    },
    offlineText: {
        color: 'white',
        fontSize: Responsive.fontSize[14],
        fontWeight: '600',
        textAlign: 'center'
    }
});