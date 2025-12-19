import React, { useCallback, useRef, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
const COL_WIDTHS = {
    index: 30,
    name: 100,
    code: 80,
    delivery_time: 100,
    delivery_address: 100,
    milk_liter: 100,
    date: 100,
    time_period: 60,
    amount: 60,
    milk_type: 80,
    action: 50,
};

const MilkCard = ({ milkentries, navigation, search }) => {
    const flatRef = useRef();
    console.log('Milk Entries', milkentries)
   const renderHeader = useCallback(() => (
  <View style={[styles.row, styles.headerRow]}>
    <Text style={[styles.headerCell, { width: COL_WIDTHS.index }]}>#</Text>
    <Text style={[styles.headerCell, { width: COL_WIDTHS.name }]}>Name</Text>
    <Text style={[styles.headerCell, { width: COL_WIDTHS.code }]}>Code</Text>
    <Text style={[styles.headerCell, { width: COL_WIDTHS.delivery_time }]}>Delivery Time</Text>
    <Text style={[styles.headerCell, { width: COL_WIDTHS.delivery_address }]}>Delivery Address</Text>
    <Text style={[styles.headerCell, { width: COL_WIDTHS.milk_liter }]}>Milk Liter</Text>
    <Text style={[styles.headerCell, { width: COL_WIDTHS.date }]}>Date</Text>
    <Text style={[styles.headerCell, { width: COL_WIDTHS.time_period }]}>Time Period</Text>
    <Text style={[styles.headerCell, { width: COL_WIDTHS.amount }]}>₹ Total</Text>
    <Text style={[styles.headerCell, { width: COL_WIDTHS.milk_type }]}>Milk Type</Text>
    <Text style={[styles.headerCell, { width: COL_WIDTHS.action }]}>Action</Text>
  </View>
), []);


    const renderItem = useCallback(({ item, index }) => (
  <TouchableOpacity style={styles.row} activeOpacity={0.7}>
    <Text style={[styles.cell, { width: COL_WIDTHS.index }]}>{index + 1}</Text>
    <Text style={[styles.cell, { width: COL_WIDTHS.name }]}>{item.name}</Text>
    <Text style={[styles.cell, { width: COL_WIDTHS.code }]}>{item.customer_code}</Text>
    <Text style={[styles.cell, { width: COL_WIDTHS.delivery_time }]}>{item.delivery_time}</Text>
    <Text style={[styles.cell, { width: COL_WIDTHS.delivery_address }]}>{item.delivery_address}</Text>
    <Text style={[styles.cell, { width: COL_WIDTHS.milk_liter }]}>{item.milk_liter}L</Text>
    <Text style={[styles.cell, { width: COL_WIDTHS.date }]}>{item.date}</Text>
    <Text style={[styles.cell, { width: COL_WIDTHS.time_period }]}>{item.time_period}</Text>
    <Text style={[styles.cell, { width: COL_WIDTHS.amount }]}>{item.amount}</Text>
    <Text style={[styles.cell, { width: COL_WIDTHS.milk_type }]}>{item.milk_type}</Text>

    <TouchableOpacity style={[styles.cell, { width: COL_WIDTHS.action }]}>
      <Icon name="delete" size={20} color="red" />
    </TouchableOpacity>
  </TouchableOpacity>
), []);

    const EmptyComponent = () => {
        return (
            <View
                style={{ flex: 1, justifyContent: 'center', marginTop: 50, padding: 15 }}
            >
                {
                    search.length > 0 ? (
                        <Text style={{ fontSize: 20, color: '#777' }}>Not found {search}</Text>
                    ) :
                        <Text style={{ fontSize: 20, color: '#777' }}>Nothing to see here Add Some</Text>
                }


            </View>
        );
    }
    return (

        <SafeAreaView style={{ flex: 1,alignItems: 'center' }}>
            {
                milkentries.length === 0 ? <EmptyComponent /> :
                    <ScrollView horizontal>
                        <FlatList
                            ref={flatRef}
                            data={milkentries}
                            keyExtractor={(item) => item.id.toString()}
                            ListHeaderComponent={renderHeader}
                            stickyHeaderIndices={[0]}
                            renderItem={renderItem}
                            contentContainerStyle={{ padding: 8 }}

                        />

                    </ScrollView>

            }

        </SafeAreaView>

    );
};

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 0.5,
        borderBottomColor: '#ccc',
        backgroundColor: '#fff',
        padding: 10,
        margin: 4,
        borderRadius: 10,
        borderColor: '#ccc',
        borderWidth: 0.5

    },
    headerRow: {
        backgroundColor: '#e9e4e4ff',
        borderBottomWidth: 1,
    },
    cell: {
        fontSize: 14,
        color: '#222',
        paddingHorizontal: 4,
    },
    headerCell: {
        fontSize: 12,
        fontWeight: '700',
        color: '#333',
        paddingHorizontal: 4,
    },
});

export default MilkCard;
