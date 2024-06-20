import tabOptions from '@config/tabOptions';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import EmptyView from 'components/EmptyView';
import { showActionSheet } from 'helpers/showActionSheet';
import useUnreadMessagesCount from 'hooks/useUnreadMessagesCount';
import WebScreen from 'screens/WebScreen';
import AccountStack from './AccountStack';
import ChatStack from './ChatStack';
import HomeStack from './HomeStack';

const Tab = createBottomTabNavigator();

export default function TabStack() {
    const unreadChatsCount = useUnreadMessagesCount();

    return (
        <Tab.Navigator initialRouteName="HomeTab" screenOptions={tabOptions}>
            <Tab.Screen name="HomeTab" component={HomeStack} options={{ title: 'Home' }} />
            <Tab.Screen
                name="WebTab"
                options={{ title: 'Web' }}
                component={WebScreen}
            />
            <Tab.Screen name="UploadVideosTab" component={EmptyView} options={{ title: '', tabBarLabel: () => null }}
                listeners={({ navigation }) => ({
                    tabPress: (e) => {
                        e.preventDefault();
                        showActionSheet(navigation);
                    }
                })} />
            <Tab.Screen
                name="ChatsTab"
                component={ChatStack}
                options={({ route }) => ({
                    title: 'Chats',
                    tabBarBadge: unreadChatsCount > 0 ? unreadChatsCount : null
                })} />
            <Tab.Screen name="AccountTab" component={AccountStack} options={{ title: 'Cuenta' }} />
        </Tab.Navigator>
    );
}
