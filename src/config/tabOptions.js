import { Ionicons } from '@expo/vector-icons';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useUser } from 'contexts/AuthenticatedUserProvider';
import { useTheme } from 'contexts/ThemeProvider';
import { Platform, StyleSheet, View } from 'react-native';
import { Avatar } from 'react-native-elements';

export default function tabOptions({ route }) {
    const { theme } = useTheme();
    const { user } = useUser();

    return {
        tabBarStyle: {
            backgroundColor: theme.tabBarBackgroundColor,
            height: Platform.OS === 'ios' ? 90 : 60, // 70 para iPhone, 60 para Android
        },
        tabBarActiveTintColor: theme.tabBarActiveTintColor,
        tabBarInactiveTintColor: theme.tabBarInactiveTintColor,
        tabBarLabelStyle: {
            fontSize: 12,
        },
        tabBarBadgeStyle: {
            backgroundColor: 'red',
            fontSize: 9,
        },

        tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            switch (route.name) {
                case 'HomeTab':
                    iconName = focused ? 'home' : 'home-outline';
                    break;
                case 'WebTab':
                    return <MaterialCommunityIcons name="web" size={30} color={color} style={{ opacity: 0.8 }} />
                case 'UploadVideosTab':
                    return (
                        <View style={styles.iconContainer}>
                            <AntDesign name="pluscircle" size={45} color={theme.tabBarActiveTintColor} />
                        </View>)
                case 'ChatsTab':
                    iconName = focused ? 'chatbox' : 'chatbox-outline';
                    break;
                case 'AccountTab':
                    return (
                        <View style={styles.iconContainer}>
                            <Avatar
                                avatarStyle={focused ? { borderWidth: 2, borderColor: '#74AD74' } : ''}
                                size={'small'}
                                rounded
                                source={{
                                    uri: user?.photoURL || 'https://firebasestorage.googleapis.com/v0/b/urblink-2b58e.appspot.com/o/default-avatar.jpg?alt=media&token=8c9a463d-83e6-4503-a2ed-5f0ea77b3257'
                                }}
                            />
                        </View>)
                default:
                    iconName = 'help-circle-outline';
            }

            return (
                <View style={styles.iconContainer}>
                    <Ionicons name={iconName} size={30} color={color} />
                </View>)
        },

        headerShown: false,
    };
}

const styles = StyleSheet.create({
    iconContainer: {
        marginTop: 0,  // Ajusta este valor para cambiar el margen superior del icono
    },
});