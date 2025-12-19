import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
const BackHeader = ({ title, bg, ph }) => {
    const navigation = useNavigation();
    return (
        <View style={[styles.container, {
            backgroundColor: bg || 'transparent'
            , paddingHorizontal: ph || 14


        }]}>
            <TouchableOpacity
            activeOpacity={0.7}
                onPress={() => navigation.goBack()}
                style={[styles.backBtn, { backgroundColor: bg || '#f4f4f4' }]}
            >
                <Icon name={'arrow-back'} size={30} color='#000' />
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
        paddingVertical: 8
    },
    headerText: {
        fontSize: 23,
        color: '#000',
        fontWeight: '500'
    },
    backBtn: {
        padding: 5,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
        borderRadius: 30,
        borderWidth: 0.5,
        borderColor: '#ccc',
        marginRight: 20,
        elevation: 10,
    }
})