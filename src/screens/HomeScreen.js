import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';


const HomeScreen = ({ navigation }) => {
  return (
    <SafeAreaView
      // edges={['left', 'right', 'top']}

      style={
        styles.container
      }>
      <StatusBar barStyle={'dark-content'} backgroundColor={'#f4f4f4'} />

      <Text style={
        styles.headreTitle
      }>
        Milk Management Admin
      </Text>

      {/* Card 1: Customer Master */}
      <TouchableOpacity
        style={
          styles.customerMasterBtn
        }
        activeOpacity={0.7}
        onPress={() => navigation.navigate('Customers')}
      >
        <Icon name="people" size={40} color="#1976D2" />
        <View style={{ marginLeft: 16 }}>
          <Text style={{ fontSize: 20, fontWeight: '700', color: '#222' }}>
            Customer Master
          </Text>
          <Text style={{ color: '#777', marginTop: 4 }}>
            Add dairy customers
          </Text>
        </View>
      </TouchableOpacity>

      {/* Card 2: Milk Entry */}
      <TouchableOpacity
        style={
          styles.milkEntryBtn
        }
        activeOpacity={0.7}
        onPress={() => navigation.navigate('MilkEntry')}
      >
        <Icon name="local-drink" size={40} color="#8E44AD" />
        <View style={{ marginLeft: 16 }}>
          <Text style={{ fontSize: 20, fontWeight: '700', color: '#222' }}>
            Milk Entry
          </Text>
          <Text style={{ color: '#777', marginTop: 4 }}>
            Record daily milk delivery
          </Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        style={
          styles.milkEntryBtn
        }
        activeOpacity={0.7}
        onPress={() => navigation.navigate('MilkListScreen')}
      >
        <Icon name="checklist" size={40} color="#8E44AD" />
        <View style={{ marginLeft: 16 }}>
          <Text style={{ fontSize: 20, fontWeight: '700', color: '#222' }}>
            Milk Entries List
          </Text>
          <Text style={{ color: '#777', marginTop: 4 }}>
            See all milk entries
          </Text>
        </View>
      </TouchableOpacity>

    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
    padding: 20,
  },
  headreTitle: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center'
  },
  customerMasterBtn: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 16,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 3,
  },
  milkEntryBtn: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 3,
    marginBottom: 20,
  }
});

export default HomeScreen;
