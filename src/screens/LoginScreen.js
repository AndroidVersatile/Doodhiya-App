import { ActivityIndicator, Animated, Image, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useRef, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Icon from 'react-native-vector-icons/MaterialIcons';
const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const fieldPositions = useRef({});
    const scrollRef = useRef(null);
    const emailInputRef = useRef({});
    const passwordInputRef = useRef(null);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const focusField = (key) => {
        const ref = focusableFields[key];
        if (!ref) return;

        setTimeout(() => {
            ref.current?.focus();
        }, 300);
    };

    const focusableFields = {
        email: emailInputRef,
        password: passwordInputRef,

    };
    const handleLogin = () => {
        let newErrors = {};
        if (!email.trim()) {
            newErrors.email = 'Email is required';
        } else {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                newErrors.email = 'Invalid email address';
            }
        }
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            const firstErrorKey = Object.keys(newErrors)[0];
            scrollToField(firstErrorKey);
            focusField(firstErrorKey);
            triggerShake(firstErrorKey);
            return;
        }
        setErrors({}); // clear errors if valid
        setLoading(true)
        const timer = setTimeout(() => {
            navigation.replace('Home');
            setLoading(false)
        }, 2000);
        return () => clearInterval(timer)
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
        <SafeAreaView style={styles.mainContainer}>
            <StatusBar backgroundColor={'#fff'} barStyle={'dark-content'} />
            <ScrollView
                ref={scrollRef}
                showsVerticalScrollIndicator={false}
            >
                {/* Image Container  */}
                <View style={styles.imageView}>
                    <Image
                        source={require('../assets/images/milkpng.png')}
                        resizeMode='contain'
                        style={styles.imageStyle}
                    />
                </View>
                {/* Login Text  */}
                <Text style={styles.loginText}>
                    Welcome! Admin Let's Login
                </Text>
                {/*Email Text Input  */}
                <View
                    onLayout={(e) => {
                        fieldPositions.current.email = e.nativeEvent.layout.y;
                    }}
                >
                    <View
                        style={[styles.inputContainer,

                        errors.email && styles.inputError
                        ]}>
                        <Icon name={'email'} size={27} color='#aca6a6ff' />
                        <TextInput
                            ref={emailInputRef}
                            value={email}
                            onChangeText={(text) => {
                                setEmail(text)
                                setErrors(prev => ({ ...prev, email: null }));
                            }}
                            keyboardType='email-address'
                            placeholder='Enter your email'
                            style={[
                                styles.inputStyle,

                            ]}

                        />
                    </View>
                    {errors.email && (
                        <Animated.View
                            style={[{
                                transform: [{ translateX: shakeAnim.email || 0 }],
                            }, { marginLeft: 20 }]}
                        >
                            <Text style={styles.errorText}>{errors.email}</Text>
                        </Animated.View>
                    )}
                </View>
                {/*Password Text Input  */}
                <View
                    onLayout={(e) => {
                        fieldPositions.current.password = e.nativeEvent.layout.y;
                    }}
                >
                    <View

                        style={[styles.inputContainer, errors.password && styles.inputError]}>
                        <Icon name={'lock'} size={27} color='#aca6a6ff' />
                        <TextInput
                            ref={passwordInputRef}
                            value={password}
                            onChangeText={(text) => {
                                setPassword(text)
                                setErrors(prev => ({ ...prev, password: null }));
                            }}
                            placeholder='Enter your password'
                            style={[styles.inputStyle,

                            ]}
                            secureTextEntry
                        />
                    </View>
                    {errors.password && (
                        <Animated.View
                            style={[{
                                transform: [{ translateX: shakeAnim.password || 0 }],
                            }, { marginLeft: 20 }]}
                        >
                            <Text style={styles.errorText}>{errors.password}</Text>
                        </Animated.View>
                    )}
                </View>
                <TouchableOpacity style={styles.forgetBtn}>
                    <Text style={styles.forgetText}>
                        Forget Password?
                    </Text>
                </TouchableOpacity>
                {/* Login Button  */}
                <View style={styles.loginContainer}>
                    <TouchableOpacity
                        onPress={handleLogin}
                        activeOpacity={0.7}
                        style={styles.loginBtn}>
                        {
                            loading ? <ActivityIndicator size={28} color={'#000'}
                                animating={true}
                                idesWhenStopped={true}

                            /> : <Text style={styles.loginBtnText}>Login</Text>
                        }

                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default LoginScreen

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        padding: 10,
        backgroundColor: '#fff'
    },
    imageView: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        marginTop: 20,
    },
    imageStyle: {
        width: '90%',
        height: 110,
    },
    loginText: {
        textAlign: 'center',
        fontSize: 25,
        fontWeight: '500',
        padding: 10,
    },
    inputContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        width: '90%',
        backgroundColor: "#fff",
        elevation: 10,
        borderRadius: 10,
        padding: 5,
        borderWidth: 0.5,
        borderColor: '#ccc',
        paddingHorizontal: 10,
        marginVertical: 20,
        gap: 3,
        shadowColor: 'blue'
    },
    inputStyle: {
        flex: 1,
        color: '#000',
        fontSize: 18
    },
    forgetBtn: {
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        marginRight: 20,
    },
    forgetText: {
        fontSize: 14,
        fontWeight: '400'
    },
    loginContainer: {
        justifyContent: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10
    },
    loginBtn: {
        backgroundColor: "#b9a1a1ff",
        borderColor: '#ccc',
        borderWidth: 0.5,
        padding: 10,
        paddingHorizontal: 80,
        marginVertical: 10,
        borderRadius: 10,
        elevation: 5,
        shadowColor: 'blue'
    },
    loginBtnText: {
        fontSize: 20,
        fontWeight: '500',

    },
    inputError: {
        borderColor: 'red',
        borderWidth: 1,
    },
    errorText: {
        color: 'red',
        fontSize: 12,
        marginBottom: 10,
    },

})