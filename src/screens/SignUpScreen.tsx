
import { ActivityIndicator, Animated, Image, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View, Vibration, Alert, Dimensions, KeyboardAvoidingView, Platform } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import Icon from 'react-native-vector-icons/MaterialIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import { useDispatch, useSelector } from 'react-redux';
import { Responsive } from '../theme/responsive';
import { loginWithGoogle, signupWithEmail } from '../redux/slice/authSlice';
import BackHeader from '../components/BackHeader';

const SignUpScreen = ({ navigation }) => {
    const { signUpLoading, error, googleLoading } = useSelector((state: any) => state.auth)
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [focusedField, setFocusedField] = useState(null);
    const fieldPositions = useRef({});
    const scrollRef = useRef(null);
    const emailInputRef = useRef(null);
    const passwordInputRef = useRef(null);
    const [errors, setErrors] = useState({});
    const [loadings, setLoadings] = useState(false);
    const [showPassword, setShowPassword] = useState(false)
    const timerRef = useRef(null)
    const dispatch = useDispatch();
    // console.log('Error', error);
    const insets = useSafeAreaInsets()
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

    const handleSignUp = () => {
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

        dispatch(signupWithEmail({ email: email.trim(), password: password.trim() }))

    }

    const handleGoogleLogin = () => {
        dispatch(loginWithGoogle())
    }
    const scrollToField = (key) => {
        const y = fieldPositions.current[key];
        if (y !== undefined) {
            scrollRef.current?.scrollTo({
                y: Math.max(0, y - 20),
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

    return (
        <View style={[styles.mainContainer, { paddingTop: insets.top + Responsive.spacing[10] }]} >
            <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />
            <BackHeader title={'Sign Up'} bg={'#fff'} />
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView
                    ref={scrollRef}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: Responsive.spacing[40] }}
                    accessible={true}
                    accessibilityRole="scrollbar"
                >
                    <View style={styles.imageView} importantForAccessibility="no"
                        accessibilityElementsHidden={true}>
                        <Image
                            source={require('../assets/images/AppLogo.png')}
                            resizeMode='contain'
                            style={styles.imageStyle}
                        />
                    </View>

                    <View style={styles.formSection} accessible={true}
                        accessibilityLabel="Sign up form">
                        {/* Email Input */}
                        <View onLayout={(e) => { fieldPositions.current.email = e.nativeEvent.layout.y; }} style={styles.inputWrapper}>
                            <View style={[
                                styles.inputContainer,
                                focusedField === 'email' && styles.inputFocused,
                                errors.email && styles.inputError
                            ]}>
                                <Icon name={'email'} size={Responsive.fontSize[24]} color={focusedField === 'email' ? '#b9a1a1' : '#aca6a6'} importantForAccessibility="no-hide-descendants" />
                                <TextInput
                                    ref={emailInputRef}
                                    value={email}
                                    placeholder='Enter your email'
                                    onFocus={() => setFocusedField('email')}
                                    onBlur={() => setFocusedField(null)}
                                    onChangeText={(text) => {
                                        setEmail(text)
                                        setErrors(prev => ({ ...prev, email: null }));
                                    }}
                                    keyboardType='email-address'
                                    style={styles.inputStyle}
                                    placeholderTextColor={'#b9a1a1'}
                                    accessibilityLabel="Email address"
                                    accessibilityHint="Enter your email address"
                                />
                            </View>
                            {errors.email && (
                                <Animated.View style={{ transform: [{ translateX: shakeAnim.email || 0 }], marginLeft: Responsive.spacing[10] }} accessibilityLiveRegion="assertive">
                                    <Text style={styles.errorText}>{errors.email}</Text>
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
                                <Icon name={'lock'} size={Responsive.fontSize[24]} color={focusedField === 'password' ? '#b9a1a1' : '#aca6a6'} importantForAccessibility="no-hide-descendants" />
                                <TextInput
                                    ref={passwordInputRef}
                                    value={password}
                                    placeholder='Enter your password'
                                    secureTextEntry={!showPassword}
                                    onFocus={() => setFocusedField('password')}
                                    onBlur={() => setFocusedField(null)}
                                    onChangeText={(text) => {
                                        setPassword(text)
                                        setErrors(prev => ({ ...prev, password: null }));
                                    }}
                                    style={styles.inputStyle}
                                    placeholderTextColor={'#b9a1a1'}
                                    accessibilityLabel="Password"
                                    accessibilityHint="Enter your password"
                                />
                                {
                                    password.length > 0 && <TouchableOpacity
                                        activeOpacity={0.7}
                                        onPress={() => setShowPassword(!showPassword)}
                                        accessibilityRole="button"
                                        accessibilityLabel={
                                            showPassword ? 'Hide password' : 'Show password'
                                        }
                                        accessibilityState={{ checked: showPassword }}
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
                                <Animated.View style={{ transform: [{ translateX: shakeAnim.password || 0 }], marginLeft: Responsive.spacing[10] }} accessibilityLiveRegion="assertive">
                                    <Text style={styles.errorText}>{errors.password}</Text>
                                </Animated.View>
                            )}
                        </View>

                        <TouchableOpacity
                            onPress={() => navigation.navigate('Login')}
                            accessibilityRole="button"
                            accessibilityLabel="Already have an account. Login"
                            style={styles.forgetBtn}>
                            <Text style={styles.forgetText}>Already have an account? Login</Text>
                        </TouchableOpacity>

                        {/* Login Button */}
                        <View style={styles.loginContainer}>

                            <TouchableOpacity
                                disabled={signUpLoading}
                                onPress={handleSignUp}
                                activeOpacity={0.7}
                                style={styles.loginBtn}
                                accessibilityRole="button"
                                accessibilityLabel="Sign up"
                                accessibilityState={{ busy: signUpLoading }}
                            >
                                {signUpLoading ? <ActivityIndicator size={Responsive.fontSize[28]} color={'#fff'} /> : <Text style={styles.loginBtnText}>Sign Up</Text>}
                            </TouchableOpacity>
                            <TouchableOpacity
                                disabled={signUpLoading}
                                onPress={handleGoogleLogin}
                                activeOpacity={0.7}
                                accessibilityRole="button"
                                accessibilityLabel="Sign up with Google"
                                accessibilityState={{ busy: googleLoading }}
                                style={styles.googleLoginBtn}>
                                {/* {loginLoading ? <ActivityIndicator size={28} color={'#000'} /> :
                                    <> */}

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
                                                importantForAccessibility="no"
                                            />
                                            <Text style={styles.googleLoginBtnText}>Signup with Google</Text>
                                        </>
                                }

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
        height: Responsive.size.hp(14),
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
        textDecorationLine: 'underline'
    },

    loginContainer: {
        marginTop: Responsive.spacing[20],
        alignItems: 'center',
        gap: Responsive.spacing[20]
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
    }
});

export default SignUpScreen;