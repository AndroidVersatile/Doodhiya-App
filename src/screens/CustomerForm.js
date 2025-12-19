import React, { useEffect, useRef, useState } from "react";
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  Switch,
  StyleSheet,
  ScrollView,
  Alert,
  ToastAndroid,
  StatusBar,
  Animated,
} from "react-native";
import {
  addCustomer,
  updateCustomer,
  getCustomerById,
  generateCustomerCode,
} from "../db/database";
import BackHeader from "../components/BackHeader";
import { SafeAreaView } from "react-native-safe-area-context";
const CustomerFormScreen = ({ route, navigation }) => {
  const editingId = route.params?.id ?? null;

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

  useEffect(() => {
    (async () => {
      if (editingId) {
        const c = await getCustomerById(editingId);
        setCustomerCode(c.customer_code);
        setName(c.name);
        setAddress(c.address);
        setCity(c.city);
        setContact(c.contact_no);
        setWhatsapp(c.whatsapp_no);
        setMilkType(c.milk_type);
        setRate(String(c.rate));
      } else {
        if (autoCode) {
          const code = await generateCustomerCode();
          setCustomerCode(code);
        }
      }
    })();
  }, [editingId, autoCode]);
  const isOnlyDigits = (value) => /^\d+$/.test(value);
  const isValidPhone = (value) =>
    isOnlyDigits(value) && value.length >= 10;

  const focusField = (key) => {
    const ref = focusableFields[key];
    if (!ref) return;

    setTimeout(() => {
      ref.current?.focus();
    }, 300);
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

  const onSave = async () => {
    let newErrors = {};

    if (!customerCode.trim()) {
      newErrors.code = 'Customer code is required';
    }

    if (!name.trim()) {
      newErrors.name = 'Customer name is required';
    }
    if (!address.trim()) {
      newErrors.address = 'Address is required';
    }
    if (!city.trim()) {
      newErrors.city = 'City is required';
    }

    if (!contact) {
      newErrors.contact = 'Contact number is required';
    } else if (!isValidPhone(contact)) {
      newErrors.contact = 'Contact number must be at least 10 digits';
    }

    if (!whatsapp) {
      newErrors.whatsapp = 'WhatsApp number is required';
    } else if (!isValidPhone(whatsapp)) {
      newErrors.whatsapp = 'Contact number must be at least 10 digits';
    }

    if (!rate || isNaN(rate)) {
      newErrors.rate = 'Rate must be a valid number';
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

    const payload = {
      customer_code: customerCode,
      name,
      address,
      city,
      contact_no: contact,
      whatsapp_no: whatsapp,
      milk_type: milkType,
      rate: parseFloat(rate || 0),
    };

    if (editingId) {
      await updateCustomer(editingId, payload);
      Alert.alert('Updated', "Customer updated successfully.");
    } else {
      await addCustomer(payload);
      // Alert.alert("Saved", "Customer saved successfully.");
      ToastAndroid.showWithGravity("Customer saved successfully.", ToastAndroid.LONG, ToastAndroid.BOTTOM);
    }

    navigation.goBack();
  };
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
    code: new Animated.Value(0),
    name: new Animated.Value(0),
    address: new Animated.Value(0),
    city: new Animated.Value(0),
    contact: new Animated.Value(0),
    whatsapp: new Animated.Value(0),
    timePeriod: new Animated.Value(0),
    time: new Animated.Value(0),
    liter: new Animated.Value(0),
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

      <BackHeader title={editingId ? `Edit ${name}` : 'Add Customer'} bg={'#f6f7fb'} ph={16} />

      <ScrollView
        ref={scrollRef}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.container}>
        <StatusBar barStyle={'dark-content'} backgroundColor={'#f6f7fb'}

        />
        <View style={styles.card}>
          {/* Customer Code */}
          <View
            onLayout={(e) => {
              fieldPositions.current.code = e.nativeEvent.layout.y;
            }}
          >
            <Text style={styles.label}>Customer Code</Text>
            <TextInput
              ref={codeInputRef}
              value={customerCode}
              onChangeText={(text) => {
                setCustomerCode(text)
                setErrors(prev => ({ ...prev, code: null }));

              }}
              style={[
                styles.input,
                errors.code && styles.inputError
              ]}
            />
            {errors.code && (
              <Animated.View
                style={{
                  transform: [{ translateX: shakeAnim.code || 0 }],
                }}

              >
                <Text style={styles.errorText}>{errors.code}</Text>
              </Animated.View>
            )}
          </View>
          {/* Name */}
          <View
            onLayout={(e) => {
              fieldPositions.current.name = e.nativeEvent.layout.y;
            }}
          >

            <Text style={styles.label}>Customer Name</Text>
            <TextInput
              ref={nameInputRef}
              value={name}
              onChangeText={(text) => {
                setName(text)
                setErrors(prev => ({ ...prev, name: null }));

              }}
              style={[
                styles.input,
                errors.name && styles.inputError
              ]}
            />
          </View>
          {errors.name && (
            <Animated.View
              style={{
                transform: [{ translateX: shakeAnim.name || 0 }],
              }}
            >
              <Text style={styles.errorText}>{errors.name}</Text>
            </Animated.View>
          )}
          {/* Address */}
          <View
            onLayout={(e) => {
              fieldPositions.current.address = e.nativeEvent.layout.y;
            }}
          >
            <Text style={styles.label}>Address</Text>
            <TextInput
              value={address}
              ref={addressInputRef}
              onChangeText={(text) => {
                setAddress(text)
                setErrors(prev => ({ ...prev, address: null }));

              }}
              style={[
                styles.input,
                errors.address && styles.inputError
              ]}
            />
            {errors.address && (
              <Animated.View
                style={{
                  transform: [{ translateX: shakeAnim.address || 0 }],
                }}
              >
                <Text style={styles.errorText}>{errors.address}</Text>
              </Animated.View>
            )}
          </View>
          {/* City */}
          <View
            onLayout={(e) => {
              fieldPositions.current.city = e.nativeEvent.layout.y;
            }}
          >
            <Text style={styles.label}>City</Text>
            <TextInput
              ref={cityInputRef}
              value={city}
              onChangeText={(text) => {
                setCity(text)
                setErrors(prev => ({ ...prev, city: null }));

              }}
              style={[
                styles.input,
                errors.city && styles.inputError
              ]}
            />
            {errors.city && (
              <Animated.View
                style={{
                  transform: [{ translateX: shakeAnim.city || 0 }],
                }}
              >
                <Text style={styles.errorText}>{errors.city}</Text>
              </Animated.View>
            )}
          </View>
          {/* Contact */}
          <View
            onLayout={(e) => {
              fieldPositions.current.contact = e.nativeEvent.layout.y;
            }}
          >
            <Text style={styles.label}>Contact Number</Text>
            <TextInput
              value={contact}
              ref={contactInputRef}
              keyboardType="phone-pad"
              maxLength={10}
              onChangeText={(text) => {
                setContact(text.replace(/[^0-9]/g, '')); // digits only
                setErrors(prev => ({ ...prev, contact: null }));
              }}
              style={[
                styles.input,
                errors.contact && styles.inputError
              ]}
            />
            {errors.contact && (
              <Animated.View
                style={{
                  transform: [{ translateX: shakeAnim.contact || 0 }],
                }}
              >
                <Text style={styles.errorText}>{errors.contact}</Text>
              </Animated.View>
            )}
          </View>
          {/* WhatsApp */}
          <View
            onLayout={(e) => {
              fieldPositions.current.whatsapp = e.nativeEvent.layout.y;
            }}
          >
            <Text style={styles.label}>WhatsApp Number</Text>
            <TextInput
              value={whatsapp}
              ref={whatsappInputRef}
              keyboardType="phone-pad"
              maxLength={10}
              onChangeText={(text) => {
                setWhatsapp(text.replace(/[^0-9]/g, ''));
                setErrors(prev => ({ ...prev, whatsapp: null }));
              }}
              style={[
                styles.input,
                errors.whatsapp && styles.inputError
              ]}
            />

            {errors.whatsapp && (
              <Animated.View
                style={{
                  transform: [{ translateX: shakeAnim.whatsapp || 0 }],
                }}
              >
                <Text style={styles.errorText}>{errors.whatsapp}</Text>
              </Animated.View>
            )}
          </View>
          {/* Milk Type */}
          <Text style={styles.label}>Milk Type</Text>
          <View style={styles.milkTypeBox}>
            {["cow", "buffalo", "mixed"].map((type) => (
              <TouchableOpacity
                activeOpacity={0.7}
                key={type}
                onPress={() => setMilkType(type)}
                style={[
                  styles.typeButton,
                  milkType === type && styles.typeButtonActive,
                ]}
              >
                <Text
                  style={[
                    styles.typeText,
                    milkType === type && styles.typeTextActive,
                  ]}
                >
                  {type.toUpperCase()}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Rate */}
          <Text style={styles.label}>Rate per Liter (₹)</Text>
          <TextInput
            value={rate}
            ref={rateInputRef}
            onChangeText={(text) => {
              {
                setRate(text);
                setErrors(prev => ({ ...prev, rate: null }));
              }
            }}
            style={styles.input}
            keyboardType="numeric"
          />
          {errors.rate && (
            <Animated.View
              style={{
                transform: [{ translateX: shakeAnim.rate || 0 }],
              }}
            >
              <Text style={styles.errorText}>{errors.rate}</Text>
            </Animated.View>
          )}
          {/* Save Button */}
          <TouchableOpacity style={styles.saveBtn}
            activeOpacity={0.7}
            onPress={onSave}>
            <Text style={styles.saveBtnText}>Save</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView >
  );
};
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  container: {
    padding: 16,
    backgroundColor: "#f6f7fb",
  },

  card: {
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 12,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
  },

  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 6,
    marginTop: 12,
  },

  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#fff",
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  milkTypeBox: {
    flexDirection: "row",
    marginTop: 6,
    gap: 10,
  },

  typeButton: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: "#eee",
  },

  typeButtonActive: {
    backgroundColor: "#0b8f3b",
  },

  typeText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },

  typeTextActive: {
    color: "#fff",
  },

  saveBtn: {
    backgroundColor: "#0b8f3b",
    padding: 14,
    borderRadius: 10,
    marginTop: 25,
    alignItems: "center",
  },

  saveBtnText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  inputError: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 10,
  },
});

export default CustomerFormScreen;
