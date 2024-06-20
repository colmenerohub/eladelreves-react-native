import { createNativeStackNavigator } from '@react-navigation/native-stack';
import VideosScreen from '@screens/VideosScreen';
import AccountScreen from 'screens/AccountScreen';

const Stack = createNativeStackNavigator();

export default function HomeStack() {
    return (
        <Stack.Navigator initialRouteName="Home">
            <Stack.Screen
                name="Home"
                component={VideosScreen}
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="OtherAccountTab"
                component={AccountScreen}
                options={{
                    headerShown: false,
                }}
            />
        </Stack.Navigator>
    );
}