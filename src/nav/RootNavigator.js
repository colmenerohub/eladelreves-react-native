import { useUser } from '@contexts/AuthenticatedUserProvider';
import { NavigationContainer } from '@react-navigation/native';
import { useTheme } from 'contexts/ThemeProvider';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import LoginStack from './LoginStack';
import RootStack from './RootStack';

export default function RootNavigator() {
    const { user } = useUser();
    const { theme } = useTheme()
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user !== undefined) {
            setLoading(false);
        }
    }, [user]);

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <NavigationContainer>
            {user ? <RootStack /> : <LoginStack />}
            <StatusBar style={theme.statusBarColor} />
        </NavigationContainer>
    );
}
