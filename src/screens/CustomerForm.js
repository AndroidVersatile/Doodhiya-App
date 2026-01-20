
import React, { useEffect, useRef, useState } from "react";
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ToastAndroid,
  StatusBar,
  Animated,
  Vibration,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";

import BackHeader from "../components/BackHeader";
import { SafeAreaView } from "react-native-safe-area-context";

import { Responsive } from "../theme/responsive";
import { useDispatch, useSelector } from "react-redux";
import { createCustomer, updateCustomerThunk } from "../redux/slice/customersSlice";
import { getNextCustomerCode } from "../services/customerServices";

const CustomerFormScreen = ({ route, navigation }) => {
  const { user } = useSelector((state) => state.auth);
  const uid = user?.uid;

  const { addLoading, updateLoading, fetchLoading } = useSelector((state) => state.customer);
  const isLoading = addLoading || updateLoading;
  const editingId = route.params?.item?.id ?? null;


  const [autoCode, setAutoCode] = useState(true);
  const [customerCode, setCustomerCode] = useState("");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [contact, setContact] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [milkType, setMilkType] = useState("cow");
  const [rate, setRate] = useState("");
  const [errors, setErrors] = useState({});
  const [focusedField, setFocusedField] = useState(null);

  // refs
  const scrollRef = useRef(null);
  const fieldPositions = useRef({});
  const codeInputRef = useRef(null);
  const nameInputRef = useRef(null);
  const cityInputRef = useRef(null);
  const addressInputRef = useRef(null);
  const contactInputRef = useRef(null);
  const whatsappInputRef = useRef(null);
  const rateInputRef = useRef(null);
  const dispatch = useDispatch()
  const scrollToInput = (ref) => {
    setTimeout(() => {
      ref?.current?.measureLayout(
        scrollRef.current,
        (x, y) => {
          scrollRef.current?.scrollTo({ y: Math.max(0, y - Responsive.spacing[80]), animated: true });
        },
        () => { }
      );
    }, 100);
  };

  useEffect(() => {
    (async () => {
      if (editingId) {
        const c = route.params?.item;
        setCustomerCode(c.customer_code);
        setName(c.name);
        setAddress(c.address);
        setCity(c.city);
        setContact(c.contact_no);
        // setWhatsapp(c.whatsapp_no);
        setMilkType(c.milk_type);
        setRate(String(c.rate));
      } else {
        if (autoCode && uid) {

          const code = await getNextCustomerCode(uid);
          setCustomerCode(code);
        }
      }
    })();
  }, [editingId, autoCode]);


  const isOnlyDigits = (value) => /^\d+$/.test(value);
  const isValidPhone = (value) => isOnlyDigits(value) && value.length >= 10;

  const focusField = (key) => {
    const ref = focusableFields[key];
    if (!ref) return;
    setTimeout(() => { ref.current?.focus(); }, 300);
  };

  const focusableFields = {
    code: codeInputRef,
    name: nameInputRef,
    address: addressInputRef,
    city: cityInputRef,
    contact: contactInputRef,
    whatsapp: whatsappInputRef,
    rate: rateInputRef,
  };

  // const onSave = async () => {
  //   let newErrors = {};

  //   if (!customerCode.trim()) { newErrors.code = 'Customer code is required'; Vibration.vibrate(100); }
  //   if (!name.trim()) { newErrors.name = 'Customer name is required'; Vibration.vibrate(100); }
  //   if (!address.trim()) { newErrors.address = 'Address is required'; Vibration.vibrate(50); }
  //   if (!city.trim()) { newErrors.city = 'City is required'; Vibration.vibrate(50); }

  //   if (!contact) { newErrors.contact = 'Contact number is required'; Vibration.vibrate(50); }
  //   else if (!isValidPhone(contact)) { newErrors.contact = 'Contact number must be at least 10 digits'; Vibration.vibrate(50); }

  //   if (whatsapp > 0 && !isValidPhone(whatsapp)) { newErrors.whatsapp = 'WhatsApp number must be at least 10 digits'; Vibration.vibrate(50); }

  //   if (!rate || isNaN(rate)) { newErrors.rate = 'Rate must be a valid number'; Vibration.vibrate(50); }

  //   if (Object.keys(newErrors).length > 0) {
  //     setErrors(newErrors);
  //     const firstErrorKey = Object.keys(newErrors)[0];
  //     scrollToField(firstErrorKey);
  //     focusField(firstErrorKey);
  //     triggerShake(firstErrorKey);
  //     return;
  //   }

  //   setErrors({});
  //   const payload = {
  //     customer_code: customerCode.trim(),
  //     name: name.trim(),
  //     address: address.trim(),
  //     city: city.trim().toLowerCase(),
  //     contact_no: contact.trim(),
  //     whatsapp_no: !whatsapp.trim() ? contact.trim() : whatsapp.trim(),
  //     milk_type: milkType,
  //     rate: parseFloat(rate || 0),
  //   };


  //   if (editingId) {
  //     // await updateCustomer(editingId, payload);
  //     dispatch(updateCustomerThunk({ uid, customerId: editingId, updates: payload }))
  //     // ToastAndroid.showWithGravity("Customer updated successfully.", ToastAndroid.LONG, ToastAndroid.BOTTOM);
  //   } else {
  //     // await addCustomer(payload);
  //     dispatch(createCustomer({ uid, customer: payload }))
  //     // ToastAndroid.showWithGravity("Customer saved successfully.", ToastAndroid.LONG, ToastAndroid.BOTTOM);
  //   }
  //   navigation.goBack();
  // };
  const onSave = async () => {
    let newErrors = {};

    if (!customerCode.trim()) { newErrors.code = 'Customer code is required'; Vibration.vibrate(100); }
    if (!name.trim()) { newErrors.name = 'Customer name is required'; Vibration.vibrate(100); }
    if (!address.trim()) { newErrors.address = 'Address is required'; Vibration.vibrate(50); }
    if (!city.trim()) { newErrors.city = 'City is required'; Vibration.vibrate(50); }

    if (!contact) { newErrors.contact = 'Contact number is required'; Vibration.vibrate(50); }
    else if (!isValidPhone(contact)) { newErrors.contact = 'Contact number must be at least 10 digits'; Vibration.vibrate(50); }

    if (whatsapp > 0 && !isValidPhone(whatsapp)) {
      newErrors.whatsapp = 'WhatsApp number must be at least 10 digits';
      Vibration.vibrate(50);
    }

    if (!rate || isNaN(rate)) {
      newErrors.rate = 'Rate must be a valid number';
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

    const payload = {
      customer_code: customerCode.trim(),
      name: name.trim(),
      address: address.trim(),
      city: city.trim().toLowerCase(),
      contact_no: contact.trim(),
      whatsapp_no: !whatsapp.trim() ? contact.trim() : whatsapp.trim(),
      milk_type: milkType,
      rate: parseFloat(rate || 0),
    };
    // console.log('Customer payload', payload);

    try {
      if (editingId) {
        await dispatch(
          updateCustomerThunk({
            uid,
            customerId: editingId,
            updates: payload,
          })
        ).unwrap();
      } else {
        await dispatch(
          createCustomer({
            uid,
            customer: payload,
          })
        ).unwrap();
      }

      navigation.goBack();
    } catch (error) {
      // thunk already shows toast, but this keeps flow safe
      console.log('Customer save failed:', error);
    }
  };

  const scrollToField = (key) => {
    const y = fieldPositions.current[key];
    if (y !== undefined) {
      scrollRef.current?.scrollTo({ y: Math.max(0, y - 20), animated: true });
    }
  };

  const shakeAnim = useRef({
    code: new Animated.Value(0),
    name: new Animated.Value(0),
    address: new Animated.Value(0),
    city: new Animated.Value(0),
    contact: new Animated.Value(0),
    whatsapp: new Animated.Value(0),
    rate: new Animated.Value(0),
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
      <BackHeader title={editingId ? `Edit ${name}` : 'Add Customer'} bg={'#f6f7fb'} />
      <StatusBar barStyle={'dark-content'} backgroundColor={'#f6f7fb'} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'android' ? StatusBar.currentHeight ?? 0 : 0}
      >
        <ScrollView
          ref={scrollRef}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.container}
        >
          {/* Section 1: Identity */}
          <Text style={styles.sectionHeader}>Identification</Text>
          <View style={styles.card}>
            <View onLayout={(e) => { fieldPositions.current.code = e.nativeEvent.layout.y; }}>
              <Text style={styles.label} nativeID="codeLabel">Customer Code</Text>
              <TextInput
                ref={codeInputRef}
                value={customerCode}
                returnKeyType="next"
                onSubmitEditing={() => nameInputRef.current?.focus()}
                blurOnSubmit={false}
                onFocus={() => {
                  setFocusedField('code');
                  scrollToInput(codeInputRef);
                }}
                onBlur={() => setFocusedField(null)}
                onChangeText={(text) => {
                  setCustomerCode(text);
                  setErrors(prev => ({ ...prev, code: null }));
                }}
                accessibilityLabel="Customer Code"
                accessibilityLabelledBy="codeLabel"
                style={[
                  styles.input,
                  focusedField === 'code' && styles.inputFocused,
                  errors.code && styles.inputError
                ]}
              />
              {errors.code && (
                <Animated.View style={{ transform: [{ translateX: shakeAnim.code || 0 }] }} accessibilityLiveRegion="assertive">
                  <Text style={styles.errorText}>{errors.code}</Text>
                </Animated.View>
              )}
            </View>

            <View style={{ marginTop: Responsive.spacing[15] }} onLayout={(e) => { fieldPositions.current.name = e.nativeEvent.layout.y; }}>
              <Text style={styles.label} nativeID="nameLabel">Customer Name</Text>
              <TextInput
                ref={nameInputRef}
                value={name}
                returnKeyType="next"
                onSubmitEditing={() => addressInputRef.current?.focus()}
                blurOnSubmit={false}
                onFocus={() => {
                  setFocusedField('name');
                  scrollToInput(nameInputRef);
                }}
                onBlur={() => setFocusedField(null)}
                onChangeText={(text) => {
                  setName(text);
                  setErrors(prev => ({ ...prev, name: null }));
                }}
                accessibilityLabel="Customer Name"
                accessibilityLabelledBy="nameLabel"
                style={[
                  styles.input,
                  focusedField === 'name' && styles.inputFocused,
                  errors.name && styles.inputError
                ]}
              />
              {errors.name && (
                <Animated.View style={{ transform: [{ translateX: shakeAnim.name || 0 }] }} accessibilityLiveRegion="assertive">
                  <Text style={styles.errorText}>{errors.name}</Text>
                </Animated.View>
              )}
            </View>
          </View>

          {/* Section 2: Contact */}
          <Text style={styles.sectionHeader}>Address & Contact</Text>
          <View style={styles.card}>
            <View onLayout={(e) => { fieldPositions.current.address = e.nativeEvent.layout.y; }}>
              <Text style={styles.label} nativeID="addressLabel">Address</Text>
              <TextInput
                ref={addressInputRef}
                value={address}
                returnKeyType="next"
                onSubmitEditing={() => cityInputRef.current?.focus()}
                blurOnSubmit={false}
                onFocus={() => {
                  setFocusedField('address');
                  scrollToInput(addressInputRef);
                }}
                onBlur={() => setFocusedField(null)}
                onChangeText={(text) => {
                  setAddress(text);
                  setErrors(prev => ({ ...prev, address: null }));
                }}
                accessibilityLabel="Address"
                accessibilityLabelledBy="addressLabel"
                style={[
                  styles.input,
                  focusedField === 'address' && styles.inputFocused,
                  errors.address && styles.inputError
                ]}
              />
              {errors.address && (
                <Animated.View style={{ transform: [{ translateX: shakeAnim.address || 0 }] }} accessibilityLiveRegion="assertive">
                  <Text style={styles.errorText}>{errors.address}</Text>
                </Animated.View>
              )}
            </View>

            <View style={{ marginTop: Responsive.spacing[15] }} onLayout={(e) => { fieldPositions.current.city = e.nativeEvent.layout.y; }}>
              <Text style={styles.label} nativeID="cityLabel">City</Text>
              <TextInput
                ref={cityInputRef}
                value={city}
                returnKeyType="next"
                onSubmitEditing={() => contactInputRef.current?.focus()}
                blurOnSubmit={false}
                onFocus={() => {
                  setFocusedField('city');
                  scrollToInput(cityInputRef);
                }}
                onBlur={() => setFocusedField(null)}
                onChangeText={(text) => {
                  setCity(text);
                  setErrors(prev => ({ ...prev, city: null }));
                }}
                accessibilityLabel="City"
                accessibilityLabelledBy="cityLabel"
                style={[
                  styles.input,
                  focusedField === 'city' && styles.inputFocused,
                  errors.city && styles.inputError
                ]}
              />
              {errors.city && (
                <Animated.View style={{ transform: [{ translateX: shakeAnim.city || 0 }] }} accessibilityLiveRegion="assertive">
                  <Text style={styles.errorText}>{errors.city}</Text>
                </Animated.View>
              )}
            </View>

            <View style={{ marginTop: Responsive.spacing[15] }} onLayout={(e) => { fieldPositions.current.contact = e.nativeEvent.layout.y; }}>
              <Text style={styles.label} nativeID="contactLabel">Contact Number</Text>
              <TextInput
                ref={contactInputRef}
                value={contact}
                keyboardType="phone-pad"
                maxLength={10}
                returnKeyType="next"
                onSubmitEditing={() => whatsappInputRef.current?.focus()}
                blurOnSubmit={false}
                onFocus={() => {
                  setFocusedField('contact');
                  scrollToInput(contactInputRef);
                }}
                onBlur={() => setFocusedField(null)}
                onChangeText={(text) => {
                  setContact(text.replace(/[^0-9]/g, ''));
                  setErrors(prev => ({ ...prev, contact: null }));
                }}
                accessibilityLabel="Contact Number"
                accessibilityLabelledBy="contactLabel"
                style={[
                  styles.input,
                  focusedField === 'contact' && styles.inputFocused,
                  errors.contact && styles.inputError
                ]}
              />
              {errors.contact && (
                <Animated.View style={{ transform: [{ translateX: shakeAnim.contact || 0 }] }} accessibilityLiveRegion="assertive">
                  <Text style={styles.errorText}>{errors.contact}</Text>
                </Animated.View>
              )}
            </View>

            <View style={{ marginTop: Responsive.spacing[15] }} onLayout={(e) => { fieldPositions.current.whatsapp = e.nativeEvent.layout.y; }}>
              <Text style={styles.label} nativeID="whatsappLabel">WhatsApp Number (Optional)</Text>
              <TextInput
                ref={whatsappInputRef}
                value={whatsapp}
                keyboardType="phone-pad"
                maxLength={10}
                returnKeyType="next"
                onSubmitEditing={() => rateInputRef.current?.focus()}
                blurOnSubmit={false}
                onFocus={() => {
                  setFocusedField('whatsapp');
                  scrollToInput(whatsappInputRef);
                }}
                onBlur={() => setFocusedField(null)}
                onChangeText={(text) => {
                  setWhatsapp(text.replace(/[^0-9]/g, ''));
                  setErrors(prev => ({ ...prev, whatsapp: null }));
                }}
                accessibilityLabel="WhatsApp Number (Optional)"
                accessibilityLabelledBy="whatsappLabel"
                style={[
                  styles.input,
                  focusedField === 'whatsapp' && styles.inputFocused,
                  errors.whatsapp && styles.inputError
                ]}
              />
              {errors.whatsapp && (
                <Animated.View style={{ transform: [{ translateX: shakeAnim.whatsapp || 0 }] }} accessibilityLiveRegion="assertive">
                  <Text style={styles.errorText}>{errors.whatsapp}</Text>
                </Animated.View>
              )}
            </View>
          </View>

          {/* Section 3: Milk Type */}
          <Text style={styles.sectionHeader}>Service Preference</Text>
          <View style={styles.card}>
            <Text style={styles.label}>Milk Type</Text>
            <View style={styles.milkTypeBox} accessibilityRole="radiogroup" accessibilityLabel="Select Milk Type">
              {["cow", "buffalo", "mixed"].map((type) => (
                <TouchableOpacity
                  activeOpacity={0.7}
                  key={type}
                  onPress={() => setMilkType(type)}
                  accessibilityRole="radio"
                  accessibilityLabel={type}
                  accessibilityState={{ checked: milkType === type }}
                  style={[
                    styles.typeButton,
                    milkType === type && styles.typeButtonActive,
                  ]}
                >
                  <Text style={[styles.typeText, milkType === type && styles.typeTextActive]}>
                    {type.toUpperCase()}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={{ marginTop: Responsive.spacing[15] }} onLayout={(e) => { fieldPositions.current.rate = e.nativeEvent.layout.y; }}>
              <Text style={styles.label} nativeID="rateLabel">Rate per Liter (₹)</Text>
              <TextInput
                ref={rateInputRef}
                value={rate}
                keyboardType="numeric"
                returnKeyType="done"
                // onSubmitEditing={onSave}
                onFocus={() => {
                  setFocusedField('rate');
                  scrollToInput(rateInputRef);
                }}
                onBlur={() => setFocusedField(null)}
                onChangeText={(text) => {
                  setRate(text);
                  setErrors(prev => ({ ...prev, rate: null }));
                }}
                accessibilityLabel="Rate per Liter in Rupees"
                accessibilityLabelledBy="rateLabel"
                style={[
                  styles.input,
                  focusedField === 'rate' && styles.inputFocused,
                  errors.rate && styles.inputError
                ]}
              />
              {errors.rate && (
                <Animated.View style={{ transform: [{ translateX: shakeAnim.rate || 0 }] }} accessibilityLiveRegion="assertive">
                  <Text style={styles.errorText}>{errors.rate}</Text>
                </Animated.View>
              )}
            </View>
          </View>

          <TouchableOpacity
            style={styles.saveBtn}
            activeOpacity={0.7}
            onPress={onSave}
            accessibilityRole="button"
            accessibilityLabel={editingId ? 'Update Customer' : 'Save Customer'}
          >
            {
              isLoading ? <ActivityIndicator size="small" color="#fff" /> :
                <Text style={styles.saveBtnText}>{editingId ? 'Update' : 'Save'}</Text>

            }

          </TouchableOpacity>

          <View style={{ height: Responsive.spacing[40] }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#f6f7fb"
  },
  container: {
    padding: Responsive.spacing[16],
    flexGrow: 1, paddingBottom: Responsive.spacing[40]
  },
  sectionHeader: {
    fontSize: Responsive.fontSize[12], // Matches previous hp('1.6%')
    fontWeight: '700',
    color: '#718096',
    marginTop: Responsive.spacing[16],
    marginBottom: Responsive.spacing[8],
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginLeft: Responsive.spacing[4]
  },
  card: {
    backgroundColor: "#fff",
    padding: Responsive.spacing[18],
    borderRadius: Responsive.radius[12],
    marginBottom: Responsive.spacing[12],
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: Responsive.radius[5],
    shadowOffset: { width: 0, height: 2 },
  },
  label: {
    fontSize: Responsive.fontSize[14],
    fontWeight: "600",
    color: "#333",
    marginBottom: Responsive.spacing[4]
  },
  input: {
    borderWidth: 1,
    borderColor: "#e2e8f0",
    paddingHorizontal: Responsive.spacing[12],
    paddingVertical: Responsive.spacing[6],
    borderRadius: Responsive.radius[8],
    backgroundColor: "#f8fafc",
    fontSize: Responsive.fontSize[15],
    color: '#333',
    minHeight: Responsive.spacing[24]
  },
  inputFocused: {
    borderColor: '#b9a1a1',
    backgroundColor: '#fff',
    borderWidth: 1.5
  },
  inputError: {
    borderColor: '#ff4d4d'
  },
  errorText: {
    color: '#ff4d4d',
    fontSize: Responsive.fontSize[12],
    marginTop: Responsive.spacing[4]
  },
  milkTypeBox: {
    flexDirection: "row",
    marginTop: Responsive.spacing[4],
    gap: Responsive.spacing[10]
  },
  typeButton: {
    flex: 1,
    paddingVertical: Responsive.spacing[8],
    borderRadius: Responsive.radius[8],
    backgroundColor: "#eee",
    alignItems: 'center'
  },
  typeButtonActive: {
    backgroundColor: "#b9a1a1"
  },
  typeText: {
    fontSize: Responsive.fontSize[14],
    fontWeight: "600",
    color: "#333"
  },
  typeTextActive: {
    color: "#fff"
  },
  saveBtn: {
    backgroundColor: "#b9a1a1",
    paddingVertical: Responsive.spacing[12],
    borderRadius: Responsive.radius[10],
    marginTop: Responsive.spacing[16],
    alignItems: "center",
    elevation: 4,
    shadowColor: '#b9a1a1',
    shadowOpacity: 0.3,
    shadowRadius: Responsive.radius[6],
    shadowOffset: { width: 0, height: 4 },
  },
  saveBtnText: {
    color: "#fff",
    fontSize: Responsive.fontSize[16],
    fontWeight: "700"
  },
});
export default CustomerFormScreen;