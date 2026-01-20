import { useRef, useCallback, useEffect } from 'react';
import { StatusBar, BackHandler, Platform } from 'react-native';

type Options = {
    sheetBarStyle?: 'light-content' | 'dark-content';
    screenBarStyle?: 'light-content' | 'dark-content';
    screenBackgroundColor?: string;
};

export function useSheetStatusBar(options?: Options) {
    const isSheetVisible = useRef(false);

    const {
        sheetBarStyle = 'light-content',
        screenBarStyle = 'dark-content',
        screenBackgroundColor = '#f6f7fb',
    } = options || {};

    const applySheetStatusBar = useCallback(() => {
        if (Platform.OS !== 'android') return;

        StatusBar.setTranslucent(true);
        StatusBar.setBackgroundColor('transparent', true);
        StatusBar.setBarStyle(sheetBarStyle, true);
    }, [sheetBarStyle]);

    const restoreStatusBar = useCallback(() => {
        if (Platform.OS !== 'android') return;

        StatusBar.setTranslucent(false);
        StatusBar.setBackgroundColor(screenBackgroundColor, true);
        StatusBar.setBarStyle(screenBarStyle, true);
    }, [screenBackgroundColor, screenBarStyle]);

    const onPresent = useCallback(() => {
        if (isSheetVisible.current) return;
        isSheetVisible.current = true;
        applySheetStatusBar();
    }, [applySheetStatusBar]);

    const onDismiss = useCallback(() => {
        if (!isSheetVisible.current) return;
        isSheetVisible.current = false;
        restoreStatusBar();
    }, [restoreStatusBar]);

    // Android back button handling
    useEffect(() => {
        if (Platform.OS !== 'android') return;

        const onBackPress = () => {
            if (isSheetVisible.current) {
                onDismiss();
                return true;
            }
            return false;
        };

        const subscription = BackHandler.addEventListener(
            'hardwareBackPress',
            onBackPress
        );

        return () => subscription.remove();
    }, [onDismiss]);

    return {
        onPresent,
        onDismiss,
        isSheetVisible,
    };
}
