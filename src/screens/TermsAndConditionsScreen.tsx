import { ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import BackHeader from '../components/BackHeader'
import { Responsive } from '../theme/responsive'
const TermsAndConditionsScreen = () => {
    return (
        <SafeAreaView style={styles.mainContainer}>
            <StatusBar backgroundColor={'#F8F9FA'} barStyle={'dark-content'} />
            <BackHeader title={'Terms & Conditions'} bg={'#F8F9FA'} />

            <ScrollView
                contentContainerStyle={styles.contentContainer}
                showsVerticalScrollIndicator={false}
                accessible={true}
                accessibilityRole="scrollbar"
            >
                {/* Introduction Section */}
                <View
                    style={styles.section}
                    accessible={true}
                    accessibilityLabel="Introduction"
                >
                    <Text style={styles.paragraph}>
                        By using the <Text style={styles.bold}>Milk Management App</Text>, you
                        agree to comply with and be bound by the following terms. Please read
                        them carefully.
                    </Text>
                </View>

                {/* Section 1 */}
                <View style={styles.section} accessible={true}>
                    <Text
                        style={styles.subHeading}
                        accessibilityRole="header"
                    >
                        1. Purpose of Service
                    </Text>
                    <Text style={styles.paragraph}>
                        This application is provided as a tool to manage milk collection,
                        customer accounts, and transaction records. It is intended for
                        commercial and personal record-keeping use only.
                    </Text>
                </View>

                {/* Section 2 */}
                <View style={styles.section} accessible={true}>
                    <Text
                        style={styles.subHeading}
                        accessibilityRole="header"
                    >
                        2. User Responsibility
                    </Text>
                    <Text style={styles.paragraph}>
                        You are solely responsible for maintaining the accuracy and integrity
                        of the data entered. Users must ensure that:
                    </Text>

                    <View
                        style={styles.bulletList}
                        accessible={true}
                        accessibilityRole="list"
                        accessibilityLabel="User responsibilities list"
                    >
                        <Text style={styles.bulletItem}>
                            • All customer information is kept up to date.
                        </Text>
                        <Text style={styles.bulletItem}>
                            • Transaction quantities and rates are verified.
                        </Text>
                        <Text style={styles.bulletItem}>
                            • Access credentials are kept secure.
                        </Text>
                    </View>
                </View>

                {/* Section 3 */}
                <View style={styles.section} accessible={true}>
                    <Text
                        style={styles.subHeading}
                        accessibilityRole="header"
                    >
                        3. Prohibited Conduct
                    </Text>
                    <Text style={styles.paragraph}>
                        Any attempt to disrupt the app’s functionality, enter fraudulent data,
                        or bypass security measures may lead to{' '}
                        <Text style={styles.dangerText}>
                            immediate suspension
                        </Text>{' '}
                        of access without prior notice.
                    </Text>
                </View>

                {/* Section 4 */}
                <View style={styles.section} accessible={true}>
                    <Text
                        style={styles.subHeading}
                        accessibilityRole="header"
                    >
                        4. Limitation of Liability
                    </Text>
                    <Text style={styles.paragraph}>
                        While we strive for 100% uptime and data security, the app is provided
                        "as-is." The app owner shall not be liable for any data loss, financial
                        discrepancies, or damages resulting from your use of the service.
                    </Text>
                </View>

                {/* Acceptance Footer */}
                <View
                    style={styles.footer}
                    accessible={true}
                    accessibilityLabel="Acceptance of terms"
                >
                    <Text style={styles.footerText}>
                        Continued use of this application constitutes your formal acceptance
                        of these terms and any future modifications.
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>

    )
}

export default TermsAndConditionsScreen

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
    subHeading: {
        fontSize: Responsive.fontSize[18], // Approx hp('2.2%')
        fontWeight: '700',
        color: '#b9a1a1',
        marginBottom: Responsive.size.hp(1),
    },
    paragraph: {
        fontSize: Responsive.fontSize[14], // Approx hp('1.8%')
        lineHeight: Responsive.fontSize[22], // Approx hp('2.7%')
        color: '#44474E',
        textAlign: 'justify',
    },
    bold: {
        fontWeight: '700',
        color: '#1A1C1E',
    },
    dangerText: {
        color: '#FF5252',
        fontWeight: '700',
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
    },
    footer: {
        marginTop: Responsive.size.hp(2),
        paddingTop: Responsive.size.hp(2),
        borderTopWidth: 1,
        borderTopColor: '#EEEEEE',
    },
    footerText: {
        fontSize: Responsive.fontSize[12],
        color: '#757575',
        textAlign: 'center',
        fontStyle: 'italic',
        lineHeight: Responsive.fontSize[18],
    }
});