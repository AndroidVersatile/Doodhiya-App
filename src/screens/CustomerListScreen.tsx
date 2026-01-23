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

import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';
import { getCustomers, deleteCustomer, deleteAllMilkEntriesForCustomer } from '../db/database';
import BackHeader from '../components/BackHeader';
import { useDispatch, useSelector } from "react-redux";
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import CustomerCard from '../components/CustomerCard';
import CustomerFilterBottomSheet from '../components/CustomerFilterBottomSheet';
import { TrueSheet } from '@lodev09/react-native-true-sheet';
import { Responsive } from '../theme/responsive';
import { deleteCustomerThunk } from '../redux/slice/customersSlice';
const CustomerListScreen = () => {
  const { user } = useSelector((state) => state.auth);
  const uid = user?.uid;
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectionMode, setSelectionMode] = useState(false);
  const sheet = useRef<TrueSheet>(null)
  const navigation = useNavigation();

  const dispatch = useDispatch()
  const setCity = (city: string | null) => setFilters(f => ({ ...f, city }));
  const setMilkType = (milkType: string | null) => setFilters(f => ({ ...f, milkType }));
  const setMaxRate = (maxRate: number) => setFilters(f => ({ ...f, maxRate }));
  const cities = useMemo(() => ["Delhi", "Faridabad", "Bhilwara"], []);
  const milkTypes = useMemo(() => ["cow", "buffalo", "mixed"], []);
  const { fetchLoading: fetchCustomerLoading, customersList } = useSelector((state) => state.customer);
  const insets = useSafeAreaInsets();

  // const present = () => {
  //   Keyboard.dismiss();
  //   requestAnimationFrame(async () => {
  //     await sheet.current?.present()
  //   });

  // }

  // const dismiss = async () => {
  //   await sheet.current?.dismiss()

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
    city: null as string | null,
    milkType: null as string | null,
    maxRate: 100,
  });

  const onDelete = (id: string) => {
    Alert.alert('Confirm', 'Delete customer?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {

          dispatch(deleteCustomerThunk({ uid, customerId: id }))
        },
      },
    ]);
  };
  const onDeleteMultiple = async (ids: string[]) => {
    Alert.alert(
      'Confirm Delete',
      `Are you sure you want to delete the selected ${ids.length} customers?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            for (let i = 0; i < ids.length; i++) {
              await deleteCustomer(ids[i]);
              await deleteAllMilkEntriesForCustomer(ids[i]);
            }
            load();
          }

        },
      ]
    );
  }

  // const filtered = customersList.filter((c: any) => {
  //   const matchSearch = c.name.toLowerCase().includes(search.toLowerCase());
  //   const matchCity = filters.city ? c.city.toLowerCase() === filters.city.toLowerCase() : true;
  //   const matchMilk = filters.milkType ? c.milk_type === filters.milkType : true;
  //   const matchRate = c.rate <= filters.maxRate;
  //   return matchSearch && matchCity && matchMilk && matchRate;
  // });
  const filtered = customersList.filter((c: any) => {
    const searchText = search.toLowerCase().trim();

    const matchSearch =
      !searchText ||
      c.name?.toLowerCase().includes(searchText) ||
      c.customer_code?.toLowerCase().includes(searchText);

    const matchCity = filters.city
      ? c.city?.toLowerCase() === filters.city.toLowerCase()
      : true;

    const matchMilk = filters.milkType
      ? c.milk_type?.toLowerCase() === filters.milkType.toLowerCase()
      : true;

    const matchRate = filters.maxRate
      ? Number(c.rate) <= Number(filters.maxRate)
      : true;

    return matchSearch && matchCity && matchMilk && matchRate;
  });

  return (
    <View style={[styles.container, { paddingTop: insets.top + Responsive.spacing[10] }]} >
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />

      {!selectionMode && (
        <>
          <BackHeader title={'Customer Master'} bg={'#f4f4f4'} />

          <View
            style={styles.searchBar}
            accessibilityRole="search"
          >
            <Icon name="search" size={Responsive.fontSize[24]} color="#777" importantForAccessibility="no-hide-descendants" />
            <TextInput
              placeholder="Search customer..."
              value={search}
              onChangeText={setSearch}
              style={{ marginLeft: Responsive.spacing[8], fontSize: Responsive.fontSize[16], flex: 1 }}
              accessibilityLabel="Search customer"
              accessibilityHint="Filters the list as you type"
              placeholderTextColor={'#777'}
            />
            {search.length > 0 && (
              <TouchableOpacity
                onPress={() => setSearch('')}
                accessibilityLabel="Clear search"
                accessibilityRole="button"
              >
                <Feather name="x" size={Responsive.fontSize[24]} />
              </TouchableOpacity>
            )}

            <TouchableOpacity
              onPress={() => present()}
              accessibilityLabel="Open filters"
              accessibilityRole="button"
              accessibilityHint="Opens city and milk type filter options"
            >
              <Feather name="filter" size={Responsive.fontSize[24]} />
            </TouchableOpacity>
          </View>
          <View >
          </View>
        </>
      )}


      <CustomerCard
        onDelete={onDelete}
        customers={filtered}
        navigation={navigation}
        search={search}
        setSelectionMode={setSelectionMode}
        onDeleteMultiple={onDeleteMultiple}
      />


      {/* Floating Add Button */}
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => navigation.navigate('CustomerForm')}
        style={styles.floatBtn}
        accessibilityLabel="Add new customer"
        accessibilityRole="button"
      >
        <Icon name="add" size={Responsive.fontSize[32]} color="#fff" />
      </TouchableOpacity>

      <CustomerFilterBottomSheet
        isVisible={isFilterOpen}
        onClose={() => dismiss()}
        cities={cities}
        milkTypes={milkTypes}
        city={filters.city}
        setCity={setCity}
        milkType={filters.milkType}
        setMilkType={setMilkType}
        maxRate={filters.maxRate}
        setMaxRate={setMaxRate}
        applyFilters={() => dismiss()}
        resetFilters={() =>
          setFilters({ city: null, milkType: null, maxRate: 100 })
        }
        sheet={sheet}
      />
    </View>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
  },

  searchBar: {
    flexDirection: 'row',
    paddingVertical: Responsive.spacing[5],
    paddingHorizontal: Responsive.spacing[16],
    backgroundColor: '#fff',
    borderRadius: Responsive.radius[50],
    marginBottom: Responsive.spacing[16],
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: Responsive.radius[10],
    shadowOffset: { width: 0, height: 4 },
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: '#f0f0f0',
    width: Responsive.size.wp(92),
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Responsive.spacing[12],
  },

  title: {
    fontSize: Responsive.fontSize[24],
    fontWeight: '700',
    paddingHorizontal: Responsive.spacing[20],
    marginBottom: Responsive.spacing[16],
    color: '#1a1a1a',
  },

  floatBtn: {
    position: 'absolute',
    bottom: Responsive.size.hp(12),
    right: Responsive.spacing[20],
    backgroundColor: '#b9a1a1',
    width: Responsive.size.wp(15),
    height: Responsive.size.wp(15),
    borderRadius: Responsive.radius[40],
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#b9a1a1',
    shadowOpacity: 0.4,
    shadowRadius: Responsive.radius[6],
    shadowOffset: { width: 0, height: 4 },
    zIndex: 10,
  },
});
export default CustomerListScreen;