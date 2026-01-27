import { ScrollView, StatusBar, StyleSheet, Text, View, TouchableOpacity, Linking } from 'react-native'
import React from 'react'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import BackHeader from '../components/BackHeader'
import { Responsive } from '../theme/responsive'
const ContactUsScreen = () => {
    const insets = useSafeAreaInsets()
    const handleEmailPress = () => {
        Linking.openURL('mailto:support@versatileitsolution.com')
    }

    const handlePhonePress = () => {
        Linking.openURL('tel:+919876543210')
    }

    return (
        <View style={[styles.mainContainer, { paddingTop: insets.top + Responsive.spacing[10] }]} >
            <StatusBar backgroundColor={'#F8F9FA'} barStyle={'dark-content'} />
            <BackHeader title={'Contact Us'} bg={'#F8F9FA'} />

            <ScrollView
                contentContainerStyle={[styles.contentContainer,{ paddingBottom: insets.bottom + Responsive.spacing[10] }]}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.headerSection}>
                    <Text style={styles.title} accessibilityRole="header">Get in Touch</Text>
                    <Text style={styles.description}>
                        We’re here to help! If you have any questions, feedback, or need support, feel free to reach out to our team.
                    </Text>
                </View>

                <View style={styles.card}>
                    {/* Email Action */}
                    <TouchableOpacity
                        style={styles.contactItem}
                        onPress={handleEmailPress}
                        accessible={true}
                        accessibilityRole="button"
                        accessibilityLabel="Send an email to support"
                        accessibilityHint="Opens your default email application"
                    >
                        <View style={[styles.iconContainer, { backgroundColor: '#E3F2FD' }]}>
                            <MaterialIcons name="email" size={Responsive.fontSize[22]} color="#1976D2" />
                        </View>
                        <View style={styles.textContainer}>
                            <Text style={styles.label}>Email Support</Text>
                            <Text style={styles.value}>support@versatileitsolution.com</Text>
                        </View>
                        <MaterialIcons name="chevron-right" size={Responsive.fontSize[20]} color="#C7C7CC" />
                    </TouchableOpacity>

                    <View style={styles.divider} />

                    {/* Phone Action */}
                    <TouchableOpacity
                        style={styles.contactItem}
                        onPress={handlePhonePress}
                        accessible={true}
                        accessibilityRole="button"
                        accessibilityLabel="Call support"
                        accessibilityHint="Opens your phone dialer"
                    >
                        <View style={[styles.iconContainer, { backgroundColor: '#E8F5E9' }]}>
                            <MaterialIcons name="phone" size={Responsive.fontSize[22]} color="#388E3C" />
                        </View>
                        <View style={styles.textContainer}>
                            <Text style={styles.label}>Call Us</Text>
                            <Text style={styles.value}>+91 99833 33276</Text>
                        </View>
                        <MaterialIcons name="chevron-right" size={Responsive.fontSize[20]} color="#C7C7CC" />
                    </TouchableOpacity>

                    <View style={styles.divider} />

                    {/* Schedule Info - Non-clickable */}
                    <View
                        style={styles.contactItem}
                        accessible={true}
                        accessibilityLabel="Support hours: Monday to Saturday, 9 AM to 6 PM"
                    >
                        <View style={[styles.iconContainer, { backgroundColor: '#FFF3E0' }]}>
                            <MaterialIcons name="schedule" size={Responsive.fontSize[22]} color="#F57C00" />
                        </View>
                        <View style={styles.textContainer}>
                            <Text style={styles.label}>Support Hours</Text>
                            <Text style={styles.value}>Mon - Sat, 10:00 AM - 7:00 PM</Text>
                        </View>
                    </View>
                </View>

                <Text style={styles.footerNote}>
                    Typically responds within 24 hours.
                </Text>
            </ScrollView>
        </View>
    )
}

export default ContactUsScreen


const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    contentContainer: {
        paddingHorizontal: Responsive.size.wp(5),
        paddingBottom: Responsive.size.hp(5),
    },
    headerSection: {
        marginTop: Responsive.size.hp(2.5),
        marginBottom: Responsive.size.hp(3.5),
    },
    title: {
        fontSize: Responsive.fontSize[26],
        fontWeight: '700',
        color: '#1A1C1E',
        marginBottom: Responsive.size.hp(1),
    },
    description: {
        fontSize: Responsive.fontSize[15],
        lineHeight: Responsive.fontSize[22],
        color: '#44474E',
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: Responsive.radius[16],
        paddingVertical: Responsive.size.hp(1),
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
    },
    contactItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: Responsive.size.wp(4),
    },
    iconContainer: {
        width: Responsive.spacing[42],
        height: Responsive.spacing[42],
        borderRadius: Responsive.radius[12],
        backgroundColor: '#F5F0F0',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: Responsive.size.wp(4),
    },
    textContainer: {
        flex: 1,
    },
    label: {
        fontSize: Responsive.fontSize[13],
        color: '#757575',
        fontWeight: '500',
        marginBottom: Responsive.size.hp(0.2),
    },
    value: {
        fontSize: Responsive.fontSize[15],
        fontWeight: '600',
        color: '#1A1C1E',
    },
    divider: {
        height: 1,
        backgroundColor: '#F0F0F0',
        marginLeft: Responsive.size.wp(19),
    },
    footerNote: {
        textAlign: 'center',
        marginTop: Responsive.size.hp(3),
        fontSize: Responsive.fontSize[13],
        color: '#757575',
        fontStyle: 'italic',
        paddingHorizontal: Responsive.size.wp(10),
    }
});