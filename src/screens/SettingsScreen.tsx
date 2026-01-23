import { ActivityIndicator, Alert, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View, Linking } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import BackHeader from '../components/BackHeader'
import Icon from 'react-native-vector-icons/MaterialIcons';

import { Responsive } from '../theme/responsive';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../redux/slice/authSlice';

const SettingsScreen = ({ navigation }) => {
    const insets = useSafeAreaInsets()
    const { logoutLoading } = useSelector((state) => state.auth)
    const dispatch = useDispatch();
    const handlePrivacyPolicy = () => {
        Linking.openURL('https://androidversatile.github.io/Doodhiya-Privacy-Policy/');
    }
    const handleDeleteAccount = () => {
        Alert.alert(
            "Delete Account",
            "Are you sure you want to delete your account? This will permanently remove your profile and images.",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: () => Linking.openURL('mailto:support@versatileitsolution.com?subject=Account Deletion Request&body=Please delete my account associated with this email.')
                }
            ]
        );
    };
    // Grouping settings into sections for better organization
    const accountSettings = [
        {
            id: 5, title: 'My Profile',
            icon: 'account-circle',
            onPress: () => navigation.navigate('ProfileScreen')
        },
        {
            id: 6, title: 'Delete Account',
            icon: 'delete-forever',
            onPress: () => handleDeleteAccount(),
        },

    ];

    const infoSettings = [
        { id: 1, title: 'About Us', icon: 'info-outline', onPress: () => navigation.navigate('AboutUsScreen') },
        { id: 4, title: 'Contact Support', icon: 'headset-mic', onPress: () => navigation.navigate('ContactUsScreen') },
    ];

    const legalSettings = [
        { id: 2, title: 'Privacy Policy', icon: 'description', onPress: () => handlePrivacyPolicy() },
        { id: 3, title: 'Terms & Conditions', icon: 'gavel', onPress: () => navigation.navigate('TermsAndConditionsScreen') },
    ];

    const handleLogOut = () => {
        dispatch(logoutUser())

    };

    const SettingRow = ({ item }) => (
        <TouchableOpacity
            onPress={item.onPress}
            style={styles.settingItem}
            activeOpacity={0.6}
            accessible={true}
            accessibilityRole="menuitem"
            accessibilityLabel={item.title}
            accessibilityHint="Double tap to open"
        >
            <View style={styles.leftContainer}>
                <Icon name={item.icon} size={Responsive.fontSize[22]} color="#444" />
                <Text style={styles.settingText}>{item.title}</Text>
            </View>
            <Icon name="chevron-right" size={Responsive.fontSize[20]} color="#CCC" />
        </TouchableOpacity>
    );

    return (
        <View style={[styles.container, { paddingTop: insets.top + Responsive.spacing[10] }]} >
            <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />
            <BackHeader title={'Settings'} bg={'#F8F9FA'} />

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent} accessible={true}
                accessibilityRole="scrollbar">

                <Text style={styles.sectionTitle} accessibilityRole="header"
                >Account</Text>
                <View style={styles.card} accessibilityRole="list">
                    {accountSettings.map(item => <SettingRow key={item.id} item={item} />)}
                </View>

                <Text style={styles.sectionTitle}>Support & Info</Text>
                <View style={styles.card} accessibilityRole="list">
                    {infoSettings.map(item => <SettingRow key={item.id} item={item} />)}
                </View>

                <Text style={styles.sectionTitle}>Legal</Text>
                <View style={styles.card} accessibilityRole="list">
                    {legalSettings.map((item, index) => (
                        <View key={item.id}>
                            <SettingRow item={item} />
                            {/* Remove divider for last item in card */}
                            {index !== legalSettings.length - 1 && <View style={styles.divider} importantForAccessibility="no"
                                accessibilityElementsHidden={true} />}
                        </View>
                    ))}
                </View>

                <TouchableOpacity
                    onPress={handleLogOut}
                    disabled={logoutLoading}
                    style={styles.logOutBtn}
                    accessibilityRole="button"
                    accessibilityLabel="Log out"
                    accessibilityState={{ busy: logoutLoading }}

                >
                    {
                        logoutLoading ? (
                            <ActivityIndicator size={'small'} color={'#FF5252'} />
                        ) : (
                            <>
                                <Icon name="logout" size={Responsive.fontSize[15]} color="#FF5252" />
                                <Text style={styles.logOutText}>Log Out</Text>
                            </>
                        )}
                </TouchableOpacity>

                <Text style={styles.versionText} importantForAccessibility="no">Version 1.0.5</Text>
            </ScrollView>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    scrollContent: {
        paddingHorizontal: Responsive.size.wp(5),
        paddingBottom: Responsive.size.hp(5),
    },
    sectionTitle: {
        fontSize: Responsive.fontSize[11],
        fontWeight: '600',
        color: '#8E8E93',
        marginTop: Responsive.size.hp(3),
        marginBottom: Responsive.size.hp(1),
        marginLeft: Responsive.size.wp(1),
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: Responsive.radius[12],
        overflow: 'hidden',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: Responsive.size.hp(1.8),
        paddingHorizontal: Responsive.size.wp(4),
    },
    leftContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Responsive.size.wp(3),
    },
    settingText: {
        fontSize: Responsive.fontSize[14],
        color: '#1C1C1E',
        fontWeight: '500',
    },
    divider: {
        height: 1,
        backgroundColor: '#F2F2F7',
        marginLeft: Responsive.size.wp(14),
    },
    logOutBtn: {
        marginTop: Responsive.size.hp(5),
        height: Responsive.size.hp(6.8),
        flexDirection: 'row',
        gap: Responsive.size.wp(2.5),
        backgroundColor: '#FFFFFF',
        borderRadius: Responsive.radius[12],
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#FFE5E5',
        elevation: 2,
        shadowColor: '#FF5252',
        shadowOpacity: 0.05,
        shadowRadius: 5,
    },
    logOutText: {
        fontSize: Responsive.fontSize[14],
        fontWeight: '600',
        color: '#FF5252',
    },
    versionText: {
        textAlign: 'center',
        marginTop: Responsive.size.hp(2.5),
        color: '#A0A0A0',
        fontSize: Responsive.fontSize[12],
    }
});

export default SettingsScreen;