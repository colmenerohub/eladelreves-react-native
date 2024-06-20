import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from 'contexts/ThemeProvider';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Avatar } from 'react-native-elements';
import AccountScreen from 'screens/AccountScreen';
import ChatScreen from 'screens/ChatScreen';
import TabStack from './TabStack';

const Stack = createNativeStackNavigator();

export default function RootStack() {
    const { theme } = useTheme();
    return (
        <Stack.Navigator initialRouteName="tabs">
            <Stack.Screen
                name="tabs"
                component={TabStack}
                options={{
                    headerShown: false
                }}
            />
            <Stack.Screen
                name="Chat"
                component={ChatScreen}
                options={({ navigation, route }) => ({
                    title: '',
                    headerBackTitleVisible: false,
                    headerTitle: () => {
                        const { uid, displayName, photoURL } = route.params.chat.users[1]
                        return (
                            <View style={styles.container}>
                                <Pressable onPress={() => { navigation.navigate('ChatOtherAccountTab', { uid: uid, photoURL: photoURL, displayName: displayName }) }}
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        gap: 10
                                    }}>
                                    <Avatar
                                        size={'small'}
                                        rounded
                                        source={{ uri: photoURL }} />
                                    <Text numberOfLines={1} ellipsizeMode="tail" style={[styles.userText, { color: theme.chatsTitleColor }]}>{displayName}</Text>
                                </Pressable>
                            </View>
                        )
                    }
                })}
            />
            <Stack.Screen
                name="ChatOtherAccountTab"
                component={AccountScreen}
                options={({ navigation, route }) => ({
                    title: '',
                    headerBackTitleVisible: false,
                })}
            />
        </Stack.Navigator>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        gap: 10,
        alignItems: 'center',
        paddingRight: 50,
    },
    userText: {
        fontWeight: 'bold',
    }
})