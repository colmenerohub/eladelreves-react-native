import { Ionicons } from '@expo/vector-icons';
import { useTheme } from 'contexts/ThemeProvider';
import { StyleSheet, Text, View } from 'react-native';

export const NoVideos = () => {
    const { theme } = useTheme();

    return (
        <View style={styles.container}>
            <Text style={[styles.firstVideoText, { color: theme.accountNameColor }]}>¡Sube tu primer video!</Text>
            <Ionicons name="arrow-down" size={60} color={theme.accountNameColor} />
        </View>
    )
}

export default NoVideos

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        gap: 32
    },
    firstVideoText: {
        marginTop: 50,
        textAlign: 'center',
        fontSize: 30,
    }
});