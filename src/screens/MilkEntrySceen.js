import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  StatusBar,
  ToastAndroid,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";

import { getCustomers, addMilkEntry, getCustomerById } from '../db/database';
import BackHeader from "../components/BackHeader";
import { SafeAreaView } from "react-native-safe-area-context";
// import api from "../utitlies/api";

const formatDate = (d = new Date()) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  // return `${y}-${m}-${day}`;
  return `${day}-${m}-${y}`;
};

const MilkEntryScreen = ({ navigation }) => {
  const [customers, setCustomers] = useState([]);
  const [customerId, setCustomerId] = useState(null);

  const [dateObj, setDateObj] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [timeObj, setTimeObj] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);

  const [timePeriod, setTimePeriod] = useState("Morning");

  const [liter, setLiter] = useState("1");
  const [rate, setRate] = useState(0);
  const [amount, setAmount] = useState(0);
  const [errors, setErrors] = useState({});
  const [milkType, setMilkType] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('')
  const scrollRef = useRef(null);
  const fieldPositions = useRef({});

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    const list = await getCustomers();
    setCustomers(list);
  };

  const onCustomerChange = async (id) => {
    setCustomerId(id);
    if (!id) {
      setRate(0);
      return;
    }
    const c = await getCustomerById(id);
    setRate(c?.rate ?? 0);
    setMilkType(c?.milk_type ?? 'cow');
    setDeliveryAddress(`${c?.address}, ${c?.city}`)
    const l = parseFloat(liter || 0);
    setAmount(Number((l * (c?.rate ?? 0)).toFixed(2)));
  };

  const onLiterChange = (val) => {
    setLiter(val);
    const l = parseFloat(val || 0);
    setAmount(Number((l * (rate || 0)).toFixed(2)));
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


  const onSave = async () => {
    let newErrors = {};

    if (!customerId) {
      newErrors.customerId = 'Please select a customer';
    }

    if (!dateObj) {
      newErrors.date = 'Date is required';
    }

    if (!timePeriod) {
      newErrors.timePeriod = 'Please select time period';
    }

    if (!timeObj) {
      newErrors.time = 'Delivery time is required';
    }

    if (!milkType) {
      newErrors.milkType = 'Milk Type is required';
    }

    if (!liter || isNaN(liter) || Number(liter) <= 0) {
      newErrors.liter = 'Milk liter must be greater than 0';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      const firstErrorKey = Object.keys(newErrors)[0];
      scrollToField(firstErrorKey);
      return;
    }

    setErrors({});

    const formattedDate = formatDate(dateObj);

    let hours = timeObj.getHours();
    const minutes = String(timeObj.getMinutes()).padStart(2, "0");
    const deliveryPeriod = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;

    const deliveryTime = `${deliveryPeriod} ${hours}:${minutes}`;

    const entry = {
      customer_id: customerId,
      date: formattedDate,
      time_period: timePeriod,
      delivery_time: deliveryTime,
      delivery_address: deliveryAddress,
      milk_type: milkType,
      milk_liter: parseFloat(liter || 0),
      rate: parseFloat(rate || 0),
      amount: parseFloat(amount || 0),
    };

    await addMilkEntry(entry);
    // Alert.alert("Saved", "Milk entry saved successfully.");
    ToastAndroid.showWithGravity("Milk entry saved successfully", ToastAndroid.LONG, ToastAndroid.BOTTOM);
    setLiter("");
    setAmount(0);
    setCustomerId(null);
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.mainContainer}>
      <BackHeader title={'Milk Entry'} bg={'#f6f7fb'} ph={16} />
      <StatusBar barStyle={'dark-content'} backgroundColor={'#f6f7fb'} />
      <ScrollView contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        ref={scrollRef}
      >
        {/* Card */}
        <View
          style={styles.card}>
          <View
            onLayout={(e) => {
              fieldPositions.current.customerId = e.nativeEvent.layout.y;
            }}
          >
            <Text style={styles.label}>Select Customer</Text>
            <View
              onLayout={(e) => {
                fieldPositions.current.customerId = e.nativeEvent.layout.y;
              }}
              style={[
                styles.pickerBox,
                errors.customerId && styles.inputError,
              ]}
            >
              <Picker
                selectedValue={customerId}
                onValueChange={(v) => {
                  onCustomerChange(v);
                  setErrors((e) => ({ ...e, customerId: null }));
                }}
                style={styles.picker}
              >
                <Picker.Item label="-- Select Customer --" value={null} />
                {customers.map((c) => (
                  <Picker.Item
                    key={c.id}
                    label={`${c.name} (${c.customer_code})`}
                    value={c.id}
                  />
                ))}
              </Picker>
            </View>

            {errors.customerId && (
              <Text style={styles.errorText}>{errors.customerId}</Text>
            )}
          </View>
          {/* Date */}
          <View
            onLayout={(e) => {
              fieldPositions.current.date = e.nativeEvent.layout.y;
            }}
          >
            <Text style={styles.label}>Date</Text>
            <TouchableOpacity
              activeOpacity={0.7}
              style={[
                styles.input,
                errors.date && styles.inputError,
              ]}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.inputText}>{formatDate(dateObj)}</Text>
            </TouchableOpacity>
            {errors.date && <Text style={styles.errorText}>{errors.date}</Text>}
            {showDatePicker && (
              <DateTimePicker
                value={dateObj}
                mode="date"
                onChange={(e, selected) => {
                  setShowDatePicker(false);
                  if (selected) setDateObj(selected);
                }}
              />
            )}
          </View>
          {/* Time Period */}
          <View
            onLayout={(e) => {
              fieldPositions.current.timePeriod = e.nativeEvent.layout.y;
            }}
          >
            <Text style={styles.label}>Time Period</Text>
            <View
              style={[
                styles.pickerBox,
                errors.timePeriod && styles.inputError,
              ]}

            >
              <Picker
                selectedValue={timePeriod}
                onValueChange={(v) => {
                  setTimePeriod(v);
                  setErrors((e) => ({ ...e, timePeriod: null }));
                }}
                style={styles.picker}
              >
                <Picker.Item label="Morning" value="Morning" />
                <Picker.Item label="Evening" value="Evening" />
              </Picker>
            </View>
          </View>
          {/* Delivery Time */}
          <View
            onLayout={(e) => {
              fieldPositions.current.time = e.nativeEvent.layout.y;
            }}
          >
            <Text style={styles.label}>Delivery Time</Text>
            <TouchableOpacity
              activeOpacity={0.7}
              style={[
                styles.input,
                errors.time && styles.inputError,
              ]}
              onPress={() => setShowTimePicker(true)}
            >
              <Text style={styles.inputText}>
                {timeObj.toLocaleTimeString("en-IN", {
                  hour: "numeric",
                  minute: "2-digit",
                })}
              </Text>
            </TouchableOpacity>
            {errors.time && <Text style={styles.errorText}>{errors.time}</Text>}
          </View>
          {showTimePicker && (
            <DateTimePicker
              value={timeObj}
              mode="time"
              onChange={(e, selected) => {
                setShowTimePicker(false);
                if (selected) setTimeObj(selected);
              }}
            />
          )}

          {/* Milk Type */}
          <View
            onLayout={(e) => {
              fieldPositions.current.liter = e.nativeEvent.layout.y;
            }}
          >
            <Text style={styles.label}>Milk Type </Text>
            <TextInput
              value={milkType}
              onChangeText={(text) => {
                setMilkType(text);
                setErrors((e) => ({ ...e, milkType: null }));
              }}
              style={[
                styles.input,
                errors.milkType && styles.inputError,
              ]}
              editable={milkType.length === 0 ? true : false}
            />
            {errors.milkType && <Text style={styles.errorText}>{errors.milkType}</Text>}
          </View>
          {/* Milk Liter */}
          <View
            onLayout={(e) => {
              fieldPositions.current.liter = e.nativeEvent.layout.y;
            }}
          >
            <Text style={styles.label}>Milk Liter (L)</Text>
            <TextInput

              value={liter}
              onChangeText={(text) => {
                const clean = text.replace(/[^0-9.]/g, '');
                onLiterChange(clean);
                setErrors((e) => ({ ...e, liter: null }));
              }}
              keyboardType="numeric"
              style={[
                styles.input,
                errors.liter && styles.inputError,
              ]}
            />
            {errors.liter && <Text style={styles.errorText}>{errors.liter}</Text>}
          </View>
          {/* Rate + Amount */}
          <View style={{ marginTop: 10 }}>
            <Text style={styles.info}>Rate: ₹ {rate}</Text>
            <Text style={styles.info}>Amount: ₹ {amount}</Text>
          </View>

          {/* Save Button */}
          <TouchableOpacity
            activeOpacity={0.7}
            accessibilityLabel='button'
            accessibilityLanguage='English'
            accessibilityHint='Press to save entry'
            style={styles.saveBtn} onPress={onSave}>
            <Text style={styles.saveBtnText}>Save Entry</Text>
          </TouchableOpacity>

        </View>
      </ScrollView>
    </SafeAreaView>
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
    padding: 16,
    borderRadius: 12,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
  },

  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 6,
    marginTop: 10,
  },

  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#fff",
    marginBottom: 10,
  },

  inputText: {
    fontSize: 16,
  },

  pickerBox: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginBottom: 10,

  },

  picker: {
    // height: 45,
  },

  info: {
    fontSize: 16,
    marginVertical: 2,
    fontWeight: "500",
  },

  saveBtn: {
    backgroundColor: "#0b8f3b",
    padding: 14,
    borderRadius: 10,
    marginTop: 20,
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
    marginBottom: 8,
  },

});

export default MilkEntryScreen;
