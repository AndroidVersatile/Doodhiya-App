// src/screens/CustomerListScreen.js
import React, { useEffect, useRef, useState } from 'react';
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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { getCustomers, deleteCustomer } from '../db/database';
import BackHeader from '../components/BackHeader';
import api from '../utitlies/api';
import { useNavigation } from '@react-navigation/native';
import CustomerCard from '../components/CustomerCard';



const CustomerListScreen = () => {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState(0);
  const flatRef = useRef();
  const navigation = useNavigation();
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', load);
    setLoading(true);
    const timer = setTimeout(() => {
      load();
      setLoading(false);
    }, 3000);
    return () => clearTimeout(timer), unsubscribe;
  }, [navigation]);
  // useEffect(() => {

  //   const fetchCustomers = async () => {
  //     setLoading(true);
  //     try {
  //       const res = await api.get('/customers');
  //       setCustomers(res.data)
  //     } catch (error) {
  //       console.log('Error', error);

  //     } finally {
  //       setLoading(false)
  //     }
  //   }
  //   const unsubscribe = navigation.addListener('focus', fetchCustomers);
  //   return unsubscribe;
  // }, [navigation])
  async function load() {
    const list = await getCustomers();
    setCustomers(list);
  }
  const onDelete = (id) => {
    Alert.alert('Confirm', 'Delete customer?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deleteCustomer(id);
          load();
        },
      },
    ]);
  };

  const filtered = customers.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={{
        backgroundColor: '#fff',
        padding: 16,
        marginBottom: 12,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
      }}
      onPress={() => navigation.navigate('CustomerForm', { id: item.id })}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={{ fontSize: 18, fontWeight: '700', color: '#222' }}>
          Name :  {item.name}
        </Text>

        <TouchableOpacity onPress={() => onDelete(item.id)}>
          <Icon name="delete" size={22} color="red" />
        </TouchableOpacity>
      </View>
      <Text style={{ color: '#777', marginTop: 2 }}>
        Code: {item.customer_code}
      </Text>

      <Text style={{ marginTop: 4, color: '#555' }}>
        City : {item.city}
      </Text>
      <Text style={{ marginTop: 4, color: '#555' }}>
        Contact Number : {item.contact_no}
      </Text>
      <Text style={{ marginTop: 4, color: '#555' }}>
        WhatsApp Number : {item.whatsapp_no}
      </Text>
      <Text style={{ marginTop: 6, color: '#333' }}>
        Milk Type: {item.milk_type.toUpperCase()}
        {'   '}Rate: ₹{item.rate}/L
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={'dark-content'} backgroundColor={'#f4f4f4'} />
      <BackHeader title={'Customer Master'} bg={'#f4f4f4'} ph={16} />

      {/* Search Bar */}
      <View
        style={
          styles.searchBar
        }
      >
        <Icon name="search" size={22} color="#777" />
        <TextInput
          placeholder="Search customer..."
          value={search}
          onChangeText={setSearch}
          style={{ marginLeft: 10, fontSize: 16, flex: 1 }}
        />
      </View>
      {
        loading ?

          <ActivityIndicator size={'large'} color={'skyblue'}
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} /> :
          <CustomerCard onDelete={onDelete} customers={filtered} navigation={navigation} search={search} />
      }
      {/* <CustomerGrid customers={customers} onDelete={onDelete} navigation={navigation} /> */}

      {/* Floating Add Button */}
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => navigation.navigate('CustomerForm')}
        style={styles.floatBtn}
      >
        <Icon name="add" size={32} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  floatBtn: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    backgroundColor: '#1976D2',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  searchBar: {
    flexDirection: 'row',
    padding: 8,
    backgroundColor: '#fff',
    borderRadius: 20,
    marginBottom: 16,
    elevation: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    alignSelf: 'center',
    borderWidth: 0.5,
    borderColor: '#ccc',
    width: '95%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10
  },
  container: {
    flex: 1,
    // padding: 16,
    backgroundColor: '#f4f4f4',
    // width: '90%',
    // alignItems: 'center'

  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 16
  }
})
export default CustomerListScreen;