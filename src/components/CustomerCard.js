

import React, { useCallback, useRef, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
const CUSTOMER_COL_WIDTHS = {
  index: 30,
  name: 100,
  code: 80,
  city: 100,
  contact: 100,
  whatsapp: 100,
  milk: 80,
  rate: 60,
  action: 50,
};

const CustomerCard = ({ customers, navigation, onDelete, search }) => {
  const flatRef = useRef();
  console.log('Customers', customers);

  const renderHeader = useCallback(() => (
    <View style={[styles.row, styles.headerRow]}>
      <Text style={[styles.headerCell, { width: CUSTOMER_COL_WIDTHS.index }]}>#</Text>
      <Text style={[styles.headerCell, { width: CUSTOMER_COL_WIDTHS.name }]}>Name</Text>
      <Text style={[styles.headerCell, { width: CUSTOMER_COL_WIDTHS.code }]}>Code</Text>
      <Text style={[styles.headerCell, { width: CUSTOMER_COL_WIDTHS.city }]}>City</Text>
      <Text style={[styles.headerCell, { width: CUSTOMER_COL_WIDTHS.contact }]}>Contact</Text>
      <Text style={[styles.headerCell, { width: CUSTOMER_COL_WIDTHS.whatsapp }]}>WhatsApp</Text>
      <Text style={[styles.headerCell, { width: CUSTOMER_COL_WIDTHS.milk }]}>Milk</Text>
      <Text style={[styles.headerCell, { width: CUSTOMER_COL_WIDTHS.rate }]}>Rate</Text>
      <Text style={[styles.headerCell, { width: CUSTOMER_COL_WIDTHS.action }]}>Action</Text>
    </View>
  ), []);

  const renderItem = useCallback(({ item, index }) => (
    <TouchableOpacity
      style={styles.row}
      activeOpacity={0.7}
      onPress={() => navigation.navigate('CustomerForm', { id: item.id })}
    >
      <Text style={[styles.cell, { width: CUSTOMER_COL_WIDTHS.index }]}>
        {index + 1}
      </Text>

      <Text style={[styles.cell, { width: CUSTOMER_COL_WIDTHS.name }]}>
        {item.name}
      </Text>

      <Text style={[styles.cell, { width: CUSTOMER_COL_WIDTHS.code }]}>
        {item.customer_code}
      </Text>

      <Text style={[styles.cell, { width: CUSTOMER_COL_WIDTHS.city }]}>
        {item.city}
      </Text>

      <Text style={[styles.cell, { width: CUSTOMER_COL_WIDTHS.contact }]}>
        {item.contact_no}
      </Text>

      <Text style={[styles.cell, { width: CUSTOMER_COL_WIDTHS.whatsapp }]}>
        {item.whatsapp_no}
      </Text>

      <Text style={[styles.cell, { width: CUSTOMER_COL_WIDTHS.milk }]}>
        {item.milk_type}
      </Text>

      <Text style={[styles.cell, { width: CUSTOMER_COL_WIDTHS.rate }]}>
        ₹{item.rate}/L
      </Text>

      <TouchableOpacity
        style={[styles.cell, { width: CUSTOMER_COL_WIDTHS.action }]}
        onPress={() => onDelete(item.id)}
      >
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
            <Text style={{ fontSize: 20, color: '#777' }}>No matching customers found for {search}</Text>
          ) :
            <Text style={{ fontSize: 20, color: '#777' }}>Nothing to see here Add Some</Text>
        }
      </View>
    );
  }
  return (

    <SafeAreaView style={{ flex: 1, alignItems: 'center' }}>
      {
        customers.length === 0 ? <EmptyComponent /> :
          <ScrollView horizontal>
            <FlatList
              ref={flatRef}
              data={customers}
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

export default CustomerCard;
