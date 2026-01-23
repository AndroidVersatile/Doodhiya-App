
import { ActivityIndicator, Animated, Image, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View, Vibration, Alert, Dimensions, KeyboardAvoidingView, Platform, Keyboard } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useDispatch, useSelector } from 'react-redux';
import { Responsive } from '../theme/responsive';
import { loginWithEmail, loginWithGoogle } from '../redux/slice/authSlice';
import Entypo from 'react-native-vector-icons/Entypo';
const LoginScreen = ({ navigation }) => {
    const insets = useSafeAreaInsets();

    const { loginLoading, error, googleLoading } = useSelector((state: any) => state.auth)
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [focusedField, setFocusedField] = useState(null);
    const fieldPositions = useRef({});
    const scrollRef = useRef(null);
    const emailInputRef = useRef(null);
    const passwordInputRef = useRef(null);
    const [errors, setErrors] = useState({});
    const [loadings, setLoadings] = useState(false);
    const timerRef = useRef(null)
    const [showPassword, setShowPassword] = useState(false)
    const dispatch = useDispatch();
    const keyboardHeight = useRef(0);
    const focusableFields = {
        email: emailInputRef,
        password: passwordInputRef,
    };

    const focusField = (key) => {
        const ref = focusableFields[key];
        if (!ref) return;
        setTimeout(() => {
            ref.current?.focus();
        }, 300);
    };

    const handleLogin = () => {
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
            // else if (email.trim() !== 'admin@test.com') {
            //     newErrors.email = 'User not found';
            //     Vibration.vibrate(50);
            // }
        }
        if (!password.trim()) {
            newErrors.password = 'Password is required';
            Vibration.vibrate(50);
        }
        // else if (password.trim() !== '12345678') {
        //     newErrors.password = 'Wrong password, please recheck and enter again';
        //     Vibration.vibrate(50);
        // }
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            const firstErrorKey = Object.keys(newErrors)[0];
            scrollToField(firstErrorKey);
            focusField(firstErrorKey);
            triggerShake(firstErrorKey);
            return;
        }
        setErrors({});
        setLoadings(true)
        timerRef.current = setTimeout(() => {
            navigation.replace('Home');
            setLoadings(false)
        }, 2000);
        return () => { clearInterval(timerRef.current), Vibration.vibrate(50) };
    }
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

    const handleLoginPress = () => {
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
        if (!password.trim()) {
            newErrors.password = 'Password is required';
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

        dispatch(loginWithEmail({ email: email.trim(), password: password.trim() }));
    }
    const handleGoogleLogin = () => {
        dispatch(loginWithGoogle())
    }
    const scrollToField = (key) => {
        const y = fieldPositions.current[key];
        if (y !== undefined) {
            scrollRef.current?.scrollTo({
                y: Math.max(0, y - Responsive.size.hp(12)),
                animated: true,
            });
        }
    };


    const shakeAnim = useRef({
        email: new Animated.Value(0),
        password: new Animated.Value(0),
    }).current;

    const triggerShake = (key) => {
        const anim = shakeAnim[key];
        if (!anim) return;
        Animated.sequence([
            Animated.timing(anim, { toValue: 10, duration: 60, useNativeDriver: true }),
            Animated.timing(anim, { toValue: -10, duration: 60, useNativeDriver: true }),
            Animated.timing(anim, { toValue: 6, duration: 60, useNativeDriver: true }),
            Animated.timing(anim, { toValue: -6, duration: 60, useNativeDriver: true }),
            Animated.timing(anim, { toValue: 0, duration: 60, useNativeDriver: true }),
        ]).start();
    };

    useEffect(() => {
        const showSub = Keyboard.addListener('keyboardDidShow', (e) => {
            keyboardHeight.current = e.endCoordinates.height;
        });

        const hideSub = Keyboard.addListener('keyboardDidHide', () => {
            keyboardHeight.current = 0;
        });

        return () => {
            showSub.remove();
            hideSub.remove();
        };
    }, []);

    return (
        <View style={[styles.mainContainer]} >
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

            {/* Redesigned Header */}
            <View style={[styles.header, { paddingTop: insets.top + Responsive.spacing[10] }]}>
                <View>
                    <Text style={styles.welcomeText}>Welcome! </Text>
                    <Text style={styles.headerTitle} accessibilityRole="header">Let's Login</Text>
                </View>
                <Icon name="security" size={Responsive.fontSize[43]} color="rgba(255,255,255,0.6)" />
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
                keyboardVerticalOffset={Platform.OS === 'android' ? StatusBar.currentHeight ?? 0 : 0}
            >
                <ScrollView
                    ref={scrollRef}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{
                        paddingBottom: insets.bottom + Responsive.spacing[25],
                    }}
                >
                    <View style={styles.imageView}>
                        <Image
                            source={require('../assets/images/AppLogo.png')}
                            resizeMode='contain'
                            style={styles.imageStyle}
                            accessibilityElementsHidden
                            importantForAccessibility="no"
                        />
                    </View>

                    <View style={styles.formSection}>
                        {/* Email Input */}
                        <View onLayout={(e) => { fieldPositions.current.email = e.nativeEvent.layout.y; }} style={styles.inputWrapper}>
                            <View style={[
                                styles.inputContainer,
                                focusedField === 'email' && styles.inputFocused,
                                errors.email && styles.inputError
                            ]}>
                                <Icon name={'email'} size={Responsive.fontSize[24]} color={focusedField === 'email' ? '#b9a1a1' : '#aca6a6'} />
                                <TextInput
                                    ref={emailInputRef}
                                    value={email}
                                    placeholder='Enter your email'
                                    // onFocus={() => setFocusedField('email')}
                                    onFocus={() => {
                                        setFocusedField('email');
                                        scrollToInput(emailInputRef);
                                    }}
                                    onBlur={() => setFocusedField(null)}
                                    onChangeText={(text) => {
                                        setEmail(text)
                                        setErrors(prev => ({ ...prev, email: null }));
                                    }}
                                    keyboardType='email-address'
                                    style={styles.inputStyle}
                                    placeholderTextColor={'#b9a1a1'}
                                    accessibilityLabel="Email address input"
                                    accessibilityHint="Enter your registered email address"
                                    importantForAccessibility="yes"
                                />
                            </View>
                            {errors.email && (
                                <Animated.View style={{ transform: [{ translateX: shakeAnim.email || 0 }], marginLeft: Responsive.spacing[10] }}>
                                    <Text style={styles.errorText} accessibilityRole="alert"
                                        accessibilityLiveRegion="assertive">{errors.email}</Text>
                                </Animated.View>
                            )}
                        </View>

                        {/* Password Input */}
                        <View onLayout={(e) => { fieldPositions.current.password = e.nativeEvent.layout.y; }} style={styles.inputWrapper}>
                            <View style={[
                                styles.inputContainer,
                                focusedField === 'password' && styles.inputFocused,
                                errors.password && styles.inputError
                            ]}>
                                <Icon name={'lock'} size={Responsive.fontSize[24]} color={focusedField === 'password' ? '#b9a1a1' : '#aca6a6'} />
                                <TextInput
                                    ref={passwordInputRef}
                                    value={password}
                                    placeholder='Enter your password'
                                    secureTextEntry={!showPassword}
                                    // onFocus={() => setFocusedField('password')}
                                    onFocus={() => {
                                        setFocusedField('password');
                                        scrollToInput(passwordInputRef);
                                    }}
                                    onBlur={() => setFocusedField(null)}
                                    onChangeText={(text) => {
                                        setPassword(text)
                                        setErrors(prev => ({ ...prev, password: null }));
                                    }}
                                    style={styles.inputStyle}
                                    placeholderTextColor={'#b9a1a1'}
                                    accessibilityLabel="Password input"
                                    accessibilityHint="Enter your account password"
                                />
                                {
                                    password.length > 0 && <TouchableOpacity
                                        activeOpacity={0.7}
                                        onPressIn={() => setShowPassword(!showPassword)}
                                        accessibilityRole="button"
                                        accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
                                        accessibilityHint="Toggles password visibility"
                                    >
                                        {
                                            !showPassword ?
                                                <Entypo name={'eye'} size={Responsive.fontSize[24]} color={focusedField === 'password' ? '#b9a1a1' : '#aca6a6'} /> :
                                                <Entypo name={'eye-with-line'} size={Responsive.fontSize[24]} color={focusedField === 'password' ? '#b9a1a1' : '#aca6a6'} />
                                        }

                                    </TouchableOpacity>
                                }
                            </View>
                            {errors.password && (
                                <Animated.View style={{ transform: [{ translateX: shakeAnim.password || 0 }], marginLeft: Responsive.spacing[10] }}>
                                    <Text style={styles.errorText} accessibilityRole="alert"
                                        accessibilityLiveRegion="assertive">{errors.password}</Text>
                                </Animated.View>
                            )}
                        </View>

                        <TouchableOpacity
                            onPress={() => navigation.navigate('ForgetPasswordScreen')}
                            accessibilityRole="button"
                            accessibilityLabel="Forgot password"
                            style={styles.forgetBtn}>
                            <Text style={styles.forgetText}>Forget Password?</Text>
                        </TouchableOpacity>

                        {/* Login Button */}
                        <View style={styles.loginContainer}>

                            <TouchableOpacity
                                disabled={loginLoading}
                                onPress={handleLoginPress}
                                activeOpacity={0.7}
                                style={styles.loginBtn}
                                accessibilityRole="button"
                                accessibilityLabel="Login button"
                                accessibilityHint="Logs you into your account"
                                accessibilityState={{ disabled: loginLoading }}
                            >
                                {loginLoading ? <ActivityIndicator size={Responsive.fontSize[28]} color={'#fff'} /> : <Text style={styles.loginBtnText}>Login</Text>}
                            </TouchableOpacity>
                            <TouchableOpacity
                                disabled={loginLoading}
                                onPress={handleGoogleLogin}
                                activeOpacity={0.7}
                                accessibilityRole="button"
                                accessibilityLabel="Login with Google"
                                accessibilityHint="Logs in using your Google account"
                                style={styles.googleLoginBtn}>
                                {
                                    googleLoading ?
                                        <>
                                            <ActivityIndicator size={Responsive.fontSize[28]} color={'#ccc'} />
                                            <Text style={styles.googleLoginBtnText}>Please wait....</Text>
                                        </>

                                        :
                                        <>
                                            <Image
                                                source={require('../assets/images/googlepng.png')}
                                                resizeMode='contain'
                                                style={styles.googleImageStyle}
                                                accessibilityElementsHidden
                                                importantForAccessibility="no"
                                            />
                                            <Text style={styles.googleLoginBtnText}>Login with Google</Text>
                                        </>
                                }

                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => navigation.navigate('SignUpScreen')}>
                                <Text style={styles.dontHaveText}>Dont have an account? Create account</Text>
                            </TouchableOpacity>

                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#fff',
    },

    header: {
        backgroundColor: '#b9a1a1',
        paddingHorizontal: Responsive.size.wp(6),
        paddingTop: Responsive.size.hp(4),
        paddingBottom: Responsive.size.hp(6),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomLeftRadius: Responsive.radius[36],
        borderBottomRightRadius: Responsive.radius[36],
        elevation: 10,
        shadowColor: '#b9a1a1',
        shadowOpacity: 0.3,
        shadowRadius: Responsive.radius[10],
        shadowOffset: { width: 0, height: 5 },
    },

    welcomeText: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: Responsive.fontSize[14],
        fontWeight: '500',
    },

    headerTitle: {
        fontSize: Responsive.fontSize[22],
        fontWeight: '800',
        color: '#fff',
    },

    imageView: {
        alignItems: 'center',
        marginVertical: Responsive.spacing[24],
    },

    imageStyle: {
        width: Responsive.size.wp(80),
        height: Responsive.size.hp(16),
    },

    formSection: {
        paddingHorizontal: Responsive.size.wp(6),
    },

    inputWrapper: {
        marginBottom: Responsive.spacing[6],
    },

    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: Responsive.radius[16],
        paddingHorizontal: Responsive.spacing[16],
        height: Responsive.size.hp(7.5),
        marginVertical: Responsive.spacing[10],
        borderWidth: 1,
        borderColor: '#f0f0f0',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: Responsive.radius[4],
    },

    inputFocused: {
        borderColor: '#b9a1a1',
        borderWidth: 1.5,
        backgroundColor: '#fff',
    },

    inputError: {
        borderColor: '#ff4d4d',
        borderWidth: 1.5,
    },

    inputStyle: {
        flex: 1,
        color: '#000',
        fontSize: Responsive.fontSize[16],
        marginLeft: Responsive.spacing[8],
    },

    forgetBtn: {
        alignSelf: 'flex-end',
        marginRight: Responsive.spacing[4],
        marginTop: Responsive.spacing[4],
    },

    forgetText: {
        color: '#b9a1a1',
        fontSize: Responsive.fontSize[14],
        fontWeight: '600',
    },

    loginContainer: {
        marginTop: Responsive.spacing[20],
        alignItems: 'center',
        gap: Responsive.spacing[15]
    },

    loginBtn: {
        backgroundColor: '#b9a1a1',
        borderRadius: Responsive.radius[16],
        width: '100%',
        height: Responsive.size.hp(7),
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 8,
        shadowColor: '#b9a1a1',
        shadowOpacity: 0.4,
        shadowRadius: Responsive.radius[6],
        shadowOffset: { width: 0, height: 4 },
    },
    googleLoginBtn: {
        backgroundColor: '#fff',
        borderRadius: Responsive.radius[16],
        width: '100%',
        height: Responsive.size.hp(7),
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 8,
        shadowColor: '#b9a1a1',
        shadowOpacity: 0.4,
        shadowRadius: Responsive.radius[6],
        shadowOffset: { width: 0, height: 4 },
        borderWidth: 0.5,
        borderColor: '#ccc',
        flexDirection: 'row',
        gap: Responsive.spacing[15]

    },

    loginBtnText: {
        color: '#fff',
        fontSize: Responsive.fontSize[18],
        fontWeight: '700',
    },
    googleLoginBtnText: {
        color: '#000',
        fontSize: Responsive.fontSize[16],
        fontWeight: '500',
    },

    errorText: {
        color: '#ff4d4d',
        fontSize: Responsive.fontSize[12],
        marginTop: -Responsive.spacing[4],
        marginBottom: Responsive.spacing[8],
    },
    googleImageStyle: {
        width: Responsive.size.wp(7),
        height: Responsive.size.hp(7)
    },
    dontHaveText: {
        fontSize: Responsive.fontSize[14],
        textDecorationLine: 'underline'
    }
});

export default LoginScreen;