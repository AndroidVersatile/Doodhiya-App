import { ActivityIndicator, StatusBar, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Responsive } from '../theme/responsive'

const CustomLoader = () => {
    return (
        <SafeAreaView style={styles.mainContainer}
            accessible={true}
            accessibilityRole="progressbar"
            accessibilityLabel="Loading"
            accessibilityHint="Please wait while content is loading"
        >
            <StatusBar barStyle={'dark-content'} backgroundColor={'#F8F9FA'} />
            <ActivityIndicator size={Responsive.fontSize[30]} color={'blue'} />
            <Text style={styles.pleaseWaitText} accessibilityRole="text"
                accessibilityLiveRegion="polite">Please wait.....</Text>
        </SafeAreaView>
    )
}

export default CustomLoader

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F8F9FA',
        flexDirection: 'row',
        gap: Responsive.spacing[15]
    },
    pleaseWaitText: {
        fontSize: Responsive.fontSize[17],
        fontWeight: '400',
        color: 'blue',
    }
})

// import React from 'react';
// import { StyleSheet, View, ScrollView } from 'react-native';
// import { Skeleton } from 'moti/skeleton';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { Responsive } from '../theme/responsive';

// const CustomLoader = () => {
//     const colorMode = 'light';

//     return (
//         <SafeAreaView style={styles.container}>
//             <Skeleton.Group show={true} >
//                 {/* --- Header Skeleton --- */}
//                 <View style={styles.header}>
//                     <View>
//                         {/* Using responsive font size for height */}
//                         <Skeleton colorMode={colorMode} width={Responsive.size.wp(25)} height={Responsive.fontSize[14]} />
//                         <View style={{ marginTop: Responsive.spacing[8] }} />
//                         <Skeleton colorMode={colorMode} width={Responsive.size.wp(40)} height={Responsive.fontSize[16]} />
//                     </View>
//                     {/* Circular profile matching your Responsive.size.wp(12) */}
//                     <Skeleton
//                         colorMode={colorMode}
//                         radius="round"
//                         width={Responsive.size.wp(12)}
//                         height={Responsive.size.wp(12)}

//                     />
//                 </View>

//                 <ScrollView contentContainerStyle={styles.scrollContent}>
//                     {/* --- Stats Container Skeleton --- */}
//                     <View style={styles.statsContainer}>
//                         {[1, 2].map((i) => (
//                             <View key={i} style={styles.statBox}>
//                                 <Skeleton colorMode={colorMode} width={Responsive.size.wp(15)} height={Responsive.fontSize[12]} />
//                                 <View style={{ marginTop: Responsive.spacing[6] }} />
//                                 <Skeleton colorMode={colorMode} width={Responsive.size.wp(10)} height={Responsive.fontSize[18]} />
//                             </View>
//                         ))}
//                     </View>

//                     {/* --- Section Title --- */}
//                     <Skeleton colorMode={colorMode} width={Responsive.size.wp(30)} height={Responsive.fontSize[18]} />
//                     <View style={{ marginTop: Responsive.spacing[16] }} />

//                     {/* --- Grid Cards Skeleton --- */}
//                     <View style={styles.gridContainer}>
//                         {[1, 2, 3, 4].map((item) => (
//                             <View key={item} style={styles.card}>
//                                 {/* Responsive Icon Container */}
//                                 <Skeleton
//                                     colorMode={colorMode}
//                                     radius={Responsive.radius[16]}
//                                     width={Responsive.size.wp(13)}
//                                     height={Responsive.size.wp(13)}
//                                 />
//                                 <View style={{ marginTop: Responsive.spacing[16] }} />
//                                 {/* Responsive Text Lines */}
//                                 <Skeleton colorMode={colorMode} width="80%" height={Responsive.fontSize[15]} />
//                                 <View style={{ marginTop: Responsive.spacing[6] }} />
//                                 <Skeleton colorMode={colorMode} width="50%" height={Responsive.fontSize[12]} />
//                             </View>
//                         ))}
//                     </View>
//                 </ScrollView>
//             </Skeleton.Group>
//         </SafeAreaView>
//     );
// };

// export default CustomLoader;

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: '#F8F9FA',
//     },
//     header: {
//         backgroundColor: '#1A237E',
//         paddingHorizontal: Responsive.size.wp(3),
//         paddingTop: Responsive.size.hp(2.5),
//         paddingBottom: Responsive.size.hp(5),
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         borderBottomLeftRadius: Responsive.radius[32],
//         borderBottomRightRadius: Responsive.radius[32],
//     },
//     scrollContent: {
//         padding: Responsive.size.wp(6),
//     },
//     statsContainer: {
//         backgroundColor: '#fff',
//         borderRadius: Responsive.radius[20],
//         padding: Responsive.spacing[20],
//         marginTop: Responsive.spacing[8],
//         flexDirection: 'row',
//         marginBottom: Responsive.spacing[28],
//         borderWidth: 1,
//         borderColor: '#F1F3F5',
//     },
//     statBox: {
//         flex: 1,
//         alignItems: 'center',
//     },
//     gridContainer: {
//         flexDirection: 'row',
//         flexWrap: 'wrap',
//         justifyContent: 'space-between',
//     },
//     card: {
//         backgroundColor: '#fff',
//         width: Responsive.size.wp(43),
//         padding: Responsive.spacing[20],
//         borderRadius: Responsive.radius[24],
//         marginBottom: Responsive.spacing[16],
//         borderWidth: 1,
//         borderColor: '#F1F3F5',
//     },
// });