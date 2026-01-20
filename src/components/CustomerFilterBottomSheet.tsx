
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { TrueSheet } from '@lodev09/react-native-true-sheet';
import Slider from '@react-native-community/slider';
import { Responsive } from '../theme/responsive';
type Props = {
    isVisible: boolean;
    onClose: () => void;
    cities: string[];
    milkTypes: string[];
    city: string | null;
    setCity: (c: string) => void;
    milkType: string | null;
    setMilkType: (m: string) => void;
    maxRate: number;
    setMaxRate: (r: number) => void;
    applyFilters: () => void;
    resetFilters: () => void;
    sheet: any;
};

const CustomerFilterBottomSheet: React.FC<Props> = ({
    isVisible,
    onClose,
    cities,
    milkTypes,
    city,
    setCity,
    milkType,
    setMilkType,
    maxRate,
    setMaxRate,
    applyFilters,
    resetFilters,
    sheet,
}) => {
    const [tempCity, setTempCity] = useState(city);
    const [tempMilkType, setTempMilkType] = useState(milkType);
    const [tempMaxRate, setTempMaxRate] = useState(maxRate);
    // Sync with main filters when sheet opens
    useEffect(() => {
        if (isVisible) {
            setTempCity(city);
            setTempMilkType(milkType);
            setTempMaxRate(maxRate);
        }
    }, [isVisible, city, milkType, maxRate]);

    // const handleApply = () => {
    //     setCity(tempCity?.toLowerCase() as string);
    //     setMilkType(tempMilkType as string);
    //     setMaxRate(tempMaxRate);
    //     applyFilters(); // closes sheet
    // };
    const handleApply = () => {
        setCity(tempCity ? tempCity.toLowerCase() : null);
        setMilkType(tempMilkType ? tempMilkType.toLowerCase() : null);
        setMaxRate(tempMaxRate || 0);
        applyFilters(); // closes sheet
    };

    const handleReset = () => {
        setTempCity(null);
        setTempMilkType(null);
        setTempMaxRate(100);
        resetFilters()
    };
    return (
        <>
            <TrueSheet
                ref={sheet}
                // 
                detents={['auto', 1, 1]}
                backgroundBlur="dark"
                blurOptions={{
                    intensity: 15,
                    interaction: false,
                }}
                cornerRadius={Responsive.radius[24]}
                accessibilityViewIsModal={true}
                accessibilityLabel="Filter customers"
            >
                <View style={styles.container} accessible={false}>
                    <View style={styles.grabber} accessible={false}
                        importantForAccessibility="no" />
                    <Text style={styles.title} accessibilityRole="header">Filter Customers</Text>

                    {/* City */}
                    <Text style={styles.section} accessibilityRole="header">City</Text>
                    <View style={styles.row}>
                        {cities.map(item => (
                            <TouchableOpacity
                                key={item}
                                style={[
                                    styles.option,
                                    tempCity === item && styles.active,
                                ]}
                                onPress={() => setTempCity(item)}
                                accessibilityRole="button"
                                accessibilityLabel={`City ${item}`}
                                accessibilityState={{ selected: tempCity === item }}
                            >
                                <Text>{item}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Milk Type */}
                    <Text style={styles.section} accessibilityRole="header">Milk Type</Text>
                    <View style={styles.row}>
                        {milkTypes.map(item => (
                            <TouchableOpacity
                                key={item}
                                style={[
                                    styles.option,
                                    tempMilkType === item && styles.active,
                                ]}
                                onPress={() => setTempMilkType(item)}
                                accessibilityRole="button"
                                accessibilityLabel={`Milk type ${item}`}
                                accessibilityState={{ selected: tempMilkType === item }}

                            >
                                <Text>{item.toUpperCase()}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Slider */}
                    <Text style={styles.section} accessibilityRole="text">Max Rate: ₹{tempMaxRate}</Text>

                    <Slider
                        minimumValue={0}
                        maximumValue={100}
                        step={1}
                        value={tempMaxRate}
                        onValueChange={setTempMaxRate}
                        thumbTintColor='#4d85ecff'
                        minimumTrackTintColor={'#6fa8e0ff'}
                        maximumTrackTintColor={'#1f2c2cff'}
                        accessibilityRole="adjustable"
                        accessibilityLabel="Maximum milk rate"
                        accessibilityValue={{
                            min: 0,
                            max: 100,
                            now: tempMaxRate,
                            text: `${tempMaxRate} rupees`,
                        }}
                    />
                    {/* Buttons */}
                    <View style={styles.actions}>
                        <TouchableOpacity style={styles.reset} onPress={handleReset}
                            accessibilityRole="button"
                            accessibilityLabel="Clear filters"
                            accessibilityHint="Removes all selected filters"
                        >
                            <Text>Clear</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.apply}
                            onPress={handleApply}
                            accessibilityRole="button"
                            accessibilityLabel="Apply filters"
                            accessibilityHint="Applies selected filters to customer list"
                        >
                            <Text style={{ color: '#fff' }}>Apply</Text>
                        </TouchableOpacity>
                    </View>
                </View>

            </TrueSheet>
        </>
    );
};

export default CustomerFilterBottomSheet;

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        paddingHorizontal: Responsive.spacing[20],
        paddingTop: Responsive.spacing[12],
        paddingBottom: Responsive.spacing[24],
        borderTopLeftRadius: Responsive.radius[24],
        borderTopRightRadius: Responsive.radius[24],
    },

    title: {
        fontSize: Responsive.fontSize[18],
        fontWeight: '800',
        color: '#1a1a1a',
        marginBottom: Responsive.spacing[10],
    },

    section: {
        marginTop: Responsive.spacing[14],
        fontSize: Responsive.fontSize[14],
        fontWeight: '700',
        color: '#444',
    },

    row: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: Responsive.spacing[8],
    },

    option: {
        paddingVertical: Responsive.spacing[8],
        paddingHorizontal: Responsive.spacing[14],
        backgroundColor: '#f5f5f5',
        borderRadius: Responsive.radius[12],
        marginRight: Responsive.spacing[8],
        marginBottom: Responsive.spacing[8],
        borderWidth: 1,
        borderColor: '#eee',
    },

    active: {
        backgroundColor: '#E8F0FE',
        borderColor: '#b9a1a1',
    },

    activeText: {
        color: '#b9a1a1',
        fontWeight: '700',
    },

    actions: {
        flexDirection: 'row',
        marginTop: Responsive.spacing[24],
        justifyContent: 'space-between',
    },

    reset: {
        flex: 1,
        paddingVertical: Responsive.spacing[12],
        backgroundColor: '#f0f0f0',
        marginRight: Responsive.spacing[12],
        borderRadius: Responsive.radius[14],
        alignItems: 'center',
        justifyContent: 'center',
    },

    apply: {
        flex: 1,
        paddingVertical: Responsive.spacing[12],
        backgroundColor: '#b9a1a1',
        borderRadius: Responsive.radius[14],
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 4,
        shadowColor: '#b9a1a1',
        shadowOpacity: 0.3,
        shadowRadius: Responsive.radius[6],
        shadowOffset: { width: 0, height: 2 },
    },

    btnText: {
        fontSize: Responsive.fontSize[15],
        fontWeight: '700',
        color: '#fff',
    },

    resetText: {
        fontSize: Responsive.fontSize[15],
        fontWeight: '600',
        color: '#666',
    },

    grabber: {
        width: Responsive.size.wp(10),
        height: Responsive.size.hp(0.6),
        backgroundColor: '#E2E8F0',
        borderRadius: Responsive.radius[6],
        alignSelf: 'center',
        marginBottom: Responsive.spacing[16],
    },
});