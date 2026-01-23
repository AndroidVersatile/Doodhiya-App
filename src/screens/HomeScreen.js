import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar, ScrollView, ActivityIndicator, RefreshControl, Image, BackHandler, ToastAndroid, Platform, } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSelector, useDispatch } from 'react-redux';
import { Responsive } from '../theme/responsive';
import CustomLoader from '../components/CustomLoader';
import { fetchCustomers } from '../redux/slice/customersSlice';
import { getMilkEntries } from '../redux/slice/milkSlice';
import { useFocusEffect } from '@react-navigation/native';
const HomeScreen = ({ navigation }) => {

  const [refreshing, setRefreshing] = useState(false);

  const dispatch = useDispatch();
  const { user, error } = useSelector((state) => state.auth);
  const { fetchLoading: fetchCustomerLoading, customersList } = useSelector((state) => state.customer);
  const { fetchMilkLoading, milkList, milkError } = useSelector((state) => state.milk);
  // console.log('Customers From Firestore', customersList);
  // console.log('Milk List from firebase', milkList);
  // console.log('Milk error :', milkError);
  // console.log('user', user);

  const uid = user?.uid ?? null;
  const isLoading = fetchCustomerLoading || fetchMilkLoading;
  const backPressedOnce = useRef(false);
  const exitTimeoutRef = useRef(null)
  const insets = useSafeAreaInsets();

  useFocusEffect(
    useCallback(() => {
      if (Platform.OS !== 'android') return;

      const onBackPress = () => {
        // User is on Home screen ONLY (because of useFocusEffect)

        if (backPressedOnce.current) {
          BackHandler.exitApp();
          return true;
        }

        backPressedOnce.current = true;
        ToastAndroid.show(
          'Press back again to exit',
          ToastAndroid.SHORT
        );

        exitTimeoutRef.current = setTimeout(() => {
          backPressedOnce.current = false;
        }, 2000);

        return true;
      };

      //  Correct modern API
      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress
      );

      return () => {
        if (exitTimeoutRef.current) {
          clearTimeout(exitTimeoutRef.current);
          exitTimeoutRef.current = null;
        }
        subscription.remove();
      };
    }, [])
  );

  useEffect(() => {
    if (!uid) {
      throw new Error('UID missing while fetching milk entries');
    }

    dispatch(fetchCustomers({ uid }));
    dispatch(getMilkEntries({ uid }));
  }, [uid, dispatch]);


  const loadContent = async () => {
    if (!uid) {
      throw new Error('UID missing while fetching milk entries');
    }
    setRefreshing(true);
    try {
      await Promise.all([
        dispatch(fetchCustomers({ uid })).unwrap(),
        dispatch(getMilkEntries({ uid })).unwrap(),
      ]);
    } finally {
      setRefreshing(false);
    }
  };


  const calculateTotalLiter = () => {
    return milkList.reduce((total, entry) => total + (entry.milk_liter || 0), 0);
  };
  const getGreeting = () => {
    const hour = new Date().getHours();

    if (hour >= 5 && hour < 12) return 'Good Morning';
    if (hour >= 12 && hour < 17) return 'Good Afternoon';
    if (hour >= 17 && hour < 21) return 'Good Evening';
    return 'Good Night';
  };

  const getGreetingIconName = () => {
    const hour = new Date().getHours();

    if (hour >= 5 && hour < 12) return 'weather-sunset-up';
    if (hour >= 12 && hour < 17) return 'weather-sunny';
    if (hour >= 17 && hour < 21) return 'weather-sunset-down';
    return 'weather-night';
  };
  const getUserName = () => {
    if (user?.displayName) return user.displayName;
    if (user?.email) return user.email.split('@')[0];
    return 'User';
  };

  if (isLoading) {
    return <CustomLoader />
  }
  return (
    <View style={styles.container} accessible={false} >
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* 1. Modern Header */}
      <View style={[styles.header, { paddingTop: insets.top + Responsive.spacing[10] }]}
        accessible={true}
        accessibilityRole="header"
        accessibilityLabel={`Home header. ${getGreeting()}, ${getUserName()}`}>
        <View style={styles.greetingRow}
          accessible={true}
          accessibilityRole="text"
          accessibilityLabel={`${getGreeting()}, ${getUserName()}`}
        >


          <Text style={styles.greetingText}
            accessibilityRole="text"
            accessibilityLabel={getGreeting()}
          >
            <Icon
              name={getGreetingIconName()}
              size={Responsive.fontSize[18]}
              color="#FFD27D"
              style={styles.greetingIcon}
              accessible={false}
            />  {getGreeting()},
          </Text>
          <Text
            lineBreakMode={'tail'}
            numberOfLines={1}
            style={styles.userName}
            accessibilityRole="text"
            accessibilityLabel={`User name ${getUserName()}`}
          >
            {getUserName()}
          </Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => navigation.navigate('ProfileScreen')}
          style={styles.profileCircle}
          accessibilityRole="button"
          accessibilityLabel="Open profile"
          accessibilityHint="Navigates to your profile screen"
        >
          {user?.photoURL ? (
            <Image
              source={{ uri: user.photoURL }}
              style={styles.profileImage}
              resizeMode="contain"
              accessibilityRole="image"
              accessibilityLabel="Profile picture"
            />
          ) : (
            <Icon
              name="account"
              size={Responsive.fontSize[30]}
              color="#fff"
              importantForAccessibility="no-hide-descendants"
              accessible={false}
            />
          )}
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom }]}
        accessibilityRole="scrollbar"
        accessibilityLabel="Home screen content"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={loadContent}
            tintColor="#2196F3"
            colors={['#2196F3']}
            accessibilityLabel="Pull to refresh content"
          />
        }
      >
        {/* 2. Stats/Summary Section  */}
        <View
          style={styles.statsContainer}
          accessible={true}
          accessibilityRole="summary"
          accessibilityLabel={`Statistics: ${customersList.length || 0} Active Customers, Today's total volume is ${calculateTotalLiter() || 0} Liters`}
        >
          <View style={styles.statBox}
            accessibilityRole="text"
            accessibilityLabel={`Total customers ${customersList.length || 0}`}
          >
            <Text style={styles.statLabel}>Total Customers</Text>
            <Text style={styles.statValue}>{customersList.length || 0}</Text>
          </View>
          <View style={[styles.statBox, { borderLeftWidth: 1, borderColor: '#eee' }]}
            accessibilityRole="text"
            accessibilityLabel={`Total milk ${calculateTotalLiter() || 0} liters`}
          >
            <Text style={styles.statLabel}>Total Liter</Text>
            <Text style={styles.statValue}>{calculateTotalLiter() || 0} Liter</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle} accessibilityRole="header"
          accessibilityLabel="Quick actions">Quick Actions</Text>

        {/* 3. Grid Menu */}
        <View style={styles.gridContainer} accessible={false}>
          <MenuCard
            title="Customers"
            subtitle="Manage profiles"
            icon="account-group"
            color="#E3F2FD"
            iconColor="#1976D2"
            onPress={() => navigation.navigate('Customers')}
            accessibilityRole="button"
            accessibilityLabel="Customers"
            accessibilityHint="Manage customer profiles"
          />
          <MenuCard
            title="New Entry"
            subtitle="Add daily milk"
            icon="plus-circle"
            color="#F3E5F5"
            iconColor="#8E44AD"
            onPress={() => navigation.navigate('MilkEntry')}
            accessibilityRole="button"
            accessibilityLabel="New milk entry"
            accessibilityHint="Add daily milk entry"
          />
          <MenuCard
            title="Reports"
            subtitle="History & Logs"
            icon="format-list-bulleted"
            color="#E8F5E9"
            iconColor="#2E7D32"
            onPress={() => navigation.navigate('MilkListScreen')}
            accessibilityRole="button"
            accessibilityLabel="Reports"
            accessibilityHint="View milk history and logs"
          />
          <MenuCard
            title="Settings"
            subtitle="App settings & more"
            icon="cog"
            color="#FFF3E0"
            iconColor="#EF6C00"
            onPress={() => navigation.navigate('SettingsScreen')}
            accessibilityRole="button"
            accessibilityLabel="Settings"
            accessibilityHint="Open application settings"
          />
        </View>
      </ScrollView>
    </View>
  );
};

// Reusable Menu Component for Clean Code
const MenuCard = ({ title, subtitle, icon, color, iconColor, onPress }) => (
  <TouchableOpacity style={styles.card} activeOpacity={0.8} onPress={onPress}>
    <View style={[styles.iconContainer, { backgroundColor: color }]}>
      <Icon name={icon} size={32} color={iconColor} />
    </View>
    <Text style={styles.cardTitle}>{title}</Text>
    <Text style={styles.cardSubtitle}>{subtitle}</Text>
  </TouchableOpacity>
);

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#F8F9FA',
//   },
//   header: {
//     backgroundColor: '#1A237E',
//     paddingHorizontal: wp('6%'), // Scalable horizontal padding
//     paddingTop: hp('2.5%'),
//     paddingBottom: hp('5%'),
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     borderBottomLeftRadius: wp('8%'), // Rounded corners scale with width
//     borderBottomRightRadius: wp('8%'),
//     elevation: 8,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.1,
//     shadowRadius: 10,
//   },
//   welcomeText: {
//     color: '#C5CAE9',
//     fontSize: hp('1.8%'), // Text scales with screen height
//     fontWeight: '500',
//   },
//   headerTitle: {
//     fontSize: hp('3%'), // Large title scales proportionally
//     fontWeight: '800',
//     color: '#fff',
//   },
//   profileCircle: {
//     width: wp('12%'), // Circle stays circular on all screens
//     height: wp('12%'),
//     borderRadius: wp('6%'),
//     backgroundColor: 'rgba(255,255,255,0.2)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   scrollContent: {
//     padding: wp('6%'),
//   },
//   statsContainer: {
//     backgroundColor: '#fff',
//     borderRadius: wp('5%'),
//     padding: wp('5%'),
//     marginTop: hp('1%'), // Responsively pull into header
//     flexDirection: 'row',
//     elevation: 10,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.1,
//     shadowRadius: 10,
//     marginBottom: hp('3.5%'),
//   },
//   statBox: {
//     flex: 1,
//     alignItems: 'center',
//   },
//   statLabel: {
//     fontSize: hp('1.5%'),
//     color: '#777',
//     marginBottom: hp('0.5%'),
//   },
//   statValue: {
//     fontSize: hp('2.4%'),
//     fontWeight: '700',
//     color: '#1A237E',
//   },
//   sectionTitle: {
//     fontSize: hp('2.2%'),
//     fontWeight: '700',
//     color: '#333',
//     marginBottom: hp('2%'),
//   },
//   gridContainer: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'space-between',
//   },
//   card: {
//     backgroundColor: '#fff',
//     width: wp('43%'), // Adjusted to ensure gap is consistent
//     padding: wp('5%'),
//     borderRadius: wp('6%'),
//     marginBottom: hp('2%'),
//     elevation: 4,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.05,
//     shadowRadius: 5,
//   },
//   iconContainer: {
//     width: wp('13%'),
//     height: wp('13%'),
//     borderRadius: wp('4%'),
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: hp('2%'),
//   },
//   cardTitle: {
//     fontSize: hp('1.9%'),
//     fontWeight: '700',
//     color: '#222',
//   },
//   cardSubtitle: {
//     fontSize: hp('1.4%'),
//     color: '#999',
//     marginTop: hp('0.5%'),
//   },
// });
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },

  header: {
    backgroundColor: '#1A237E',
    paddingHorizontal: Responsive.size.wp(3),
    paddingTop: Responsive.size.hp(2.5),
    paddingBottom: Responsive.size.hp(5),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomLeftRadius: Responsive.radius[32],
    borderBottomRightRadius: Responsive.radius[32],
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: Responsive.radius[10],
  },

  welcomeText: {
    color: '#C5CAE9',
    fontSize: Responsive.fontSize[14],
    fontWeight: '500',
  },

  headerTitle: {
    fontSize: Responsive.fontSize[16],
    fontWeight: '800',
    color: '#fff',
  },

  profileCircle: {
    width: Responsive.size.wp(12),
    height: Responsive.size.wp(12),
    borderRadius: Responsive.radius[24],
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden'
  },

  scrollContent: {
    padding: Responsive.size.wp(6),
  },

  statsContainer: {
    backgroundColor: '#fff',
    borderRadius: Responsive.radius[20],
    padding: Responsive.spacing[20],
    marginTop: Responsive.spacing[8],
    flexDirection: 'row',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: Responsive.radius[10],
    marginBottom: Responsive.spacing[28],
  },

  statBox: {
    flex: 1,
    alignItems: 'center',
  },

  statLabel: {
    fontSize: Responsive.fontSize[12],
    color: '#777',
    marginBottom: Responsive.spacing[4],
  },

  statValue: {
    fontSize: Responsive.fontSize[18],
    fontWeight: '700',
    color: '#1A237E',
  },

  sectionTitle: {
    fontSize: Responsive.fontSize[18],
    fontWeight: '700',
    color: '#333',
    marginBottom: Responsive.spacing[16],
  },

  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  card: {
    backgroundColor: '#fff',
    width: Responsive.size.wp(43),
    padding: Responsive.spacing[20],
    borderRadius: Responsive.radius[24],
    marginBottom: Responsive.spacing[16],
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: Responsive.radius[5],
  },

  iconContainer: {
    width: Responsive.size.wp(13),
    height: Responsive.size.wp(13),
    borderRadius: Responsive.radius[16],
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Responsive.spacing[16],
  },

  cardTitle: {
    fontSize: Responsive.fontSize[15],
    fontWeight: '700',
    color: '#222',
  },

  cardSubtitle: {
    fontSize: Responsive.fontSize[12],
    color: '#999',
    marginTop: Responsive.spacing[4],
  },
  greetingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Responsive.spacing[4],
  },

  greetingIcon: {
    opacity: 0.9,
  },

  greetingText: {
    fontSize: Responsive.fontSize[15],
    fontWeight: '600',
    color: 'rgba(255,255,255,0.75)',
    letterSpacing: 0.3,
  },

  userName: {
    fontSize: Responsive.fontSize[15],
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: Responsive.spacing[2],
    letterSpacing: 0.4,
    maxWidth: '40%',

  },
  profileImage: {
    width: Responsive.size.wp(12),
    height: Responsive.size.wp(12),
    borderRadius: Responsive.radius[24],
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default HomeScreen;