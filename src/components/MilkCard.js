
import React, { useCallback, useRef, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Responsive } from '../theme/responsive';
const COL_WIDTHS = {
    index: Responsive.size.wp(10),
    name: Responsive.size.wp(40),
    code: Responsive.size.wp(20),
    delivery_time: Responsive.size.wp(28),
    delivery_address: Responsive.size.wp(45),
    milk_liter: Responsive.size.wp(22),
    date: Responsive.size.wp(25),
    time_period: Responsive.size.wp(28),
    amount: Responsive.size.wp(22),
    milk_type: Responsive.size.wp(25),
    action: Responsive.size.wp(18),
};

const MilkCard = ({ milkentries, navigation, search, onDelete, filters, }) => {
    // console.log('Milk Entries', milkentries)
    const flatRef = useRef();
    const shouldShowDate = (index: number, data: any[]) => {
        if (index === 0) return true;
        return data[index].date !== data[index - 1].date;
    };

    // 1. Calculate the message directly during render (Derived State)
    const getEmptyMessage = () => {
        // Case A: Search is active
        if (search.length > 0) {
            return `No results found for "${search}"`;
        }

        // Case B: Filters are active
        const activeFilters = [];
        if (filters.milkType) activeFilters.push(filters.milkType);
        if (filters.timePeriod) activeFilters.push(filters.timePeriod);
        if (filters.timePeriod) activeFilters.push(filters.date ? `date: ${filters.date}` : 'Date not selected');
        if (filters.maxRate) activeFilters.push(`under: ₹${filters.maxRate}`);

        if (activeFilters.length > 0) {
            return `No entries found for: ${activeFilters.join(', ')}`;
        }

        // Case C: Pure empty state
        return "No milk entries recorded yet.";
    };

    const emptyMsg = getEmptyMessage();
    const renderHeader = useCallback(() => (
        <View style={styles.headerRow}
            accessible={true}
            accessibilityRole="header"
            accessibilityLabel="Milk entry table header"
        >
            <Text accessibilityRole="text" style={[styles.headerCell, { width: COL_WIDTHS.index }]}>#</Text>
            <Text accessibilityRole="text" style={[styles.headerCell, { width: COL_WIDTHS.name }]}>Customer</Text>
            <Text accessibilityRole="text" style={[styles.headerCell, { width: COL_WIDTHS.code }]}>Code</Text>
            <Text accessibilityRole="text" style={[styles.headerCell, { width: COL_WIDTHS.milk_liter }]}>Quantity</Text>
            <Text accessibilityRole="text" style={[styles.headerCell, { width: COL_WIDTHS.amount }]}>Total</Text>
            <Text accessibilityRole="text" style={[styles.headerCell, { width: COL_WIDTHS.time_period }]}>Session</Text>
            <Text accessibilityRole="text" style={[styles.headerCell, { width: COL_WIDTHS.date }]}>Date</Text>
            <Text accessibilityRole="text" style={[styles.headerCell, { width: COL_WIDTHS.delivery_time }]}>Time</Text>
            <Text accessibilityRole="text" style={[styles.headerCell, { width: COL_WIDTHS.milk_type }]}>Type</Text>
            <Text accessibilityRole="text" style={[styles.headerCell, { width: COL_WIDTHS.milk_type }]}>Rate</Text>
            <Text accessibilityRole="text" style={[styles.headerCell, { width: COL_WIDTHS.delivery_address }]}>Address</Text>
            <Text accessibilityRole="text" style={[styles.headerCell, { width: COL_WIDTHS.action, textAlign: 'center' }]}>Action</Text>
        </View>
    ), []);

    const renderItem = useCallback(({ item, index }) => {
        const isMorning = item.time_period?.toLowerCase().includes('morning');
        const showDate = shouldShowDate(index, milkentries);
        const rowSummary = `${item.name}, ${item.milk_liter} Liters, Total ${item.amount} Rupees, ${item.time_period} session on ${item.date}`;
        return (
            <>
                {showDate && (
                    <View style={styles.modernDateRow} accessible={true}
                        accessibilityRole="text"
                        accessibilityLabel={`Date ${item.date}`}>
                        <View style={styles.dateLine} />
                        <View style={styles.dateBadge}>
                            <Icon name='calendar-month' size={Responsive.fontSize[16]} color='#b9a1a1' />
                            <Text style={styles.modernDateText}>{item.date}</Text>
                        </View>
                        <View style={styles.dateLine} />
                    </View>
                )}
                <View
                    style={[styles.row, index % 2 === 0 ? styles.evenRow : styles.oddRow]}
                    accessible={true}
                    accessibilityLabel={rowSummary}
                >
                    <Text style={[styles.indexCell, { width: COL_WIDTHS.index - 5 }]}>{index + 1}</Text>

                    <View style={{ width: COL_WIDTHS.name }}>
                        <Text style={styles.nameText} numberOfLines={1}>{item.name}</Text>
                    </View>

                    <Text style={[styles.cell, { width: COL_WIDTHS.code }]}>{item.customer_code}</Text>

                    <Text style={[styles.quantityText, { width: COL_WIDTHS.milk_liter }]}>{item.milk_liter} L</Text>

                    <Text style={[styles.amountText, { width: COL_WIDTHS.amount }]}>₹{item.amount}</Text>

                    <View style={{ width: COL_WIDTHS.time_period }}>
                        <View style={[styles.sessionBadge, { backgroundColor: isMorning ? '#FFF9C4' : '#E8EAF6' }]}
                            accessible={true}
                            accessibilityLabel={`Session ${item.time_period}`}

                        >
                            <Icon name={isMorning ? "wb-sunny" : "nights-stay"} size={Responsive.fontSize[12]} color={isMorning ? "#FBC02D" : "#3F51B5"} />
                            <Text style={[styles.sessionText, { color: isMorning ? "#916F00" : "#283593" }]}>
                                {item.time_period}
                            </Text>
                        </View>
                    </View>

                    <Text style={[styles.cell, { width: COL_WIDTHS.date }]}>{item.date}</Text>
                    <Text style={[styles.cell, { width: COL_WIDTHS.delivery_time }]}>{item.delivery_time}</Text>

                    <Text style={[styles.cell, { width: COL_WIDTHS.milk_type }]}>{item.milk_type}</Text>
                    <Text style={[styles.cell, { width: COL_WIDTHS.milk_type }]}>{item.rate}</Text>

                    <Text
                        accessibilityLabel={`Address ${item.delivery_address}`}
                        style={[styles.cell, { width: COL_WIDTHS.delivery_address }]} numberOfLines={2}>
                        {item.delivery_address}
                    </Text>

                    <View style={[styles.actionContainer, { width: COL_WIDTHS.action }]}>
                        <TouchableOpacity
                            style={[styles.deleteButton, { backgroundColor: '#E3F2FD', }]}
                            onPress={() => navigation.navigate('MilkEntry', { item })}
                            accessibilityLabel={`Edit entry for ${item.name}`}
                            accessibilityRole="button"

                        >
                            <Icon name="edit-square" size={20} color="#1976D2" />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.deleteButton}
                            onPress={() => onDelete(item.id)}
                            accessibilityLabel={`Delete entry for ${item.name}`}
                            accessibilityRole="button"
                        >
                            <Icon name="delete-outline" size={Responsive.fontSize[20]} color="#FF5252" />
                        </TouchableOpacity>
                    </View>
                </View>
            </>
        );
    }, [onDelete, milkentries]);

    const EmptyComponent = () => (
        <View style={styles.emptyContainer}
            accessible={true}
            accessibilityRole="text"
            accessibilityLabel={emptyMsg}
        >
            <Icon name="inventory" size={Responsive.fontSize[60]} color="#DDD" />
            <Text style={styles.emptyText}>
                {emptyMsg}
            </Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            {milkentries.length === 0 ? <EmptyComponent /> : (
                <ScrollView horizontal showsHorizontalScrollIndicator={false}
                    accessibilityRole="scrollbar"
                    accessibilityLabel="Milk entry table"
                >
                    <FlatList
                        ref={flatRef}
                        data={milkentries}
                        keyExtractor={(item) => item.id.toString()}
                        ListHeaderComponent={renderHeader}
                        stickyHeaderIndices={[0]}
                        renderItem={renderItem}
                        contentContainerStyle={styles.listPadding}
                    />
                </ScrollView>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    listPadding: {
        paddingBottom: Responsive.size.hp(3),
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        paddingVertical: Responsive.size.hp(1.8),
        paddingHorizontal: Responsive.size.wp(3),
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        borderRadius: Responsive.radius[12],
    },
    headerCell: {
        fontSize: Responsive.fontSize[10],
        fontWeight: '800',
        color: '#757575',
        letterSpacing: 1,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: Responsive.spacing[10],
        paddingHorizontal: Responsive.spacing[12],
        marginHorizontal: Responsive.spacing[8],
        marginTop: Responsive.spacing[4],
        borderRadius: Responsive.radius[10],
        borderColor: '#ccc',
        borderWidth: 0.5
    },
    evenRow: {
        backgroundColor: '#FFFFFF'
    },
    oddRow: {
        backgroundColor: '#F9FAFB'
    },
    indexCell: {
        fontSize: Responsive.fontSize[12],
        color: '#BDBDBD',
        fontWeight: '600',
    },
    nameText: {
        fontSize: Responsive.fontSize[12],
        fontWeight: '700',
        color: '#263238',
    },
    quantityText: {
        fontSize: Responsive.fontSize[12],
        fontWeight: '600',
        color: '#455A64',
    },
    amountText: {
        fontSize: Responsive.fontSize[12],
        fontWeight: '800',
        color: '#2E7D32',
    },
    sessionBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        paddingVertical: Responsive.size.hp(0.5),
        paddingHorizontal: Responsive.size.wp(2),
        borderRadius: Responsive.radius[20],
        gap: Responsive.size.wp(1),
    },
    sessionText: {
        fontSize: Responsive.fontSize[9],
        fontWeight: '700',
        textTransform: 'uppercase',
    },
    cell: {
        fontSize: Responsive.fontSize[12],
        color: '#616161',
    },
    actionContainer: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        gap: Responsive.size.wp(2)
    },
    deleteButton: {
        backgroundColor: '#FFEBEE',
        padding: Responsive.padding[8],
        borderRadius: Responsive.radius[8],
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: Responsive.size.hp(8),
        backgroundColor: '#f8f9fa',
    },
    emptyText: {
        marginTop: Responsive.size.hp(1.5),
        fontSize: Responsive.fontSize[14],
        color: '#9E9E9E',
    },
    modernDateRow: {
        flexDirection: 'row',
        paddingVertical: Responsive.size.hp(1.2),
        paddingHorizontal: Responsive.size.wp(4),
        backgroundColor: '#f4f4f4',
    },
    dateBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingHorizontal: Responsive.size.wp(3.5),
        paddingVertical: Responsive.size.hp(0.8),
        borderRadius: Responsive.radius[20],
        borderWidth: 1,
        borderColor: '#eee',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    modernDateText: {
        fontSize: Responsive.fontSize[12],
        fontWeight: '700',
        color: '#444',
        marginLeft: Responsive.spacing[6],
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
});
export default MilkCard;