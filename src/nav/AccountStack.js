import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AccountScreen from 'screens/AccountScreen';
import EditAccountScreen from 'screens/EditAccountScreen';

const Stack = createNativeStackNavigator();

export default function AccountStack() {
    return (
        <Stack.Navigator initialRouteName="Account">
            <Stack.Screen
                name="Account"
                component={AccountScreen}
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="EditAccountTab"
                component={EditAccountScreen}
                options={{
                    headerShown: false,
                }}
            />
        </Stack.Navigator>
    );
}