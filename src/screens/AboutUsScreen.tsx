import { ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import BackHeader from '../components/BackHeader'
import { Responsive } from '../theme/responsive';
const AboutUsScreen = () => {
    const insets = useSafeAreaInsets()
    return (
        <View style={[styles.mainContainer, { paddingTop: insets.top + Responsive.spacing[10] }]}>
            <StatusBar backgroundColor={'#F8F9FA'} barStyle={'dark-content'} />
            <BackHeader title={'About Us'} bg={'#F8F9FA'} />

            <ScrollView
                contentContainerStyle={[styles.contentContainer, { paddingBottom: insets.bottom + Responsive.spacing[10] }]}
                showsVerticalScrollIndicator={false}
                // Grouping content for screen readers so they read paragraphs as one thought
                accessible={true}
            >
                {/* Header Section */}
                <View style={styles.heroSection}>
                    <Text
                        style={styles.heading}
                        accessibilityRole="header"
                    >
                        Smart Dairy Management
                    </Text>
                    <View style={styles.underline} importantForAccessibility="no-hide-descendants" />
                </View>

                {/* Content Block 1 */}
                <View
                    style={styles.textBlock}
                    accessible={true}
                    accessibilityLabel="Our mission: simplifying dairy records through technology."
                >
                    <Text style={styles.paragraph}>
                        Our <Text style={styles.boldText}>Doodhiya App</Text> is designed to simplify and digitize daily milk collection, delivery, and record-keeping.
                    </Text>
                    <Text style={styles.paragraph}>
                        We help dairy owners, vendors, and customers manage milk data efficiently without paperwork or confusion.
                    </Text>
                </View>

                {/* Content Block 2 */}
                <View
                    style={styles.textBlock}
                    accessible={true}
                >
                    <Text style={styles.paragraph}>
                        With this app, you can easily track milk quantities, manage customer accounts, maintain daily logs, and monitor payments in one secure place.
                    </Text>
                    <Text style={styles.paragraph}>
                        Our goal is to <Text style={styles.highlightText}>save time, reduce errors,</Text> and improve transparency in milk distribution systems.
                    </Text>
                </View>

                {/* Footer Statement */}
                <View
                    style={styles.footerBlock}
                    accessible={true}
                >
                    <Text style={styles.footerText}>
                        We believe technology can make traditional dairy management smarter and more reliable. Built with simplicity and accuracy in mind.
                    </Text>
                </View>
            </ScrollView>
        </View>
    )
}

export default AboutUsScreen


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
    heroSection: {
        marginBottom: Responsive.size.hp(3),
        marginTop: Responsive.size.hp(1.2),
    },
    heading: {
        fontSize: Responsive.fontSize[26],
        fontWeight: '700',
        color: '#1A1C1E',
        letterSpacing: -0.5,
    },
    underline: {
        width: Responsive.size.wp(12),
        height: Responsive.size.hp(0.5),
        backgroundColor: '#5360d4ff',
        marginTop: Responsive.size.hp(1),
        borderRadius: Responsive.radius[4],
    },
    textBlock: {
        marginBottom: Responsive.size.hp(3),
    },
    paragraph: {
        fontSize: Responsive.fontSize[15],
        lineHeight: Responsive.fontSize[22],
        color: '#44474E',
        marginBottom: Responsive.size.hp(1.5),
        textAlign: 'justify'
    },
    boldText: {
        fontWeight: '700',
        color: '#487cafff',
    },
    highlightText: {
        color: '#493b3bff',
        fontWeight: '600',
    },
    footerBlock: {
        marginTop: Responsive.size.hp(1),
        padding: Responsive.size.wp(5),
        backgroundColor: '#f2f0f9ff',
        borderRadius: Responsive.radius[12],
        borderLeftWidth: Responsive.size.wp(1.2),
        borderLeftColor: '#584ad4ff',
    },
    footerText: {
        fontSize: Responsive.fontSize[14],
        fontStyle: 'italic',
        lineHeight: Responsive.fontSize[20],
        color: '#44474E',
    }
});