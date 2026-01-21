import { ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import BackHeader from '../components/BackHeader'

import { Responsive } from '../theme/responsive';
const PrivacyPolicyScreen = () => {
    return (
        <SafeAreaView style={styles.mainContainer}>
            <StatusBar backgroundColor={'#F8F9FA'} barStyle={'dark-content'} />
            <BackHeader title={'Privacy Policy'} bg={'#F8F9FA'} />

            <ScrollView
                contentContainerStyle={styles.contentContainer}
                showsVerticalScrollIndicator={false}
                accessible={true}
                accessibilityRole="scrollbar"
            >
                {/* Introduction */}
                <View style={styles.section}>
                    {/* <Text style={styles.lastUpdated}>Last Updated: May 2024</Text> */}
                    <Text style={styles.paragraph}>
                        This Privacy Policy explains how we collect, use, and protect your information when you use
                        the <Text style={styles.bold}>Doodhiya-Milk Management App</Text>. We respect your privacy and are committed to keeping your personal
                        and business data safe and secure.
                    </Text>
                </View>

                {/* Data Collection Section */}
                <View style={styles.section}>
                    <Text style={styles.subHeading} accessibilityRole="header"
                    >1. Information We Collect</Text>
                    <Text style={styles.paragraph}>
                        The app may collect basic information required for service delivery, including:
                    </Text>
                    <View style={styles.bulletList} accessibilityRole="list">
                        <Text style={styles.bulletItem}>• Name and contact details</Text>
                        <Text style={styles.bulletItem}>• Customer and milk quantity records</Text>
                        {/* <Text style={styles.bulletItem}>• Transaction and payment details</Text> */}
                    </View>
                </View>

                {/* Data Usage Section */}
                <View style={styles.section}>
                    <Text style={styles.subHeading} accessibilityRole="header">2. How We Use Your Data</Text>
                    <Text style={styles.paragraph}>
                        This information is used strictly to provide app functionality, improve user experience,
                        and maintain accurate digital records for your business operations.
                    </Text>
                </View>

                {/* Security Section */}
                <View style={styles.section}>
                    <Text style={styles.subHeading} accessibilityRole="header">3. Data Protection & Sharing</Text>
                    <Text style={styles.paragraph}>
                        We <Text style={styles.bold} accessibilityRole="text">do not sell or share</Text> your personal data with third parties.
                        While we take industry-standard measures to protect your information, complete security
                        cannot be guaranteed.
                    </Text>
                </View>

                {/* Consent Section */}
                <View style={styles.section}>
                    <Text style={styles.paragraph}>
                        By using this app, you agree to the collection and use of information as described in this policy.
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default PrivacyPolicyScreen

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    contentContainer: {
        paddingHorizontal: Responsive.size.wp(5.5),
        paddingBottom: Responsive.size.hp(5),
        paddingTop: Responsive.size.hp(1.5),
    },
    section: {
        marginBottom: Responsive.size.hp(2.5),
    },
    lastUpdated: {
        fontSize: Responsive.fontSize[12],
        color: '#757575',
        marginBottom: Responsive.size.hp(1.2),
        fontStyle: 'italic',
    },
    subHeading: {
        fontSize: Responsive.fontSize[18],
        fontWeight: '700',
        color: '#b9a1a1',
        marginBottom: Responsive.size.hp(1),
    },
    paragraph: {
        fontSize: Responsive.fontSize[14],
        lineHeight: Responsive.fontSize[21],
        color: '#44474E',
        textAlign: 'justify',
    },
    bold: {
        fontWeight: '700',
        color: '#1A1C1E',
    },
    bulletList: {
        marginTop: Responsive.size.hp(1),
        paddingLeft: Responsive.size.wp(3),
    },
    bulletItem: {
        fontSize: Responsive.fontSize[14],
        lineHeight: Responsive.fontSize[24],
        color: '#44474E',
        marginBottom: Responsive.size.hp(0.5),
    }
});