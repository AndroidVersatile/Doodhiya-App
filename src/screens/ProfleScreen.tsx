
import { ActivityIndicator, Animated, Image, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View, Vibration, Alert, Dimensions, KeyboardAvoidingView, Platform, Keyboard, BackHandler } from 'react-native'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import BackHeader from '../components/BackHeader';
import { Responsive } from '../theme/responsive';
import { useSelector, useDispatch } from 'react-redux';
import { deleteProfilePhoto, updateProfilePhoto, updateUserProfile } from '../redux/slice/userProfileSlice';
import { TrueSheet } from '@lodev09/react-native-true-sheet';
import { pickImageFromCamera, pickImageFromGallery } from '../utitlies/imageCropPicker';

// const { width } = Dimensions.get('window');

const ProfileScreen = () => {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('')
    // const [password, setPassword] = useState('');
    // const [newPassword, setNewPassword] = useState('');
    const [focusedField, setFocusedField] = useState(null);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [localPhoto, setLocalPhoto] = useState(null);
    const [sheetVisible, setSheetVisible] = useState(false);
    const insets = useSafeAreaInsets();
    const fieldPositions = useRef({});
    const scrollRef = useRef(null);
    const emailInputRef = useRef(null);
    const nameInputRef = useRef(null);
    const phoneInputRef = useRef(null);
    const newPasswordInputRef = useRef(null);
    const timerRef = useRef(null);
    const { profile, updateLoading, profilePicLoading, uploadProgress, profilePicDeleteLoading } = useSelector((state) => state.user);
    // console.log('Profile', profile);
    const { user, error } = useSelector((state) => state.auth);
    // console.log('User :', user);
    const navigation = useNavigation()
    const dispatch = useDispatch()
    const sheet = useRef<TrueSheet>(null)

    const memoizedPhotoURL = useMemo(() => {
        if (profile?.photoURL) {
            // This only updates when the actual photoURL from Redux changes
            return `${profile.photoURL}?t=${new Date().getTime()}`;
        }
        return null;
    }, [profile?.photoURL]); // 👈 Only recalculates when the photo actually changes
    // const present = () => {
    //     Keyboard.dismiss();
    //     requestAnimationFrame(async () => {
    //         await sheet.current?.present()
    //     });
    // }
    // const dismiss = async () => {
    //     await sheet.current?.dismiss()

    // }

    // const handleGalleryPick = async () => {
    //     const image = await pickImageFromGallery();
    //     setLocalPhoto(image.path);
    //     // console.log('Image Pth profile', image);

    //     if (!image) return;

    //     dispatch(updateProfilePhoto({
    //         uid: user.uid,
    //         image,
    //     }));
    // };

    // const handleCameraPick = async () => {
    //     const image = await pickImageFromCamera();
    //     if (!image) return;

    //     dispatch(updateProfilePhoto({
    //         uid: user.uid,
    //         image,
    //     }));
    // };
    // const handleRemovePic = async () => {
    //     await dispatch(deleteProfilePhoto({ uid: user.uid, })).unwrap()
    // }
    const isSheetOpen = useRef(false);
    const present = () => {
        Keyboard.dismiss();

        requestAnimationFrame(async () => {
            isSheetOpen.current = true;

            await sheet.current?.present();
        });
    };

    const dismiss = async () => {
        if (!isSheetOpen.current) return;

        isSheetOpen.current = false;
        await sheet.current?.dismiss();
    };
    useFocusEffect(
        useCallback(() => {
            if (Platform.OS !== 'android') return;

            const onBackPress = () => {
                // If sheet is open → dismiss it
                if (isSheetOpen.current) {
                    dismiss();
                    return true; // stop navigation
                }

                // Otherwise → allow normal navigation behavior
                return false;
            };

            const sub = BackHandler.addEventListener(
                'hardwareBackPress',
                onBackPress
            );

            return () => sub.remove();
        }, [])
    );
    const getProfileImage = () => {
        if (localPhoto) return { uri: localPhoto };

        // Use the memoized URL here
        if (memoizedPhotoURL) {
            return { uri: memoizedPhotoURL };
        }

        if (user?.photoURL) {
            return { uri: user.photoURL };
        }

        return require('../assets/images/profile.png');
    };
    const handleGalleryPick = async () => {
        try {
            const image = await pickImageFromGallery();
            if (!image) return;

            // 1. Set local preview instantly
            setLocalPhoto(image.path);

            // 2. Upload and wait for completion
            await dispatch(updateProfilePhoto({
                uid: user.uid,
                image,
            })).unwrap();


            setLocalPhoto(null);
        } catch (error) {
            setLocalPhoto(null); // Reset on error
            console.error("Gallery Upload Error:", error);
        }
    };

    const handleCameraPick = async () => {
        try {
            const image = await pickImageFromCamera();
            if (!image) return;

            // 1. Set local preview instantly
            setLocalPhoto(image.path);

            // 2. Upload
            await dispatch(updateProfilePhoto({
                uid: user.uid,
                image,
            })).unwrap();

            // 3. Success!
            setLocalPhoto(null);
        } catch (error) {
            setLocalPhoto(null);
            console.error("Camera Upload Error:", error);
        }
    };

    const handleRemovePic = async () => {
        try {
            await dispatch(deleteProfilePhoto({ uid: user.uid })).unwrap();
            // Clear everything to show placeholder
            setLocalPhoto(null);
        } catch (error) {
            console.error("Remove Error:", error);
        }
    };
    const isOnlyDigits = (value) => /^\d+$/.test(value);
    const isValidPhone = (value) => isOnlyDigits(value) && value.length >= 10;
    const focusField = (key) => {
        const ref = focusableFields[key];
        if (!ref) return;
        setTimeout(() => { ref.current?.focus(); }, 300);
    };

    const focusableFields = {
        email: emailInputRef,
        name: nameInputRef,
        phone: phoneInputRef,
    };
    useEffect(() => {
        if (user?.email) {
            setEmail(user.email);
        }
        if (user?.displayName) {
            setName(user.displayName);
        }
        if (profile?.phone) {
            setPhone(profile?.phone);
        }
    }, [user, profile]);

    const handleUpdate = () => {
        // console.log('Updated pressed');

        let newErrors = {};
        if (!email.trim()) {
            newErrors.email = 'Email is required';
            Vibration.vibrate(50);
        } else {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                newErrors.email = 'Invalid email address';
                Vibration.vibrate(50);
            }
        }
        if (!name.trim()) {
            newErrors.name = 'Name is required';
            Vibration.vibrate(50);
        }
        if (!phone) {
            newErrors.phone = 'Phone number is required';
            Vibration.vibrate(50);
        } else if (!isValidPhone(phone)) {
            newErrors.phone = 'Contact number must be at least 10 digits';
            Vibration.vibrate(50);
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            const firstErrorKey = Object.keys(newErrors)[0];
            scrollToField(firstErrorKey);
            focusField(firstErrorKey);
            triggerShake(firstErrorKey);
            return;
        }

        setErrors({});
        dispatch(
            updateUserProfile({
                uid: user?.uid,
                name,
                phone,

            })
        );
    };

    const scrollToInput = (ref) => {
        setTimeout(() => {
            ref?.current?.measureLayout(
                scrollRef.current,
                (x, y) => {
                    scrollRef.current?.scrollTo({ y: Math.max(0, y - 80), animated: true });
                },
                () => { }
            );
        }, 100);
    };

    const scrollToField = (key) => {
        const y = fieldPositions.current[key];
        if (y !== undefined) {
            scrollRef.current?.scrollTo({ y: Math.max(0, y - 20), animated: true });
        }
    };

    const shakeAnim = useRef({
        email: new Animated.Value(0),
        name: new Animated.Value(0),
    }).current;

    const triggerShake = (key) => {
        const anim = shakeAnim[key];
        if (!anim) return;
        Animated.sequence([
            Animated.timing(anim, { toValue: 10, duration: 60, useNativeDriver: true }),
            Animated.timing(anim, { toValue: -10, duration: 60, useNativeDriver: true }),
            Animated.timing(anim, { toValue: 0, duration: 60, useNativeDriver: true }),
        ]).start();
    };


    return (
        <View style={[styles.mainContainer, { paddingTop: insets.top + Responsive.spacing[10] }]} accessible={false} >
            <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />
            <BackHeader title={'Edit Profile'} bg={'#f6f7fb'}
                accessibilityRole="header"
                accessibilityLabel="Edit profile screen"
            />

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
                keyboardVerticalOffset={Platform.OS === 'android' ? StatusBar.currentHeight ?? 0 : 0}
            >
                <ScrollView
                    ref={scrollRef}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + Responsive.spacing[10] }]}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Header Section */}
                    <View style={styles.headerSection}>

                        <View style={styles.imageView}>
                            {
                                profilePicLoading ? <View style={styles.profileLoadingView}>
                                    <ActivityIndicator size="small" color="#0000ff" />
                                    <Text style={styles.profileLoadingText}>Updating...</Text>
                                </View> : <View>
                                    <Image
                                        source={
                                            getProfileImage()
                                        }
                                        resizeMode='cover'
                                        style={styles.imageStyle}
                                        accessibilityLabel="Profile Picture"
                                        accessible={true}
                                        accessibilityRole="image"
                                    />
                                </View>
                            }

                            <TouchableOpacity
                                activeOpacity={0.8}
                                style={styles.editButton}
                                onPress={() => present()}
                                disabled={profilePicDeleteLoading || profilePicLoading}
                                accessibilityRole="button"
                                accessibilityLabel="Change profile picture"
                                accessibilityHint="Opens options to take or select a photo"
                            >
                                {
                                    profilePicDeleteLoading ? <ActivityIndicator size="small" color="#fff" /> :
                                        <Icon name="photo-camera" size={Responsive.fontSize[15]} color="white" />
                                }

                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Form Card */}
                    <View style={styles.card}>
                        <Text style={styles.sectionTitle} accessibilityRole="header">Personal Information</Text>

                        {/* Email Input */}
                        <View onLayout={(e) => { fieldPositions.current.email = e.nativeEvent.layout.y; }} style={styles.inputWrapper}>
                            <Text style={styles.label}>Email Address</Text>
                            <View style={[
                                styles.inputContainer,
                                focusedField === 'email' && styles.inputFocused,
                                errors.email && styles.inputError
                            ]}>
                                <Icon name={'email'} size={Responsive.fontSize[22]} color={focusedField === 'email' ? '#007AFF' : '#aca6a6'} />
                                <TextInput
                                    ref={emailInputRef}
                                    value={email}
                                    onFocus={() => {
                                        setFocusedField('email');
                                        scrollToInput(emailInputRef);
                                    }}
                                    onBlur={() => setFocusedField(null)}
                                    onChangeText={(text) => {
                                        setEmail(text);
                                        setErrors(prev => ({ ...prev, email: null }));
                                    }}
                                    keyboardType='email-address'
                                    placeholder='Enter your email'
                                    returnKeyType="next"
                                    onSubmitEditing={() => nameInputRef.current?.focus()}
                                    blurOnSubmit={false}
                                    style={styles.inputStyle}
                                    editable={!user?.email}
                                    placeholderTextColor={'#b9a1a1'}
                                    accessibilityLabel="Email address"
                                    accessibilityHint="Your registered email address"
                                    importantForAccessibility="yes"
                                />
                            </View>
                            {errors.email && (
                                <Animated.View style={{ transform: [{ translateX: shakeAnim.email || 0 }] }}>
                                    <Text style={styles.errorText} accessibilityLiveRegion="polite">{errors.email}</Text>
                                </Animated.View>
                            )}
                        </View>

                        {/* Name Input */}
                        <View onLayout={(e) => { fieldPositions.current.name = e.nativeEvent.layout.y; }} style={styles.inputWrapper}>
                            <Text style={styles.label}>Full Name</Text>
                            <View style={[
                                styles.inputContainer,
                                focusedField === 'name' && styles.inputFocused,
                                errors.name && styles.inputError
                            ]}>
                                <Icon name={'person'} size={Responsive.fontSize[22]} color={focusedField === 'name' ? '#007AFF' : '#aca6a6'} />
                                <TextInput
                                    ref={nameInputRef}
                                    value={name}
                                    onFocus={() => {
                                        setFocusedField('name');
                                        scrollToInput(nameInputRef);
                                    }}
                                    onBlur={() => setFocusedField(null)}
                                    onChangeText={(text) => {
                                        setName(text);
                                        setErrors(prev => ({ ...prev, name: null }));
                                    }}
                                    placeholder='Enter your name'
                                    // returnKeyType="done"
                                    // onSubmitEditing={handleUpdate}
                                    style={styles.inputStyle}
                                    placeholderTextColor={'#b9a1a1'}
                                    accessibilityLabel="Full name"
                                    accessibilityHint="Enter your full name"
                                />
                            </View>
                            {errors.name && (
                                <Animated.View style={{ transform: [{ translateX: shakeAnim.name || 0 }] }}>
                                    <Text style={styles.errorText} accessibilityLiveRegion="polite">{errors.name}</Text>
                                </Animated.View>
                            )}
                        </View>
                        {/* Phone */}
                        <View onLayout={(e) => { fieldPositions.current.phone = e.nativeEvent.layout.y; }} style={styles.inputWrapper}>
                            <Text style={styles.label}>Phone Number</Text>
                            <View style={[
                                styles.inputContainer,
                                focusedField === 'phone' && styles.inputFocused,
                                errors.phone && styles.inputError
                            ]}>
                                <Icon name={'phone'} size={Responsive.fontSize[22]} color={focusedField === 'phone' ? '#007AFF' : '#aca6a6'} />
                                <TextInput
                                    ref={phoneInputRef}
                                    value={phone}
                                    onChangeText={(text) => {
                                        setPhone(text);
                                        setErrors(prev => ({ ...prev, phone: null }));
                                    }}
                                    placeholder='Enter your phone number'
                                    returnKeyType="done"
                                    onBlur={() => setFocusedField(null)}
                                    style={styles.inputStyle}
                                    placeholderTextColor={'#b9a1a1'}
                                    keyboardType='phone-pad'
                                    maxLength={10}
                                    onFocus={() => {
                                        setFocusedField('phone');
                                        scrollToInput(phoneInputRef);
                                    }}
                                    accessibilityLabel="Phone number"
                                    accessibilityHint="Enter your 10 digit phone number"
                                />
                            </View>
                            {errors.phone && (
                                <Animated.View style={{ transform: [{ translateX: shakeAnim.phone || 0 }] }}>
                                    <Text style={styles.errorText} accessibilityLiveRegion="polite">{errors.phone}</Text>
                                </Animated.View>
                            )}
                        </View>

                    </View>

                    {/* Update Button */}
                    <TouchableOpacity
                        onPress={handleUpdate}
                        activeOpacity={0.8}
                        style={[styles.updateBtn, loading && { opacity: 0.8 }]}
                        disabled={updateLoading}
                        accessibilityRole="button"
                        accessibilityLabel="Save changes"
                        accessibilityHint="Updates your profile information"
                    >
                        {updateLoading ? (
                            <ActivityIndicator size="small" color="#fff" />
                        ) : (
                            <Text style={styles.updateBtnText}>Save Changes</Text>
                        )}
                    </TouchableOpacity>

                </ScrollView>

            </KeyboardAvoidingView>
            <TrueSheet
                ref={sheet}
                // 
                detents={['auto', 1, 1]}
                backgroundBlur="dark"
                blurOptions={{
                    intensity: 15,
                    interaction: false,
                }}
                cornerRadius={Responsive.radius[24]}
                accessibilityViewIsModal={true}
            >
                <View style={styles.trueSheetContainer}>
                    <View style={styles.grabber} />
                    <Text style={styles.title}>Choose Options</Text>
                    <View style={styles.optionView}>
                        <TouchableOpacity
                            style={styles.option}
                            onPress={() => {
                                dismiss();
                                handleCameraPick();
                            }}
                            accessibilityRole="button"
                            accessibilityLabel="Take photo"
                        >
                            <Icon name="photo-camera" size={Responsive.fontSize[20]} color="#007AFF" />
                            <Text style={styles.optionText}>Take Photo</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.option}
                            onPress={() => {
                                dismiss();
                                handleGalleryPick();
                            }}
                            accessibilityRole="button"
                            accessibilityLabel="Choose from gallery"
                        >
                            <Icon name="photo-library" size={Responsive.fontSize[20]} color="#007AFF" />
                            <Text style={styles.optionText}>Choose from Gallery</Text>
                        </TouchableOpacity>



                        <TouchableOpacity
                            style={styles.option}
                            onPress={() => {
                                dismiss();
                                handleRemovePic()
                            }}
                            accessibilityRole="button"
                            accessibilityLabel="Remove profile photo"
                        >
                            <Icon name="delete" size={Responsive.fontSize[20]} color="#ff4444" />
                            <Text style={styles.optionText}>Remove Photo</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.option}
                            onPress={() => {
                                dismiss();
                            }}
                            accessibilityRole="button"
                            accessibilityLabel="Cancel"
                        >
                            <Icon name="close" size={Responsive.fontSize[20]} color="#666" />
                            <Text style={styles.optionText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </TrueSheet>
        </View>
    )
}


const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#f6f7fb',
    },

    scrollContent: {
        flexGrow: 1,
        padding: Responsive.size.wp(5),
        paddingBottom: Responsive.spacing[40],
    },

    headerSection: {
        alignItems: 'center',
        marginBottom: Responsive.spacing[24],
    },

    imageView: {
        width: Responsive.size.wp(30),
        height: Responsive.size.wp(30),
        borderRadius: Responsive.radius[60],
        backgroundColor: '#fff',
        elevation: 8,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: Responsive.radius[10],
        position: 'relative',
        borderWidth: 4,
        borderColor: '#fff',

    },

    imageStyle: {
        width: '100%',
        height: '100%',
        borderRadius: Responsive.radius[60],
    },

    editButton: {
        position: 'absolute',
        bottom: Responsive.spacing[4],
        right: -Responsive.spacing[8],
        backgroundColor: '#b9a1a1',
        width: Responsive.size.wp(9),
        height: Responsive.size.wp(9),
        borderRadius: Responsive.radius[20],
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: '#fff',
    },

    userNameText: {
        fontSize: Responsive.fontSize[22],
        fontWeight: '700',
        color: '#1a202c',
        marginTop: Responsive.spacing[16],
    },

    userSubText: {
        fontSize: Responsive.fontSize[14],
        color: '#718096',
        marginTop: Responsive.spacing[2],
    },

    card: {
        backgroundColor: '#fff',
        padding: Responsive.spacing[20],
        borderRadius: Responsive.radius[16],
        elevation: 4,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: Responsive.radius[8],
        shadowOffset: { width: 0, height: 4 },
        marginBottom: Responsive.spacing[24],
    },

    sectionTitle: {
        fontSize: Responsive.fontSize[16],
        fontWeight: '700',
        color: '#2d3748',
        marginBottom: Responsive.spacing[20],
    },

    inputWrapper: {
        marginBottom: Responsive.spacing[18],
    },

    label: {
        fontSize: Responsive.fontSize[14],
        fontWeight: '600',
        color: '#4a5568',
        marginBottom: Responsive.spacing[8],
    },

    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8fafc',
        borderRadius: Responsive.radius[12],
        borderWidth: 1.5,
        borderColor: '#edf2f7',
        paddingHorizontal: Responsive.spacing[12],
        height: Responsive.size.hp(6.8),
    },

    inputFocused: {
        borderColor: '#b9a1a1',
        backgroundColor: '#fff',
    },

    inputError: {
        borderColor: '#f56565',
    },

    inputStyle: {
        flex: 1,
        color: '#2d3748',
        fontSize: Responsive.fontSize[16],
        marginLeft: Responsive.spacing[8],
    },

    errorText: {
        color: '#f56565',
        fontSize: Responsive.fontSize[12],
        marginTop: Responsive.spacing[6],
        fontWeight: '500',
    },

    updateBtn: {
        backgroundColor: '#b9a1a1',
        height: Responsive.size.hp(7),
        borderRadius: Responsive.radius[12],
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 4,
        shadowColor: '#b9a1a1',
        shadowOpacity: 0.3,
        shadowRadius: Responsive.radius[8],
        shadowOffset: { width: 0, height: 4 },
    },

    updateBtnText: {
        fontSize: Responsive.fontSize[17],
        fontWeight: '700',
        color: '#fff',
    },
    // True Sheet Styles
    trueSheetContainer: {
        backgroundColor: '#fff',
        paddingHorizontal: Responsive.spacing[24],
        paddingTop: Responsive.spacing[16],
        paddingBottom: Responsive.spacing[40],
        borderTopLeftRadius: Responsive.radius[28],
        borderTopRightRadius: Responsive.radius[28],
    },
    grabber: {
        width: Responsive.size.wp(12),
        height: Responsive.size.hp(0.5),
        backgroundColor: '#CBD5E0',
        borderRadius: Responsive.radius[8],
        alignSelf: 'center',
        marginBottom: Responsive.spacing[20],
    },
    title: {
        fontSize: Responsive.fontSize[20],
        fontWeight: '800',
        color: '#1A202C',
        marginBottom: Responsive.spacing[24],
        textAlign: 'center',
        letterSpacing: 0.5,
    },
    option: {
        paddingVertical: Responsive.spacing[10],
        paddingHorizontal: Responsive.spacing[20],
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8FAFC',
        borderRadius: Responsive.radius[16],
        marginBottom: Responsive.spacing[12],
        gap: Responsive.spacing[16],
        borderWidth: 1,
        borderColor: '#E2E8F0',
        shadowColor: 'blue',
        shadowOpacity: 0.03,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
    },
    optionText: {
        fontSize: Responsive.fontSize[17],
        fontWeight: '600',
        color: '#2D3748',
        letterSpacing: 0.3,
    },
    divider: {
        height: 1,
        backgroundColor: '#E2E8F0',
        marginVertical: Responsive.spacing[20],
        marginHorizontal: Responsive.spacing[8],
    },
    cancelButton: {
        fontSize: Responsive.fontSize[16],
        fontWeight: '500',
        color: '#4a5568',
        textAlign: 'center',
        paddingVertical: Responsive.spacing[12],
    },
    optionView: {
        paddingHorizontal: Responsive.spacing[4],
        paddingVertical: Responsive.spacing[8],
    },
    profileLoadingView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
        width: '100%',
        height: '100%',

    },
    profileLoadingText: {
        fontSize: Responsive.fontSize[13],
        fontWeight: '500',
        color: '#4a5568',
        marginLeft: Responsive.spacing[12],
    },


});
export default ProfileScreen;