// src/screens/CustomerListScreen.js
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    TextInput,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
    StyleSheet,
    StatusBar,
    Keyboard,
    BackHandler,
    Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';

import BackHeader from '../components/BackHeader';
import MilkCard from '../components/MilkCard';
import MilkFilterBottomSheet from '../components/MilkFilterBottomSheet';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { exportMilkListToExcel } from '../utitlies/ExportToExcel';
import { TrueSheet } from "@lodev09/react-native-true-sheet"
import { Responsive } from '../theme/responsive';
import { useDispatch, useSelector } from "react-redux";
import { removeMilk } from '../redux/slice/milkSlice';
const MilkListScreen = () => {
    const { milkList } = useSelector((state) => state.milk);
    const navigation = useNavigation();
    // console.log('Milk list', milkList);

    const [loading, setLoading] = useState(false);
    const [exportLoading, setExportLoading] = useState(false);
    const [search, setSearch] = useState('');
    const dispatch = useDispatch()
    const { user, error } = useSelector((state) => state.auth);
    const uid = user?.uid ?? null;
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const sheet = useRef<TrueSheet>(null);

    // // Present the sheet 
    // const present = () => {
    //     Keyboard.dismiss();
    //     requestAnimationFrame(async () => {
    //         await sheet.current?.present()
    //     });

    // }
    // // Dismiss the sheet 
    // const dismiss = async () => {
    //     await sheet.current?.dismiss()
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

    const [filters, setFilters] = useState({
        // city: null,
        milkType: null,
        maxRate: 0,
        date: null,
        // time: null,
        timePeriod: null,
        customerId: null
    });

    console.log('Filters', filters);


    const cities = ['Delhi', 'Faridabad', 'Bhilwara'];
    const milkTypes = ['cow', 'buffalo', 'mixed'];



    const parseDDMMYYYY = (dateStr: string): Date => {
        const [dd, mm, yyyy] = dateStr.split('-').map(Number);
        return new Date(yyyy, mm - 1, dd);
    };
    const isDateMatch = (entryDate: string, filterDate: string) => {
        if (!filterDate) return true;

        // range mode
        if (filterDate.includes('|')) {
            const [fromStr, toStr] = filterDate.split('|');

            const entry = parseDDMMYYYY(entryDate);
            const from = parseDDMMYYYY(fromStr);
            const to = parseDDMMYYYY(toStr);

            return entry >= from && entry <= to;
        }

        // single date
        return entryDate === filterDate;
    };

    const filtered = useMemo(() => {
        const searchParts = search
            ? search.toLowerCase().trim().split(/\s+/)
            : [];

        return milkList.filter((m: any) => {
            const name = m.name?.toLowerCase() ?? '';
            const customerName = m.customer_name?.toLowerCase() ?? '';
            const customerCode = m.customer_code?.toLowerCase() ?? '';

            if (
                searchParts.length &&
                !searchParts.every(part =>
                    name.includes(part) ||
                    customerName.includes(part) ||
                    customerCode.includes(part)
                )
            ) return false;

            if (filters.customerId && m.customerId !== filters.customerId) return false;
            if (filters.milkType && m.milk_type?.toLowerCase() !== filters.milkType.toLowerCase()) return false;
            if (filters.maxRate && m.rate > filters.maxRate) return false;
            if (!isDateMatch(m.date, filters.date)) return false;
            if (filters.timePeriod && m.time_period !== filters.timePeriod) return false;

            return true;
        });
    }, [milkList, search, filters]);

    const isFilterApplied = Boolean(
        filters.customerId ||
        filters.milkType ||
        filters.timePeriod ||
        filters.date ||
        (filters.maxRate && filters.maxRate > 0)
    );

    const isDisabled: boolean = loading || Boolean(filtered.length === 0);

    const calculateTotalLiter = () => {
        return filtered.reduce((total, entry) => total + (entry.milk_liter || 0), 0);
    };
    const calculateTotalAmount = () => {
        return filtered.reduce((total, accumulate) => total + (accumulate.amount || 0
        ), 0)
    }
    const onDelete = async (id: string) => {
        Alert.alert(
            "Confirm Delete",
            "Are you sure you want to delete this milk entry?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        dispatch(removeMilk({ uid, milkId: id }))
                    },
                },
            ]);
    };
    const handleExport = async () => {
        setExportLoading(true);
        try {
            await exportMilkListToExcel(filtered)
        } catch (error) {
            console.error(error);

        }
        finally {
            setExportLoading(false)
        }

    }
    return (

        <SafeAreaView style={styles.container}>
            <StatusBar barStyle={'dark-content'} backgroundColor={'#f8f9fa'} />

            {/* Using your custom BackHeader */}
            <BackHeader title={'Milk Entries'} bg={'#f8f9fa'} />

            <View style={styles.content}>
                {/* Search Bar - Modernized with better shadow */}
                <View style={styles.searchBar} accessibilityRole="search">
                    <Icon name="search" size={Responsive.fontSize[22]} color="#999" importantForAccessibility="no-hide-descendants" />
                    <TextInput
                        placeholder="Search entries by name or code"
                        placeholderTextColor="#999"
                        value={search}
                        onChangeText={setSearch}
                        style={styles.searchInput}
                        accessibilityLabel="Search milk entries"
                        accessibilityHint="Type customer name or customer code"
                        accessibilityValue={{ text: search }}
                    />
                    {search.length > 0 && (
                        <TouchableOpacity
                            activeOpacity={0.7}
                            onPress={() => setSearch('')}
                            accessibilityRole="button"
                            accessibilityLabel="Clear search"
                            accessibilityHint="Removes the search text"
                        >
                            <Feather name="x" size={Responsive.fontSize[20]} color="#777" importantForAccessibility="no-hide-descendants" />
                        </TouchableOpacity>
                    )}
                </View>

                {/* Stats Section - Redesigned as a cohesive Card */}
                <View
                    style={styles.statsContainer}
                    accessible={true}
                    accessibilityRole="summary"
                    accessibilityLiveRegion="polite"
                    accessibilityLabel={`Total amount ${calculateTotalAmount()} rupees. Total volume ${calculateTotalLiter()} liters.`}
                >
                    <View style={styles.statBox}>
                        <View style={[styles.iconCircle, { backgroundColor: '#E3F2FD' }]}>
                            <Icon name="currency-rupee" size={Responsive.fontSize[20]} color="#1976D2" importantForAccessibility="no-hide-descendants" />
                        </View>
                        <View>
                            <Text style={styles.statLabel}>Total Amount</Text>
                            <Text style={styles.statValue}>₹{calculateTotalAmount()}</Text>
                        </View>
                    </View>

                    <View style={styles.statDivider} />

                    <View style={styles.statBox}>
                        <View style={[styles.iconCircle, { backgroundColor: '#E8F5E9' }]}>
                            <Icon name="local-drink" size={Responsive.fontSize[20]} color="#4CAF50" importantForAccessibility="no-hide-descendants" />
                        </View>
                        <View>
                            <Text style={styles.statLabel}>Total Volume</Text>
                            <Text style={styles.statValue}>{calculateTotalLiter()} L</Text>
                        </View>
                    </View>
                </View>

                {/* Filter & Export Row */}
                <View style={styles.filterSaveContainer}>
                    <TouchableOpacity
                        disabled={loading}
                        activeOpacity={0.7}
                        style={[
                            styles.actionBtn,
                            isFilterApplied && styles.filterActiveBtn,
                            loading && styles.disabledBtn,
                        ]}
                        onPress={() => present()}
                        accessibilityRole="button"
                        accessibilityLabel={isFilterApplied ? 'Filters applied' : 'Open filters'}
                        accessibilityHint="Opens filter options for milk entries"
                        accessibilityState={{
                            disabled: loading,
                            selected: isFilterApplied,
                        }}

                    >
                        <Feather name="filter" size={Responsive.fontSize[18]} color={isFilterApplied ? '#4CAF50' : '#444'} />
                        <Text style={[styles.actionText, isFilterApplied && styles.filterActiveText]}>
                            {isFilterApplied ? 'Filtered' : 'Filter'}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        disabled={isDisabled || exportLoading}
                        activeOpacity={0.7}
                        style={[styles.actionBtn, isDisabled && styles.disabledBtn]}
                        onPress={handleExport}
                        accessibilityRole="button"
                        accessibilityLabel="Export milk entries"
                        accessibilityHint="Downloads milk entries as a file"
                        accessibilityState={{ disabled: isDisabled || exportLoading }}
                    >
                        {exportLoading ? (
                            <ActivityIndicator size={'small'} color={'#444'} />
                        ) : (
                            <>
                                <Feather name="download" size={Responsive.fontSize[18]} color="#444" />
                                <Text style={styles.actionText}>Export</Text>
                            </>
                        )}
                    </TouchableOpacity>
                </View>


                <MilkCard
                    milkentries={filtered}
                    navigation={navigation}
                    search={search}
                    onDelete={onDelete}
                    filters={filters}
                />

            </View>

            {/* Floating Action Button */}
            <TouchableOpacity
                activeOpacity={0.8}
                style={styles.floatBtn}
                onPress={() => navigation.navigate('MilkEntry')}
                accessibilityRole="button"
                accessibilityLabel="Add new milk entry"
                accessibilityHint="Opens form to add a new milk entry"
            >
                <Icon name="add" size={32} color="#fff" importantForAccessibility="no-hide-descendants" />
            </TouchableOpacity>
            <MilkFilterBottomSheet
                isVisible={isFilterOpen}
                onClose={() => dismiss()}
                cities={cities}
                milkTypes={milkTypes}
                {...filters}
                setMilkType={v => setFilters(f => ({ ...f, milkType: v }))}
                setMaxRate={v => setFilters(f => ({ ...f, maxRate: v }))}
                setDate={v => setFilters(f => ({ ...f, date: v }))}
                setTimePeriod={v => setFilters(f => ({ ...f, timePeriod: v }))}
                setCustomerId={v => setFilters(f => ({ ...f, customerId: v }))}
                applyFilters={() => dismiss()}
                resetFilters={() =>
                    setFilters({
                        milkType: null,
                        maxRate: 0,
                        date: null,
                        timePeriod: null,
                        customerId: null,
                    })
                }
                sheet={sheet}

            />
        </SafeAreaView>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    content: {
        flex: 1,
        paddingHorizontal: Responsive.size.wp(4),
    },
    searchBar: {
        flexDirection: 'row',
        paddingHorizontal: Responsive.size.wp(4),
        height: Responsive.size.hp(8),
        backgroundColor: '#fff',
        borderRadius: Responsive.radius[40],
        marginTop: Responsive.size.hp(1.5),
        marginBottom: Responsive.size.hp(2),
        alignItems: 'center',
        elevation: 4,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 5,
        borderWidth: 1,
        borderColor: '#efefef',
    },
    searchInput: {
        marginLeft: Responsive.spacing[8],
        fontSize: Responsive.fontSize[14],
        flex: 1,
        color: '#333',
    },
    statsContainer: {
        backgroundColor: '#fff',
        borderRadius: Responsive.radius[16],
        padding: Responsive.padding[12],
        flexDirection: 'row',
        alignItems: 'center',
        elevation: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        marginBottom: Responsive.size.hp(2),
    },
    statBox: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconCircle: {
        width: Responsive.spacing[34],
        height: Responsive.spacing[34],
        borderRadius: Responsive.radius[17],
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: Responsive.spacing[10],
    },
    statLabel: {
        fontSize: Responsive.fontSize[10],
        color: '#777',
        textTransform: 'uppercase',
        fontWeight: '600',
    },
    statValue: {
        fontSize: Responsive.fontSize[16],
        fontWeight: '700',
        color: '#333',
    },
    statDivider: {
        width: 1,
        height: '70%',
        backgroundColor: '#eee',
    },
    filterSaveContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: Responsive.size.hp(1.5),
    },
    actionBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: Responsive.size.hp(1.2),
        paddingHorizontal: Responsive.size.wp(4),
        borderRadius: Responsive.radius[10],
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#e0e0e0',
        width: Responsive.size.wp(44),
        elevation: 2,
    },
    actionText: {
        marginLeft: Responsive.spacing[8],
        fontWeight: '600',
        fontSize: Responsive.fontSize[13],
        color: '#444',
    },
    filterActiveBtn: {
        backgroundColor: '#F5F0F0',
        borderColor: '#b9a1a1',
    },
    filterActiveText: {
        color: '#b9a1a1',
    },
    disabledBtn: {
        opacity: 0.5,
    },
    loadingWrapper: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: Responsive.size.hp(1.5),
        color: '#666',
        fontSize: Responsive.fontSize[13],
    },
    floatBtn: {
        position: 'absolute',
        bottom: Responsive.size.hp(4),
        right: Responsive.size.wp(6),
        backgroundColor: '#b9a1a1',
        width: Responsive.spacing[60],
        height: Responsive.spacing[60],
        borderRadius: Responsive.radius[30],
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 8,
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 4 },
    },
});





export default MilkListScreen;