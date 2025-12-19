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
import { getMilkEntries } from '../db/database';
import BackHeader from '../components/BackHeader';
import MilkCard from '../components/MilkCard';



const MilkListScreen = ({ navigation }) => {
    const [milklist, setMilkList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const flatRef = useRef();
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', load);
        setLoading(true);
        const timer = setTimeout(() => {
            load();
            setLoading(false);
        }, 2000);
        return () => clearTimeout(timer), unsubscribe;
    }, [navigation]);

    const load = async () => {
        const list = await getMilkEntries();
        setMilkList(list);
    }
    const EmptyComponent = () => {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 50 }}>
                {
                    loading ? (
                        <ActivityIndicator size="large" color="#1976D2" />
                    ) :

                        <Text style={{ fontSize: 20, color: '#777' }}>Nothing to see here Add Some</Text>
                }
            </View>
        );
    }
    const renderItem = ({ item }) => (
        <View
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
        >
            {/* Header */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ fontSize: 18, fontWeight: '700', color: '#222' }}>
                    Name :  {item.name} {item.customer_code}
                </Text>

                {/* 
                <TouchableOpacity onPress={() => onDelete(item.id)}>
                    <Icon name="delete" size={22} color="red" />
                </TouchableOpacity> */}
            </View>
            <Text style={{ fontSize: 15, fontWeight: '400', color: '#222' }}>
                Customer Code : {item.customer_code}
            </Text>
            {/* Date & Time */}
            <Text style={{ marginTop: 4, color: '#000' }}>
                Date: {item.date}
            </Text>

            <Text style={{ marginTop: 4, color: '#000' }}>
                Time: {item.time_period} – {item.delivery_time}
            </Text>

            {/* Milk details */}
            <Text style={{ marginTop: 6, color: '#000', fontWeight: '600' }}>
                Milk: {item.milk_liter} L
            </Text>

            <Text style={{ marginTop: 4, color: '#000', fontWeight: '600' }}>
                Rate: ₹{item.rate}/L
            </Text>

            <Text style={{ marginTop: 4, color: '#000', fontWeight: '700' }}>
                Amount: ₹{item.amount}
            </Text>
        </View>
    );
    // const filtered = milklist.filter((m) =>
    //     m.name.toLowerCase().includes(search.toLowerCase())
    // );
    // const onDelete = (id) => {
    //   Alert.alert('Confirm', 'Delete customer?', [
    //     { text: 'Cancel', style: 'cancel' },
    //     {
    //       text: 'Delete',
    //       style: 'destructive',
    //       onPress: async () => {
    //         await deleteCustomer(id);
    //         load();
    //       },
    //     },
    //   ]);
    // };
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle={'dark-content'} backgroundColor={'#f4f4f4'} />
            <BackHeader title={'Milk Entries'} bg={'#f4f4f4'} ph={4} />
            {/* Search Bar */}
            <View
                style={
                    styles.searchBar
                }
            >
                <Icon name="search" size={22} color="#777" />
                <TextInput
                    placeholder="Search milk..."
                    value={search}
                    onChangeText={setSearch}
                    style={{ marginLeft: 10, fontSize: 16, flex: 1 }}
                />
            </View>
            {/* <FlatList
                ref={flatRef}
                data={milklist}
                keyExtractor={(item) => String(item.id)}
                renderItem={renderItem}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={<EmptyComponent />}
            /> */}
            {
                loading ?

                    <ActivityIndicator size={'large'} color={'skyblue'}
                        style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} /> :
                    <MilkCard milkentries={milklist} navigation={navigation} search={search} />
            }

            {/* Floating Add Button */}
            <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => navigation.navigate('MilkEntry')}
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
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 20,
        marginBottom: 16,
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        alignItems: 'center',
        borderWidth: 0.5,
        borderColor: '#ccc',
        marginTop: 10,
    },
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#f4f4f4'
    },
    title: {
        fontSize: 26,
        fontWeight: '700',
        marginBottom: 16
    }
})
export default MilkListScreen;