import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MessagesScreen from '@screens/MessagesScreen';

const Stack = createNativeStackNavigator();

export default function ChatStack() {
    return (
        <Stack.Navigator initialRouteName="Messages">
            <Stack.Screen
                name="Messages"
                component={MessagesScreen}
                options={{
                    title: "Chats",
                    headerShown: true,
                    headerLargeTitle: true,
                }}
            />
        </Stack.Navigator>
    );
}