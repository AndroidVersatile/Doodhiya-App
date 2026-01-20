import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { Responsive } from '../theme/responsive';

const BackHeader = ({ title, bg, }) => {
    const navigation = useNavigation();
    return (
        <View style={[styles.container, {
            backgroundColor: bg || 'transparent',
            paddingHorizontal: Responsive.size.wp(4),
        }]}
            accessible={true}
        >
            <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => navigation.goBack()}
                style={[styles.backBtn, { backgroundColor: bg || '#f4f4f4' }]}
                accessibilityRole="button"
                accessibilityLabel='Go back'
            >
                <Icon name={'arrow-back'} size={Responsive.fontSize[22]} color='#000' />
            </TouchableOpacity>
            <Text style={styles.headerText}>{title}</Text>
        </View>
    )
}

export default BackHeader

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: Responsive.size.hp(1.5),
        paddingHorizontal: Responsive.size.wp(4),
        backgroundColor: '#f4f4f4',
    },

    backBtn: {
        width: Responsive.size.wp(10),
        height: Responsive.size.wp(10),
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: Responsive.radius[20],
        borderWidth: 1,
        borderColor: '#eee',
        marginRight: Responsive.spacing[16],
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: Responsive.radius[4],
    },

    headerText: {
        fontSize: Responsive.fontSize[20],
        color: '#1a1a1a',
        fontWeight: '700',
    },
});