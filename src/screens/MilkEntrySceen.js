
import React, { use, useEffect, useRef, useState } from "react";
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
  Vibration,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import AntDesign from 'react-native-vector-icons/AntDesign';
import { Dropdown } from 'react-native-element-dropdown';
import { getCustomers, addMilkEntry, getCustomerById, getMilkEntryById, updateMilkEntryById } from '../db/database';
import BackHeader from "../components/BackHeader";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { Responsive } from "../theme/responsive";
import { createMilk, editMilk } from "../redux/slice/milkSlice";
const formatDate = (d = new Date()) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${day}-${m}-${y}`;
};

const MilkEntryScreen = ({ route, navigation }) => {
  const insets = useSafeAreaInsets()
  const editingId = route.params?.item.id ?? null;
  const { user } = useSelector((state) => state.auth);
  const { customersList } = useSelector((state) => state.customer);
  const { addMilkLoading, updateMilkLoading } = useSelector((state) => state.milk);

  const uid = user?.uid;

  const isLoading = Boolean(addMilkLoading || updateMilkLoading);
  const [customers, setCustomers] = useState([]);
  const [customerId, setCustomerId] = useState(null);
  const [dateObj, setDateObj] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [timeObj, setTimeObj] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [customerName, setCustomerName] = useState('')
  const [customerCode, setCustomerCode] = useState('')
  const now = new Date();
  const [timePeriod, setTimePeriod] = useState(now.getHours() < 12 ? 'Morning' : 'Evening');
  const [liter, setLiter] = useState("1");
  const [rate, setRate] = useState(0);
  const [amount, setAmount] = useState(0);
  const [errors, setErrors] = useState({});
  const [milkType, setMilkType] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('')
  const dispatch = useDispatch()
  const scrollRef = useRef(null);
  const fieldPositions = useRef({});
  const literInputRef = useRef(null);
  const isEditing = Boolean(editingId);
  const customerOptions = customersList.map(c => ({
    label: `${c.name} (${c.customer_code})`,
    value: c.id,
  }));
  const timePeriodOptions = [
    { label: 'Morning', value: 'Morning' },
    { label: 'Evening', value: 'Evening' },
  ];
  useEffect(() => {
    (async () => {
      if (editingId && route.params?.item) {
        const m = route.params?.item;
        try {
          if (m) {
            setCustomerId(m.customerId);
            setCustomerName(m.name);
            setCustomerCode(m.customer_code);
            const [day, month, year] = m.date.split('-');
            setDateObj(new Date(year, month - 1, day));
            setTimePeriod(m.time_period);
            const [period, time] = m.delivery_time.split(' ');
            let [hours, minutes] = time.split(':').map(Number);
            if (period === 'PM' && hours < 12) hours += 12;
            setTimeObj(new Date(0, 0, 0, hours, minutes));
            setDeliveryAddress(m.delivery_address);
            setMilkType(m.milk_type);
            setLiter(m.milk_liter.toString());
            setRate(m.rate);
            setAmount(m.amount);
          }
        } catch (error) {
          Alert.alert("Error", "Failed to load milk entry data.");
        }
      }
    })();
  }, [editingId, route.params?.item]);

  const onCustomerChange = (id) => {
    setCustomerId(id);

    if (!id) {
      setRate(0);
      setMilkType('cow');
      setDeliveryAddress('');
      setAmount(0);
      return;
    }

    const customer = customersList.find(c => c.id === id);

    if (!customer) {
      setRate(0);
      return;
    }

    const rate = Number(customer.rate || 0);
    const literValue = Number(liter || 0);
    setCustomerName(customer.name)
    setCustomerCode(customer.customer_code)
    setRate(rate);
    setMilkType(customer.milk_type ?? 'cow');
    setDeliveryAddress(
      `${customer.address ?? ''}, ${customer.city ?? ''}`.trim()
    );
    setAmount(Number((literValue * rate).toFixed(2)));

    // Auto focus liter input
    setTimeout(() => literInputRef.current?.focus(), 100);
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

  const onSave = async () => {
    let newErrors = {};

    if (!customerId) { newErrors.customerId = 'Please select a customer'; Vibration.vibrate(50); }
    if (!dateObj) { newErrors.date = 'Date is required'; Vibration.vibrate(50); }
    if (!timePeriod) { newErrors.timePeriod = 'Please select time period'; Vibration.vibrate(50); }
    if (!timeObj) { newErrors.time = 'Delivery time is required'; Vibration.vibrate(50); }
    if (!milkType) { newErrors.milkType = 'Milk Type is required'; Vibration.vibrate(50); }
    if (!liter || isNaN(liter) || Number(liter) <= 0) {
      newErrors.liter = 'Milk liter must be greater than 0';
      Vibration.vibrate(50);
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      scrollToField(Object.keys(newErrors)[0]);
      return;
    }

    if (!uid) return;

    setErrors({});

    const formattedDate = formatDate(dateObj);
    let hours = timeObj.getHours();
    const minutes = String(timeObj.getMinutes()).padStart(2, '0');
    const deliveryPeriod = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    const deliveryTime = `${deliveryPeriod} ${hours}:${minutes}`;

    const entry = {
      name: customerName,
      customer_code: customerCode,
      customerId: customerId,
      date: formattedDate,
      time_period: timePeriod,
      delivery_time: deliveryTime,
      delivery_address: deliveryAddress,
      milk_type: milkType,
      milk_liter: Number(liter),
      rate: Number(rate),
      amount: Number(amount),
      createdAt: new Date().toISOString(),
    };

    try {
      if (editingId) {
        await dispatch(
          editMilk({
            uid,
            milkId: editingId,
            updates: entry,
          })
        ).unwrap();
      } else {
        await dispatch(
          createMilk({
            uid,
            milk: entry,
          })
        ).unwrap();

        setLiter('');
        setAmount(0);
        setCustomerId(null);
      }

      navigation.goBack();
    } catch (err) {
      // Toast already handled in thunk
      console.log('Milk save failed:', err);
    }
  };

  const onTimeChange = (event, selected) => {
    setShowTimePicker(false);
    if (selected) {
      setTimeObj(selected);
      setTimePeriod(selected.getHours() < 12 ? 'Morning' : 'Evening');
    }
  };

  const onPeriodChange = (period) => {
    setTimePeriod(period);
    const newTime = new Date(timeObj);
    if (period === 'Morning') { newTime.setHours(9); } else { newTime.setHours(19); }
    const minutes = newTime.getMinutes();
    newTime.setMinutes(minutes);
    setTimeObj(newTime);
  };

  return (
    <View style={[styles.mainContainer, { paddingTop: insets.top + Responsive.spacing[10] }]} >
      <BackHeader title={editingId ? 'Edit Milk Entry' : 'New Milk Entry'} bg={'#f6f7fb'} />
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
        keyboardVerticalOffset={
          Platform.OS === 'android'
            ? (StatusBar.currentHeight ?? 0) + 56
            : 0
        }
      >
        <ScrollView
          contentContainerStyle={[styles.container, { paddingBottom: insets.bottom + Responsive.spacing[10] }]}
          keyboardShouldPersistTaps="handled"
          ref={scrollRef}
        >
          <Text style={styles.sectionHeader}>Customer & Schedule</Text>
          <View style={styles.card}>
            {/* Customer Dropdown */}
            <View onLayout={(e) => { fieldPositions.current.customerId = e.nativeEvent.layout.y; }}>
              <Text style={styles.label}>Select Customer</Text>
              <View style={[styles.pickerBox, errors.customerId && styles.inputError]} accessibilityLabel="Customer selection dropdown">
                <Dropdown
                  style={[
                    styles.dropdown,
                    isEditing && styles.dropdownDisabled,
                  ]}
                  placeholderStyle={styles.placeholder}
                  selectedTextStyle={styles.selectedText}
                  inputSearchStyle={styles.searchInput}
                  iconStyle={styles.icon}
                  data={customerOptions}
                  disable={isEditing}
                  search
                  maxHeight={300}
                  labelField="label"
                  valueField="value"
                  placeholder="-- Select Customer --"
                  searchPlaceholder="Search..."
                  value={customerId}
                  onChange={item => {
                    onCustomerChange(item.value);
                    setErrors(e => ({ ...e, customerId: null }));
                  }}
                  containerStyle={styles.listContainer}
                  renderLeftIcon={() => (
                    <AntDesign name="user" size={Responsive.fontSize[18]} color="#555" style={{ marginHorizontal: 6 }} importantForAccessibility="no-hide-descendants" />
                  )}
                />
              </View>
              {errors.customerId && <Text style={styles.errorText} accessibilityLiveRegion="assertive">{errors.customerId}</Text>}
              {isEditing && (
                <View style={styles.lockRow}>
                  <AntDesign name="lock" size={Responsive.fontSize[12]} color="#888" importantForAccessibility="no-hide-descendants" />
                  <Text style={styles.lockText}>Customer cannot be changed</Text>
                </View>
              )}
            </View>

            {/* Date Selection */}
            <View onLayout={(e) => { fieldPositions.current.date = e.nativeEvent.layout.y; }} style={{ marginTop: 10 }}>
              <Text style={styles.label} nativeID="dateLabel">Entry Date</Text>
              <TouchableOpacity
                activeOpacity={0.7}
                style={[styles.input, errors.date && styles.inputError]}
                onPress={() => setShowDatePicker(true)}
                accessibilityLabel={`Entry date: ${formatDate(dateObj)}`}
                accessibilityRole="button"
              >
                <Text style={styles.inputText}>{formatDate(dateObj)}</Text>
                <AntDesign name="calendar" size={Responsive.fontSize[18]} color="#555" importantForAccessibility="no-hide-descendants" />
              </TouchableOpacity>
              {errors.date && <Text style={styles.errorText} accessibilityLiveRegion="assertive">{errors.date}</Text>}
            </View>

            <View style={styles.row}>
              {/* Time Period */}
              <View style={{ flex: 1, marginRight: Responsive.spacing[8] }}>
                <Text style={styles.label}>Period</Text>
                <View style={[styles.pickerBox, errors.timePeriod && styles.inputError]}>
                  <Dropdown
                    style={styles.dropdown}
                    data={timePeriodOptions}
                    labelField="label"
                    valueField="value"
                    value={timePeriod}
                    onChange={item => onPeriodChange(item.value)}
                    containerStyle={styles.listContainer}
                  />
                </View>
              </View>

              {/* Delivery Time */}
              <View style={{ flex: 1, marginLeft: Responsive.spacing[8] }}>
                <Text style={styles.label}>Time</Text>
                <TouchableOpacity
                  activeOpacity={0.7}
                  style={[styles.input, errors.time && styles.inputError]}
                  onPress={() => setShowTimePicker(true)}
                  accessibilityRole="button"
                >
                  <Text style={styles.inputText}>
                    {timeObj.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" })}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <Text style={styles.sectionHeader}>Entry Details</Text>
          <View style={styles.card}>
            {/* Milk Type (Read Only usually) */}
            <View>
              <Text style={styles.label}>Milk Type</Text>
              <TextInput
                value={milkType}
                placeholderTextColor={'#000'}
                onChangeText={(text) => {
                  setMilkType(text);
                  setErrors((e) => ({ ...e, milkType: null }));
                }}
                style={[styles.input, errors.milkType && styles.inputError, milkType.length > 0 && { backgroundColor: '#f0f0f0' }]}
                editable={milkType.length === 0}
              />
              {errors.milkType && <Text style={styles.errorText}>{errors.milkType}</Text>}
            </View>

            {/* Milk Liter */}
            <View onLayout={(e) => { fieldPositions.current.liter = e.nativeEvent.layout.y; }} style={{ marginTop: Responsive.spacing[10] }}>
              <Text style={styles.label}>Milk Liter (L)</Text>
              <TextInput
                ref={literInputRef}
                value={liter}
                onFocus={() => setFocusedField('liter')}
                onBlur={() => setFocusedField(null)}
                onChangeText={(text) => {
                  const clean = text.replace(/[^0-9.]/g, '');
                  onLiterChange(clean);
                  setErrors((e) => ({ ...e, liter: null }));
                }}
                keyboardType="numeric"
                returnKeyType="done"
                // onSubmitEditing={onSave}
                placeholderTextColor={'#000'}
                style={[
                  styles.input,
                  focusedField === 'liter' && styles.inputFocused,
                  errors.liter && styles.inputError
                ]}
                accessibilityLabel="Milk quantity in liters"
                accessibilityHint="Enter milk quantity using numbers"
                accessibilityState={{ invalid: !!errors.liter }}
              />
              {errors.liter && <Text style={styles.errorText} accessibilityLiveRegion="assertive" accessibilityRole="alert">{errors.liter}</Text>}
            </View>

            {/* Calculations */}
            <View style={styles.amountCard} accessible={true}
              accessibilityRole="summary"
              accessibilityLabel={`Rate is ${rate} rupees. Total amount is ${amount} rupees.`}>
              <View style={styles.amountRow}>
                <Text style={styles.amountLabel}>Rate:</Text>
                <Text style={styles.amountValue}>₹ {rate}</Text>
              </View>
              <View style={[styles.amountRow, { marginTop: Responsive.spacing[5], paddingTop: Responsive.padding[5], borderTopWidth: 1, borderTopColor: '#eee' }]}>
                <Text style={styles.totalLabel}>Total Amount:</Text>
                <Text style={styles.totalValue}>₹ {amount}</Text>
              </View>
            </View>
          </View>

          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.saveBtn}
            onPress={onSave}
            disabled={isLoading}
            accessibilityRole="button"
            accessibilityLabel={editingId ? 'Update milk entry' : 'Save milk entry'}
            accessibilityHint="Saves the milk entry details"
            accessibilityState={{ disabled: isLoading }}
          >
            {
              isLoading ? <ActivityIndicator size="small" color="#fff" /> :
                <Text style={styles.saveBtnText}>{editingId ? 'Update Entry' : 'Save Entry'}</Text>
            }
          </TouchableOpacity>

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

          {showTimePicker && (
            <DateTimePicker
              value={timeObj}
              mode="time"
              is24Hour={false}
              onChange={onTimeChange}
            />
          )}
          <View style={{ height: Responsive.spacing[40] }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#f6f7fb"
  },
  container: {
    padding: Responsive.spacing[16],
    flexGrow: 1,
    paddingBottom: Responsive.spacing[40]
  },
  sectionHeader: {
    fontSize: Responsive.fontSize[12],
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
    shadowOpacity: 0.1,
    shadowRadius: Responsive.radius[5],
    shadowOffset: { width: 0, height: 2 }
  },
  row: {
    flexDirection: 'row',
    marginTop: Responsive.spacing[5],
    justifyContent: 'space-between'
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
    paddingVertical: Responsive.spacing[8],
    borderRadius: Responsive.radius[8],
    backgroundColor: "#f8fafc",
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: Responsive.spacing[24],
    color: '#000',
    height: Responsive.size.hp(5.5),

  },
  inputFocused: {
    borderColor: '#b9a1a1',
    backgroundColor: '#fff',
    borderWidth: 1.5
  },
  inputText: {
    fontSize: Responsive.fontSize[15],
    color: '#333'
  },
  pickerBox: {
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: Responsive.radius[8],
    backgroundColor: '#f8fafc',
    paddingHorizontal: Responsive.spacing[4],
    height: Responsive.size.hp(5.5),
    justifyContent: 'center',
    paddingVertical: Responsive.spacing[8],
  },
  dropdown: {
    height: Responsive.size.hp(6),
  },
  searchInput: {
    height: Responsive.size.hp(6), // enough for text & placeholder
    fontSize: Responsive.fontSize[14], // match other inputs
    borderRadius: Responsive.radius[8],
  },
  amountCard: {
    backgroundColor: '#E8F5E9',
    padding: Responsive.spacing[16],
    borderRadius: Responsive.radius[10],
    marginTop: Responsive.spacing[12],
    borderWidth: 1,
    borderColor: '#C8E6C9'
  },
  amountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: Responsive.spacing[1]
  },
  amountLabel: {
    fontSize: Responsive.fontSize[14],
    color: '#2E7D32'
  },
  amountValue: {
    fontSize: Responsive.fontSize[14],
    fontWeight: '700',
    color: '#2E7D32'
  },
  totalLabel: {
    fontSize: Responsive.fontSize[16],
    fontWeight: '700',
    color: '#1B5E20'
  },
  totalValue: {
    fontSize: Responsive.fontSize[18],
    fontWeight: '800',
    color: '#1B5E20'
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
    shadowOffset: { width: 0, height: 4 }
  },
  saveBtnText: {
    color: "#fff",
    fontSize: Responsive.fontSize[16],
    fontWeight: "700"
  },
  inputError: {
    borderColor: '#ff4d4d'
  },
  errorText: {
    color: '#ff4d4d',
    fontSize: Responsive.fontSize[12],
    marginTop: Responsive.spacing[4],
    marginBottom: Responsive.spacing[2]
  },
  placeholder: {
    color: '#a0aec0'
  },
  selectedText: {
    color: '#333',
    fontSize: Responsive.fontSize[14]
  },

  icon: {
    width: Responsive.size.wp(5),
    height: Responsive.size.wp(5)
  },
  listContainer: {
    borderRadius: Responsive.radius[10],
    backgroundColor: '#fff',
    elevation: 5
  },
  dropdownDisabled: {
    backgroundColor: '#f2f2f2',
    opacity: 0.7,
  },
  lockRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Responsive.spacing[4],
  },
  lockText: {
    marginLeft: Responsive.spacing[4],
    fontSize: Responsive.fontSize[11],
    color: '#888',
  }

});

export default MilkEntryScreen;