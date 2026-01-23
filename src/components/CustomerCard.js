
import React, { useCallback, useRef, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ScrollView, Vibration, Alert, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useDispatch, useSelector } from 'react-redux';
import { Responsive } from '../theme/responsive';
import { fetchCustomers } from '../redux/slice/customersSlice';
// import { deleteAllMilkEntriesForCustomer, deleteCustomer, getCustomers } from '../db/database';
const CUSTOMER_COL_WIDTHS = {
  index: Responsive.size.wp(12),
  name: Responsive.size.wp(40),
  code: Responsive.size.wp(22),
  city: Responsive.size.wp(28),
  contact: Responsive.size.wp(32),
  whatsapp: Responsive.size.wp(32),
  milk: Responsive.size.wp(25),
  rate: Responsive.size.wp(22),
  action: Responsive.size.wp(20),
};

const CustomerCard = ({ customers, navigation, onDelete, search, setSelectionMode, onDeleteMultiple, }) => {
  const flatRef = useRef();
  const [selectionModeChild, setSelectionModeChild] = useState(false);
  const [selected, setSelected] = useState([]);
  const isRefreshing = useSelector((state) => state.customer.fetchLoading);
  const dispatch = useDispatch();
  const renderHeader = useCallback(() => (
    <View style={styles.headerRow}
      accessible={true}
      accessibilityRole="header"
      accessibilityLabel="Customer list table header"
    >
      <Text style={[styles.headerCell, { width: CUSTOMER_COL_WIDTHS.index }]}
        accessibilityLabel="Index number"
      >#</Text>
      <Text style={[styles.headerCell, { width: CUSTOMER_COL_WIDTHS.name }]}>CUSTOMER</Text>
      <Text style={[styles.headerCell, { width: CUSTOMER_COL_WIDTHS.code }]}>CODE</Text>
      <Text style={[styles.headerCell, { width: CUSTOMER_COL_WIDTHS.city }]}>CITY</Text>
      <Text style={[styles.headerCell, { width: CUSTOMER_COL_WIDTHS.contact }]}>CONTACT</Text>
      <Text style={[styles.headerCell, { width: CUSTOMER_COL_WIDTHS.whatsapp }]}>WHATSAPP</Text>
      <Text style={[styles.headerCell, { width: CUSTOMER_COL_WIDTHS.milk }]}>TYPE</Text>
      <Text style={[styles.headerCell, { width: CUSTOMER_COL_WIDTHS.rate }]}>RATE</Text>
      <Text style={[styles.headerCell, { width: CUSTOMER_COL_WIDTHS.action, textAlign: 'center' }]}>ACTION</Text>
    </View>
  ), []);
  const onPressSeletion = (id) => {
    setSelectionMode(true);
    setSelectionModeChild(true);
    setSelected([id]); // first selected item
  }
  const deselectAll = () => {
    setSelected([]);
    setSelectionMode(false);
    setSelectionModeChild(false);

  };
  const deleteSelected = () => {
    Vibration.vibrate(200); // strong warning vibration
    onDeleteMultiple(selected);
    setSelected([]);
    setSelectionMode(false);
    setSelectionModeChild(false);

  }

  const selectAll = () => {
    setSelected(customers.map((item) => item.id));
  };

  const toggleSelect = (id) => {
    if (!selectionModeChild) return;
    Vibration.vibrate(50); // light vibration
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };
  const onRefresh = useCallback(() => {
    dispatch(fetchCustomers());
  }, [dispatch]);
  const renderItem = useCallback(({ item, index }) => {
    const isMatched = search.length > 0 && item.name.toLowerCase().includes(search.toLowerCase());
    const isSelected = selected.includes(item.id);
    return (
      <TouchableOpacity
        style={[
          styles.row,
          isMatched && styles.matchedSearch,
          index % 2 === 0 ? styles.evenRow : styles.oddRow
        ]}
        activeOpacity={0.7}
        onPress={() => selectionModeChild && toggleSelect(item.id)}
        accessible={true}
        accessibilityHint={selectionModeChild ? "Tap to toggle selection" : "Double tap to view details"}
        accessibilityState={{ selected: isSelected }}
      // onLongPress={() => onPressSeletion(item.id)}
      >
        {
          selectionModeChild ? (
            <View style={[styles.checkbox, isSelected && styles.checkedBox]} importantForAccessibility="no-hide-descendants" >
              {isSelected && <Text style={styles.checkMark}>✓</Text>}
            </View >
          ) : <Text style={[styles.indexCell, { width: CUSTOMER_COL_WIDTHS.index - 10 }]}>{index + 1}</Text>
        }

        {/* <View style={}> */}
        <Text style={[styles.nameText, { width: CUSTOMER_COL_WIDTHS.name }]} numberOfLines={2} >{item.name}</Text>
        {/* </View> */}

        <Text style={[styles.cell, { width: CUSTOMER_COL_WIDTHS.code }]}>{item.customer_code}</Text>
        <Text style={[styles.cell, { width: CUSTOMER_COL_WIDTHS.city }]}>{item.city}</Text>
        <Text style={[styles.cell, { width: CUSTOMER_COL_WIDTHS.contact }]}>{item.contact_no}</Text>
        <Text style={[styles.cell, { width: CUSTOMER_COL_WIDTHS.whatsapp }]}>{item.whatsapp_no}</Text>

        <View style={[styles.badge, { width: CUSTOMER_COL_WIDTHS.milk - 10, backgroundColor: item.milk_type === 'Cow' ? '#E3F2FD' : '#F3E5F5' }]}>
          <Text style={[styles.badgeText, { color: item.milk_type === 'Cow' ? '#1976D2' : '#7B1FA2' }]}>
            {item.milk_type}
          </Text>
        </View>

        <Text style={[styles.rateText, { width: CUSTOMER_COL_WIDTHS.rate }]}>₹{item.rate}</Text>

        <View style={[styles.actionContainer, { width: CUSTOMER_COL_WIDTHS.action }]}>
          <TouchableOpacity
            style={[styles.deleteIconButton, { backgroundColor: '#E3F2FD', }]}
            onPress={() => navigation.navigate('CustomerForm', { item })}
            accessibilityLabel={`Edit ${item.name}`}
            accessibilityRole="button"
          >
            <Icon name="edit-square" size={20} color="#1976D2" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.deleteIconButton}
            onPress={() => onDelete(item.id)}
            accessibilityLabel={`Delete ${item.name}`}
            accessibilityRole="button"
          >
            <Icon name="delete-outline" size={20} color="#FF5252" importantForAccessibility="no-hide-descendants" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity >
    );
  }, [search, selected, selectionModeChild]);

  const EmptyComponent = () => (
    <View style={styles.emptyContainer} accessible={true}>
      <Icon name="person-search" size={Responsive.spacing[60]} color="#ccc" importantForAccessibility="no-hide-descendants" />
      <Text style={styles.emptyText}>
        {search.length > 0 ? `No matching customers for "${search}"` : "Your customer list is empty"}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {selectionModeChild && (
        <View style={styles.topBar} accessibilityRole="toolbar" accessibilityLabel="Selection options">>
          <TouchableOpacity
            onPress={deleteSelected}
            style={styles.topBtn}
            accessibilityRole="button"
            accessibilityLabel={`Delete ${selected.length} selected customers`}
          >
            <Text style={styles.topBtnText}>{selected.length > 1 ? `Delete ${selected.length}` : "Delete"}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={selectAll}
            style={styles.topBtn} accessibilityRole="button">
            <Text style={styles.topBtnText}>Select All</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={deselectAll} style={styles.topBtn} accessibilityRole="button">
            <Text style={styles.topBtnText}>Clear</Text>
          </TouchableOpacity>
        </View>
      )}
      {customers.length === 0 ? <EmptyComponent /> : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            flexGrow: 1,
            // backgroundColor: '#F4f4f4'
          }}
        >
          <FlatList
            ref={flatRef}
            data={customers}
            keyExtractor={(item) => item.id.toString()}
            ListHeaderComponent={renderHeader}
            stickyHeaderIndices={[0]}
            renderItem={renderItem}
            contentContainerStyle={styles.listPadding}
          // refreshControl={
          //   <RefreshControl
          //     refreshing={isRefreshing} // The boolean from Redux
          //     onRefresh={onRefresh}     // The dispatch function
          //     tintColor="#2196F3"
          //     colors={['#2196F3']}
          //   />
          // }
          />
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
    padding: Responsive.spacing[8],
  },

  listPadding: {
    paddingBottom: Responsive.spacing[24],
  },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: Responsive.spacing[12],
    paddingHorizontal: Responsive.spacing[12],
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: Responsive.radius[2],
    borderRadius: Responsive.radius[12],
  },

  headerCell: {
    fontSize: Responsive.fontSize[12],
    fontWeight: '800',
    color: '#9E9E9E',
    letterSpacing: 0.5,
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

  evenRow: { backgroundColor: '#FFFFFF' },
  oddRow: { backgroundColor: '#FAFAFA' },

  cell: {
    fontSize: Responsive.fontSize[14],
    color: '#444',
  },

  indexCell: {
    fontSize: Responsive.fontSize[13],
    color: '#9E9E9E',
    fontWeight: '600',
  },

  nameText: {
    fontSize: Responsive.fontSize[15],
    fontWeight: '600',
    color: '#1A1A1A',
  },

  rateText: {
    fontSize: Responsive.fontSize[14],
    fontWeight: '700',
    color: '#2E7D32',
  },

  badge: {
    paddingVertical: Responsive.spacing[4],
    paddingHorizontal: Responsive.spacing[8],
    borderRadius: Responsive.radius[8],
    alignItems: 'center',
    marginRight: Responsive.spacing[8],
  },

  badgeText: {
    fontSize: Responsive.fontSize[12],
    fontWeight: '700',
    textTransform: 'uppercase',
  },

  actionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Responsive.spacing[8],
  },

  deleteIconButton: {
    padding: Responsive.spacing[8],
    backgroundColor: '#FFF5F5',
    borderRadius: Responsive.radius[8],
  },

  /* Selection Mode */
  topBar: {
    flexDirection: 'row',
    marginBottom: Responsive.spacing[12],
    padding: Responsive.spacing[12],
    justifyContent: 'space-between',
  },

  topBtn: {
    backgroundColor: '#b9a1a1',
    paddingVertical: Responsive.spacing[6],
    paddingHorizontal: Responsive.spacing[16],
    borderRadius: Responsive.radius[10],
  },

  topBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: Responsive.fontSize[14],
  },

  checkbox: {
    width: Responsive.size.wp(6),
    height: Responsive.size.wp(6),
    borderRadius: Responsive.radius[6],
    borderWidth: 2,
    borderColor: '#777',
    marginRight: Responsive.spacing[10],
    justifyContent: 'center',
    alignItems: 'center',
  },

  checkedBox: {
    backgroundColor: '#b9a1a1',
    borderColor: '#b9a1a1',
  },

  checkMark: {
    color: '#fff',
    fontWeight: '700',
    fontSize: Responsive.fontSize[14],
  },

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Responsive.spacing[60],
    backgroundColor: '#f4f4f4',
  },

  emptyText: {
    fontSize: Responsive.fontSize[16],
    color: '#777',
    marginTop: Responsive.spacing[12],
  },
});

export default CustomerCard;