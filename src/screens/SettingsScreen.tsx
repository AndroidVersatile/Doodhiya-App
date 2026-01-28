import {
    ActivityIndicator, Alert, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View, Linking, Modal, TextInput, ToastAndroid, Platform, KeyboardAvoidingView, TouchableWithoutFeedback,
    Keyboard
} from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import BackHeader from '../components/BackHeader'
import Icon from 'react-native-vector-icons/MaterialIcons';

import { Responsive } from '../theme/responsive';
import { useDispatch, useSelector } from 'react-redux';
import { deleteAccount, deleteEmailAccount, deleteGoogleAccount, logoutUser } from '../redux/slice/authSlice';

const SettingsScreen = ({ navigation }) => {
    const insets = useSafeAreaInsets()
    const [deleteType, setDeleteType] = useState(null);
    // 1. Local State for Delete Modal
    const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
    const [password, setPassword] = useState('');
    const { user, logoutLoading, deleteAccountLoading } = useSelector((state) => state.auth)
    const { profile, } = useSelector((state) => state.user);
    const [errors, setErrors] = useState({});
    // console.log(profile);
    // console.log(user);

    const dispatch = useDispatch();
    const handlePrivacyPolicy = () => {
        Linking.openURL('https://androidversatile.github.io/Doodhiya-Privacy-Policy/');
    }
    const handlePasswordReset = () => {
        navigation.navigate('ForgetPasswordScreen')
    }
    const handleDeleteAccountPress = () => {
        const isGoogleUser = user?.providerId === 'google.com';
        // Set type first, then show modal
        setDeleteType(isGoogleUser ? 'google' : 'email');
        setDeleteModalVisible(true);
    };

    const onConfirmDelete = async () => {
        if (Platform.OS === 'android') {
            ToastAndroid.show('Processing deletion...', ToastAndroid.SHORT);
        }

        let resultAction;

        if (deleteType === 'google') {
            resultAction = await dispatch(deleteGoogleAccount());
        } else {
            if (!password) {
                Alert.alert("Error", "Password is required.");
                return;
            }
            resultAction = await dispatch(deleteEmailAccount({ password }));
        }

        // Common Cleanup
        if (deleteGoogleAccount.fulfilled.match(resultAction) || deleteEmailAccount.fulfilled.match(resultAction)) {
            setDeleteModalVisible(false);
            setPassword('');
            setDeleteType(null);
        }
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
            onPress: () => handleDeleteAccountPress(),
        },
        ...(user?.providerId !== 'google.com' ? [{
            id: 7,
            title: 'Reset Password',
            icon: 'lock-reset',
            onPress: handlePasswordReset
        }] : []),


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

                <Text style={styles.versionText} importantForAccessibility="no">Version 1.0.8</Text>
                <Modal
                    visible={isDeleteModalVisible}
                    transparent={true}
                    animationType="fade"
                    onRequestClose={() => setDeleteModalVisible(false)}
                >
                    {/* 1. Use KeyboardAvoidingView to wrap the whole screen */}
                    <KeyboardAvoidingView
                        behavior={Platform.OS === "ios" ? "padding" : undefined}
                        style={{ flex: 1 }}
                    >
                        {/* 2. Overlay handles the centering */}
                        <View style={styles.modalOverlay}>
                            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                                {/* 3. This view captures taps outside to dismiss keyboard */}
                                <View style={StyleSheet.absoluteFill} />
                            </TouchableWithoutFeedback>

                            <View style={styles.modalContent}>
                                {/* 4. ScrollView only grows as much as it needs to */}
                                <ScrollView
                                    bounces={false}
                                    style={{ flexShrink: 1 }} // Crucial: lets it shrink
                                    contentContainerStyle={{ paddingBottom: 10 }}
                                    keyboardShouldPersistTaps="handled"
                                >
                                    <Text style={styles.modalTitle}>Delete Account</Text>

                                    <Text style={styles.modalSubTitle}>
                                        {deleteType === 'google'
                                            ? "To protect your data, we need to verify your Google account one last time."
                                            : "Please enter your password to confirm permanent account deletion."
                                        }
                                    </Text>

                                    {deleteType === 'email' && (
                                        <TextInput
                                            style={styles.passwordInput}
                                            placeholder="Enter Password"
                                            secureTextEntry
                                            value={password}
                                            onChangeText={setPassword}
                                            placeholderTextColor="#999"
                                        />
                                    )}

                                    <View style={styles.modalActionRow}>
                                        <TouchableOpacity
                                            style={[styles.modalBtn, styles.cancelBtn]}
                                            onPress={() => {
                                                setDeleteModalVisible(false);
                                                setPassword('');
                                                setDeleteType(null);
                                            }}
                                        >
                                            <Text style={styles.cancelBtnText}>Cancel</Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                            style={[styles.modalBtn, styles.confirmDeleteBtn]}
                                            onPress={onConfirmDelete}
                                            disabled={deleteAccountLoading}
                                        >
                                            {deleteAccountLoading ? (
                                                <ActivityIndicator size="small" color="#FFF" />
                                            ) : (
                                                <Text style={styles.deleteBtnText}>
                                                    {deleteType === 'google' ? 'Verify' : 'Delete'}
                                                </Text>
                                            )}
                                        </TouchableOpacity>
                                    </View>
                                </ScrollView>
                            </View>
                        </View>
                    </KeyboardAvoidingView>
                </Modal>
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
    },
    // modalOverlay: {
    //     flex: 1,
    //     backgroundColor: 'rgba(0,0,0,0.5)',
    //     justifyContent: 'center',
    //     alignItems: 'center',
    //     paddingHorizontal: Responsive.size.wp(10),
    // },
    // modalContent: {
    //     width: '100%',
    //     backgroundColor: '#FFF',
    //     borderRadius: Responsive.radius[16],
    //     padding: Responsive.size.wp(6),
    //     alignItems: 'center',
    // },
    modalTitle: {
        fontSize: Responsive.fontSize[18],
        fontWeight: 'bold',
        color: '#1C1C1E',
        marginBottom: Responsive.size.hp(1),
    },
    modalSubTitle: {
        fontSize: Responsive.fontSize[13],
        color: '#666',
        textAlign: 'center',
        marginBottom: Responsive.size.hp(3),
    },
    passwordInput: {
        width: '100%',
        height: Responsive.size.hp(6),
        borderWidth: 1,
        borderColor: '#E5E5EA',
        borderRadius: Responsive.radius[8],
        paddingHorizontal: Responsive.size.wp(4),
        color: '#000',
        marginBottom: Responsive.size.hp(3),
    },
    modalActionRow: {
        flexDirection: 'row',
        gap: Responsive.size.wp(4),
    },
    modalBtn: {
        flex: 1,
        height: Responsive.size.hp(6),
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: Responsive.radius[8],
    },
    cancelBtn: {
        backgroundColor: '#F2F2F7',
    },
    confirmDeleteBtn: {
        backgroundColor: '#FF5252',
    },
    cancelBtnText: {
        color: '#444',
        fontWeight: '600',
    },
    deleteBtnText: {
        color: '#FFF',
        fontWeight: '600',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center', // Centers the box vertically
        alignItems: 'center',     // Centers the box horizontally
    },
    modalContent: {
        width: '85%',
        backgroundColor: '#FFF',
        borderRadius: Responsive.radius[20],
        padding: Responsive.spacing[20],
        // maxHeight ensures it doesn't touch the edges of the screen
        maxHeight: Platform.OS === 'ios' ? '70%' : '80%',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
    },
    // Ensure your scrollview doesn't force a height
    scrollContainer: {
        flexGrow: 0, // Tells the scrollview to only take required space
    }
});

export default SettingsScreen;