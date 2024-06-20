import ReelsComponent from '@components/ReelsComponent';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ReelsScreen() {

    const tabBarHeight = useBottomTabBarHeight();
    return (
        <SafeAreaView style={styles.container}>
            <ReelsComponent />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
    },
})