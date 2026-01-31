import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, ScrollView, Animated, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Responsive } from '../theme/responsive';

const SkeletonItem = ({ w, h, rd = Responsive.radius[8], style, isDark = false }) => {
    const pulse = useRef(new Animated.Value(0.3)).current;

    useEffect(() => {
        const animation = Animated.loop(
            Animated.sequence([
                Animated.timing(pulse, {
                    toValue: 0.8,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.timing(pulse, {
                    toValue: 0.3,
                    duration: 1000,
                    useNativeDriver: true,
                }),
            ])
        );
        animation.start();
        return () => animation.stop();
    }, [pulse]);

    return (
        <Animated.View
            importantForAccessibility="no"
            accessible={false}
            style={[
                {
                    width: w,
                    height: h,
                    borderRadius: rd,
                    backgroundColor: isDark ? 'rgba(255,255,255,0.15)' : '#E1E9EE',
                    opacity: pulse,
                },
                style,
            ]}
        />
    );
};

const HomeSkeleton = () => {
    const insets = useSafeAreaInsets();

    return (
        <View
            style={styles.container}
            accessible={true}
            accessibilityLabel="Loading home screen content, please wait."
            accessibilityRole="progressbar"
        >
            {/* 1. Header Skeleton */}
            <View style={[styles.header, { paddingTop: insets.top + Responsive.spacing[10] }]}>
                <View style={styles.headerContent}>
                    <View>
                        <SkeletonItem w={Responsive.size.wp(30)} h={Responsive.fontSize[15]} isDark />
                        <View style={{ marginTop: Responsive.spacing[8] }}>
                            <SkeletonItem w={Responsive.size.wp(45)} h={Responsive.fontSize[20]} isDark />
                        </View>
                    </View>
                    <SkeletonItem
                        w={Responsive.size.wp(12)}
                        h={Responsive.size.wp(12)}
                        rd={Responsive.radius[24]}
                        isDark
                    />
                </View>
            </View>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                scrollEnabled={false}
                importantForAccessibility="no-hide-descendants"
            >
                {/* 2. Stats Card Skeleton */}
                <View style={styles.statsContainer}>
                    <View style={styles.statBox}>
                        <SkeletonItem w={Responsive.size.wp(20)} h={Responsive.fontSize[12]} />
                        <View style={{ marginTop: Responsive.spacing[8] }}>
                            <SkeletonItem w={Responsive.size.wp(15)} h={Responsive.fontSize[18]} />
                        </View>
                    </View>
                    <View style={[styles.statBox, { borderLeftWidth: 1, borderColor: '#eee' }]}>
                        <SkeletonItem w={Responsive.size.wp(20)} h={Responsive.fontSize[12]} />
                        <View style={{ marginTop: Responsive.spacing[8] }}>
                            <SkeletonItem w={Responsive.size.wp(15)} h={Responsive.fontSize[18]} />
                        </View>
                    </View>
                </View>

                <View style={{ marginBottom: Responsive.spacing[16] }}>
                    <SkeletonItem w={Responsive.size.wp(35)} h={Responsive.fontSize[18]} />
                </View>

                {/* 3. Grid Menu Skeleton */}
                <View style={styles.gridContainer}>
                    {[1, 2, 3, 4].map((i) => (
                        <View key={i} style={styles.card}>
                            <SkeletonItem
                                w={Responsive.size.wp(13)}
                                h={Responsive.size.wp(13)}
                                rd={Responsive.radius[16]}
                            />
                            <View style={{ marginTop: Responsive.spacing[16] }}>
                                <SkeletonItem w="80%" h={Responsive.fontSize[15]} />
                                <View style={{ marginTop: Responsive.spacing[8] }}>
                                    <SkeletonItem w="50%" h={Responsive.fontSize[12]} />
                                </View>
                            </View>
                        </View>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8F9FA' },
    header: {
        backgroundColor: '#1A237E',
        paddingHorizontal: Responsive.size.wp(6),
        paddingBottom: Responsive.size.hp(5),
        borderBottomLeftRadius: Responsive.radius[32],
        borderBottomRightRadius: Responsive.radius[32],
    },
    headerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    scrollContent: { padding: Responsive.size.wp(6) },
    statsContainer: {
        backgroundColor: '#fff',
        borderRadius: Responsive.radius[20],
        padding: Responsive.spacing[20],
        marginTop: Responsive.spacing[25],
        flexDirection: 'row',
        marginBottom: Responsive.spacing[28],
        elevation: 4,
    },
    statBox: { flex: 1, alignItems: 'center' },
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
    },
});

export default HomeSkeleton;