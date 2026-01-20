
import React, { useEffect, useState, useRef, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { TrueSheet } from "@lodev09/react-native-true-sheet"
import Slider from '@react-native-community/slider';
// import { Picker } from '@react-native-picker/picker';
import DateTimePicker from "@react-native-community/datetimepicker";
import { Dropdown } from 'react-native-element-dropdown';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Responsive } from '../theme/responsive';
import { useSelector } from 'react-redux';

type Props = {
    isVisible: boolean;
    onClose: () => void;
    cities: string[];
    milkTypes: string[];
    // city: string | null;
    milkType: string | null;
    maxRate: number;
    date: string | null;
    customerId: number | null,
    // time: string | null;
    timePeriod: string | null;
    // setCity: (v: string | null) => void;
    setMilkType: (v: string | null) => void;
    setMaxRate: (v: number) => void;
    setDate: (v: string | null) => void;
    setCustomerId: (v: string | null) => void;
    // setTime: (v: string | null) => void;
    setTimePeriod: (v: string | null) => void;
    applyFilters: () => void;
    resetFilters: () => void;
    sheet: any;

};

const MilkFilterBottomSheet: React.FC<Props> = ({
    isVisible,
    onClose,
    cities,
    milkTypes,
    // city,
    milkType,
    maxRate,
    date,
    customerId,
    // time,
    timePeriod,
    // setCity,
    setMilkType,
    setMaxRate,
    setDate,
    setCustomerId,
    // setTime,
    setTimePeriod,
    applyFilters,
    resetFilters,
    sheet,

}) => {
    const { customersList } = useSelector(state => state.customer);
    const [showFromPicker, setShowFromPicker] = useState<boolean>(false);
    const [showToPicker, setShowToPicker] = useState<boolean>(false);
    console.log('customers list', customersList);

    const [tempMilkType, setTempMilkType] = useState<string | null>(null);
    const [tempMaxRate, setTempMaxRate] = useState(100);
    const [tempCustomerId, setTempCustomerId] = useState<string | null>(null);
    console.log(tempCustomerId);

    const [singleDate, setSingleDate] = useState<string | null>(null);
    const [fromDate, setFromDate] = useState<string | null>(null);
    const [toDate, setToDate] = useState<string | null>(null);
    const now = new Date();

    const [tempTimePeriod, setTempTimePeriod] = useState<string | null>(now.getHours() < 12 ? 'Morning' : 'Evening');
    const timePeriodOptions = [
        { label: 'Morning', value: 'Morning' },
        { label: 'Evening', value: 'Evening' },
        { label: 'All Time', value: '' },
    ];
    //Truesheet


    // const customerOptions = useMemo(() => {
    //     const seen = new Set<number>();

    //     return milkList
    //         .filter(item => {
    //             if (seen.has(item.customer_id)) return false;
    //             seen.add(item.customer_id);
    //             return true;
    //         })
    //         .map(item => ({
    //             label: `${item.name} (${item.customer_code})`,
    //             value: item.customer_id, //  customer id stored
    //         }));
    // }, [milkList]);
    // console.log('Cusotmer option', customerOptions);
    const customerOptions = useMemo(() => {
        return customersList.map(c => ({
            label: `${c.name} (${c.customer_code})`,
            value: c.id,
        }));
    }, [customersList]);

    const formatDate = (d: Date): string =>
        `${String(d.getDate()).padStart(2, '0')}-${String(
            d.getMonth() + 1
        ).padStart(2, '0')}-${d.getFullYear()}`;

    const today = formatDate(now);
    const parseDate = (dateStr: string): Date => {
        const [dd, mm, yyyy] = dateStr.split('-');
        return new Date(Number(yyyy), Number(mm) - 1, Number(dd));
    };

    useEffect(() => {
        if (!isVisible) return;

        setTempMilkType(milkType);
        setTempMaxRate(maxRate);
        setTempTimePeriod(
            timePeriod ?? (new Date().getHours() < 12 ? 'Morning' : 'Evening')
        );

        // restore date filter
        if (date?.includes('|')) {
            const [from, to] = date.split('|');
            setFromDate(from);
            setToDate(to);
            setSingleDate(null);
        } else {
            setSingleDate(date);
            setFromDate(null);
            setToDate(null);
        }
    }, [isVisible, milkType, maxRate, date, timePeriod]);

    const handleApply = () => {
        setMilkType(tempMilkType);
        setMaxRate(tempMaxRate);
        setTimePeriod(tempTimePeriod);

        // AUTO-DETECT MODE
        if (fromDate && toDate) {
            setDate(`${fromDate}|${toDate}`);
        } else if (singleDate) {
            setDate(singleDate);
        } else {
            setDate(null);
        }
        setCustomerId(tempCustomerId);
        applyFilters();
    };

    const handleReset = () => {
        // setTempCity(null);
        setTempMilkType(null);
        setTempMaxRate(0);
        // setTempDate(new Date());
        // setTempTime(new Date());
        // setCustomerId(null)
        setTempTimePeriod(null);
        setSingleDate(null);
        setFromDate(null);
        setToDate(null);
        setTempCustomerId(null)

        resetFilters();
    };

    return (
        <>
            <TrueSheet
                ref={sheet}
                detents={['auto', 1]}
                backgroundBlur="dark"
                blurOptions={{
                    intensity: 8,
                    interaction: false,
                }}

                cornerRadius={Responsive.radius[24]}
                accessibilityViewIsModal={true}
            >

                <View style={styles.container}>
                    <View style={styles.grabber}
                        importantForAccessibility="no-hide-descendants"
                    />
                    <Text style={styles.title} accessibilityRole="header">Filter Milk Entries</Text>

                    <Text style={styles.section}>Milk Type</Text>
                    <View style={styles.row} accessibilityRole="radiogroup" accessibilityLabel="Filter by milk type">
                        {milkTypes.map(m => (
                            <TouchableOpacity
                                key={m}
                                style={[styles.option, tempMilkType === m && styles.active]}
                                onPress={() => setTempMilkType(m)}
                                accessibilityRole="radio"
                                accessibilityState={{ checked: tempMilkType === m }}
                                accessibilityLabel={m.toUpperCase()}
                            >
                                <Text >{m.toUpperCase()}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <Text style={styles.section}>Select Date</Text>
                    <View style={styles.datePickerContainer}>
                        {/* FROM DATE */}
                        <Text style={styles.section} nativeID="fromLabel">From:</Text>
                        <TouchableOpacity
                            style={styles.input}
                            onPress={() => setShowFromPicker(true)}
                            accessibilityLabelledBy="fromLabel"
                            accessibilityLabel={`From date: ${fromDate ?? today}`}
                            accessibilityHint="Double tap to open calendar"
                        >
                            <Icon name='calendar-month' size={Responsive.fontSize[20]} color='#000' importantForAccessibility="no-hide-descendants" />
                            <Text>
                                {fromDate ?? today}
                            </Text>
                        </TouchableOpacity>

                        {showFromPicker && (
                            <DateTimePicker
                                value={fromDate ? parseDate(fromDate) : new Date()}
                                mode="date"
                                onChange={(_, d) => {
                                    setShowFromPicker(false);
                                    if (!d) return;

                                    const dateStr = formatDate(d);
                                    setFromDate(dateStr);
                                    setSingleDate(dateStr);

                                    if (toDate && parseDate(dateStr) > parseDate(toDate)) {
                                        setToDate(null);
                                    }
                                }}

                            />
                        )}

                        {/* TO DATE */}
                        <Text style={styles.section} nativeID="toLabel">To:</Text>
                        <TouchableOpacity
                            style={[
                                styles.input,
                                // !fromDate && styles.disabled
                            ]}
                            disabled={!fromDate}
                            onPress={() => setShowToPicker(true)}
                            accessibilityLabelledBy="toLabel"
                            accessibilityLabel={`To date: ${toDate ?? 'Not set'}`}
                            accessibilityState={{ disabled: !fromDate }}
                            accessibilityHint={fromDate ? "Double tap to open calendar" : "Select a 'From' date first"}
                        >
                            <Icon name='calendar-month' size={Responsive.fontSize[20]} color='#000' importantForAccessibility="no-hide-descendants" />
                            <Text>
                                {toDate ?? (fromDate ? 'dd-mm-yyyy' : '-- -- -- --')}
                            </Text>
                        </TouchableOpacity>

                        {showToPicker && fromDate && (
                            <DateTimePicker
                                value={toDate ? parseDate(toDate) : parseDate(fromDate)}
                                minimumDate={parseDate(fromDate)}
                                mode="date"
                                onChange={(_, d) => {
                                    setShowToPicker(false);
                                    if (!d) return;
                                    const dateStr = formatDate(d);
                                    setToDate(dateStr);
                                    setSingleDate(null);
                                }}

                            />
                        )}
                    </View>
                    <Text style={styles.section}>Filter By Customer</Text>
                    <View style={styles.pickerBox} accessibilityLabel="Customer filter">
                        <Dropdown
                            style={styles.dropdown}
                            placeholderStyle={styles.placeholder}
                            selectedTextStyle={styles.selectedText}
                            inputSearchStyle={styles.searchInput}
                            iconStyle={styles.icon}
                            data={customerOptions}
                            // search
                            // maxHeight={300}
                            // disable={customersList.length === 0}
                            labelField="label"
                            valueField="value"
                            placeholder="-- Select Customer --"
                            searchPlaceholder="Search by name or code..."
                            value={tempCustomerId}
                            onChange={item => {
                                setTempCustomerId(item.value);
                            }}
                            containerStyle={[
                                styles.listContainer,

                            ]}
                            renderLeftIcon={() => (
                                <AntDesign
                                    name="user"
                                    size={18}
                                    color="#555"
                                    style={{ marginHorizontal: Responsive.spacing[6] }}
                                />
                            )}
                        // accessibilityLabel="Select customer to filter"
                        />
                    </View>

                    <Text style={styles.section}>Time Period</Text>
                    <View style={styles.pickerBox} accessibilityLabel="Time period filter">

                        <Dropdown
                            style={styles.dropdown}
                            data={timePeriodOptions}
                            selectedTextStyle={styles.selectedText}
                            labelField="label"
                            valueField="value"
                            value={tempTimePeriod}
                            placeholder="Select Time Period"

                            onChange={item => {
                                setTempTimePeriod(item.value);

                            }}
                            containerStyle={[
                                styles.listContainer,

                            ]}
                            renderLeftIcon={() => (
                                <AntDesign

                                    name="clockcircleo"
                                    size={Responsive.fontSize[18]}
                                    color="#555"
                                    style={{ marginHorizontal: Responsive.spacing[6] }}
                                />
                            )}
                            accessibilityLabel="Select morning or evening"
                        />

                    </View>

                    <Text style={styles.section} accessibilityLiveRegion="polite">Max Rate: ₹{tempMaxRate}</Text>
                    <Slider
                        minimumValue={0}
                        maximumValue={100}
                        step={1}
                        value={tempMaxRate}
                        onValueChange={setTempMaxRate}
                        thumbTintColor='#4d85ecff'
                        minimumTrackTintColor={'#6fa8e0ff'}
                        maximumTrackTintColor={'#1f2c2cff'}
                        accessibilityLabel="Maximum rate filter slider"
                        accessibilityValue={{ now: tempMaxRate, min: 0, max: 100 }}
                    />

                    <View style={styles.actions}>
                        <TouchableOpacity
                            activeOpacity={0.7}
                            style={styles.reset} onPress={handleReset}
                            accessibilityRole="button"
                            accessibilityLabel="Clear all filters"
                        >
                            <Text>Clear</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            activeOpacity={0.7}
                            style={styles.apply} onPress={handleApply}
                            accessibilityRole="button"
                            accessibilityLabel="Apply selected filters"
                        >
                            <Text style={{ color: '#fff' }}>Apply</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </TrueSheet>

        </>
    );
};

export default MilkFilterBottomSheet;

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        paddingHorizontal: Responsive.size.wp(5),
        paddingTop: Responsive.size.hp(1.5),
        paddingBottom: Responsive.size.hp(4),
        borderTopLeftRadius: Responsive.radius[24],
        borderTopRightRadius: Responsive.radius[24],
    },
    grabber: {
        width: Responsive.size.wp(10),
        height: Responsive.size.hp(0.6),
        backgroundColor: '#E2E8F0',
        borderRadius: Responsive.radius[4],
        alignSelf: 'center',
        marginBottom: Responsive.size.hp(2),
    },
    title: {
        fontSize: Responsive.fontSize[18],
        fontWeight: '700',
        color: '#1A1C1E',
        marginBottom: Responsive.size.hp(1.5),
    },
    label: {
        fontSize: Responsive.fontSize[14],
        fontWeight: "600",
        color: '#444',
        marginBottom: Responsive.size.hp(0.8),
        marginTop: Responsive.size.hp(1),
    },
    section: {
        marginVertical: Responsive.size.hp(1.5),
        fontWeight: '600',
    },
    row: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: Responsive.size.hp(1),
    },
    option: {
        paddingVertical: Responsive.size.hp(1.2),
        paddingHorizontal: Responsive.size.wp(4),
        backgroundColor: '#f5f5f5',
        borderRadius: Responsive.radius[8],
        marginRight: Responsive.size.wp(2),
        marginBottom: Responsive.size.hp(1),
        borderWidth: 1,
        borderColor: '#eee',
    },
    active: {
        backgroundColor: '#F5F0F0',
        borderColor: '#b9a1a1',
    },
    input: {
        borderWidth: 1,
        borderColor: "#e2e8f0",
        paddingVertical: Responsive.size.hp(1.2),
        paddingHorizontal: Responsive.size.wp(3),
        borderRadius: Responsive.radius[8],
        backgroundColor: "#f8fafc",
        flexDirection: 'row',
        alignItems: 'center',
        gap: Responsive.size.wp(2),
        minHeight: Responsive.size.hp(5.5),
    },
    inputText: {
        fontSize: Responsive.fontSize[14],
        color: '#333',
    },
    pickerBox: {
        borderWidth: 1,
        borderColor: "#e2e8f0",
        borderRadius: Responsive.radius[8],
        marginBottom: Responsive.size.hp(1),
        backgroundColor: '#f8fafc',
    },
    dropdown: {
        height: Responsive.size.hp(5.5),
    },
    placeholder: {
        color: '#9E9E9E',
    },
    selectedText: {
        color: '#000',
        fontSize: Responsive.fontSize[13],
    },
    searchInput: {
        height: Responsive.size.hp(5),
        fontSize: Responsive.fontSize[13],
        backgroundColor: '#fff',
        borderRadius: Responsive.radius[8],
    },
    icon: {
        width: Responsive.spacing[20],
        height: Responsive.spacing[20],
    },
    datePickerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Responsive.size.wp(3),
    },
    actions: {
        flexDirection: 'row',
        marginTop: Responsive.size.hp(2.5),
        justifyContent: 'space-between',
    },
    reset: {
        flex: 1,
        paddingVertical: Responsive.size.hp(1.6),
        backgroundColor: '#f0f0f0',
        marginRight: Responsive.size.wp(3),
        borderRadius: Responsive.radius[10],
        alignItems: 'center',
        justifyContent: 'center',
    },
    apply: {
        flex: 1,
        paddingVertical: Responsive.size.hp(1.6),
        backgroundColor: '#b9a1a1',
        borderRadius: Responsive.radius[10],
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 3,
        shadowColor: '#b9a1a1',
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    listContainer: {
        borderRadius: Responsive.radius[8],
        backgroundColor: '#fff',
        elevation: 4,
    },
});