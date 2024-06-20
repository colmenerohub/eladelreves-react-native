import { auth, db } from "@config/firebase-config";
import { useNavigation } from "@react-navigation/native";
import { useUser } from "contexts/AuthenticatedUserProvider";
import { useTheme } from "contexts/ThemeProvider";
import { addDoc, collection, deleteDoc, doc, getDocs, onSnapshot, orderBy, query, updateDoc, where } from "firebase/firestore";
import { useEffect, useLayoutEffect, useState } from "react";
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Avatar } from "react-native-elements";
import { getUserById } from "services/Auth";

export default function MessagesScreen({ navigation }) {
    const { theme } = useTheme();
    const [users, setUsers] = useState([]);
    const [chats, setChats] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [filter, setFilter] = useState('');
    const { user } = useUser()
    const currentUserUID = user.uid;
    const nav = useNavigation();

    // Fetch users from Firebase
    useLayoutEffect(() => {
        const fetchUsers = () => {
            const collectionRef = collection(db, 'users');
            const q = query(collectionRef, where('uid', '!=', currentUserUID));
            return onSnapshot(q, snapshot => {
                const newUsers = snapshot.docs.map(doc => ({
                    displayName: doc.data().displayName,
                    photoURL: doc.data().photoURL,
                    uid: doc.data().uid,
                }));
                setUsers(newUsers);
            });
        };
        const unsubscribe = fetchUsers();
        return () => unsubscribe();
    }, [currentUserUID]);

    // Fetch chats from Firebase
    useLayoutEffect(() => {
        const fetchChats = () => {
            const collectionRef = collection(db, 'chats');
            const q = query(collectionRef,
                orderBy('lastMessageTime', 'desc')
            );
            return onSnapshot(q, async (snapshot) => {
                if (!snapshot || !snapshot.docs) {
                    console.error('Snapshot is undefined or has no docs');
                    return;
                }

                const chatPromises = snapshot.docs.map(async (doc) => {
                    const chatData = doc.data();
                    let users = chatData.users;

                    if (users[1].uid === currentUserUID) {
                        [users[0], users[1]] = [users[1], users[0]]; // Swap if current user is second
                    }

                    const user0 = await getUserById(users[0].uid);
                    const user1 = await getUserById(users[1].uid);

                    return {
                        docID: doc.id,
                        users: [user0, user1],
                        lastMessageTime: chatData.lastMessageTime ? chatData.lastMessageTime.toDate() : '',
                        lastMessageText: chatData.lastMessageText,
                        lastMessageUserUID: chatData.lastMessageUserUID,
                        isRead: chatData.isRead
                    };
                });

                const chats = await Promise.all(chatPromises);
                const filteredChats = chats.filter(chat => chat.users[0].uid === currentUserUID);

                setChats(filteredChats);
            });
        };

        const unsubscribe = fetchChats();
        return () => unsubscribe();
    }, [currentUserUID]);

    // Filter users not in chats
    useEffect(() => {
        const chatUserUIDs = new Set(chats.map(chat => chat.users[1].uid));
        const newFilteredUsers = users.filter(user => !chatUserUIDs.has(user.uid));
        setFilteredUsers(newFilteredUsers);
    }, [users, chats]);

    // Update the filter text in the header
    useEffect(() => {
        nav.setOptions({
            headerStyle: {
                backgroundColor: theme.chatsBackgroundColor, // Cambia el color de fondo del header
            },
            headerTintColor: theme.chatsTitleColor,
            headerSearchBarOptions: {
                placeholder: "Buscar",
                onChangeText: event => setFilter(event.nativeEvent.text),
                barTintColor: '#74AD74',
                headerIconColor: theme.chatsTitleColor,
            },
        });
    }, [nav, theme]);

    const deleteChat = (docID, users) => {
        Alert.alert(
            "Confirmar eliminación",
            "¿Estás seguro de que deseas eliminar este video?",
            [
                {
                    text: "Cancelar",
                    style: "cancel"
                },
                {
                    text: "Eliminar",
                    onPress: async () => {
                        try {
                            const chatDocRef = doc(db, 'chats', docID);

                            await deleteDoc(chatDocRef);
                            console.log('Chat eliminado exitosamente');

                            const messagesQuerySnapshot = await getDocs(query(
                                collection(db, 'messages'),
                                where('messageTo', 'in', [users[0].uid, users[1].uid]),
                                where('user._id', 'in', [users[0].uid, users[1].uid])
                            ))

                            messagesQuerySnapshot.forEach((doc) => {
                                deleteDoc(doc.ref);
                            });

                            console.log('Mensajes asociados eliminados exitosamente');
                        } catch (error) {
                            console.error('Error al eliminar el chat y los mensajes asociados: ', error);
                        }
                    },
                    style: "destructive"
                }
            ],
            { cancelable: true }
        );
    }

    const renderChatItem = ({ item }) => {
        const itemData = item.users[1].displayName?.toUpperCase();
        const textData = filter?.toUpperCase();
        if (itemData?.includes(textData)) {
            return (
                <TouchableOpacity onLongPress={() => { deleteChat(item.docID, item.users) }} onPress={async () => {
                    navigation.navigate('Chat', {
                        chat: {
                            ...item,
                            lastMessageTime: item.lastMessageTime === '' ? item.lastMessageTime : item.lastMessageTime?.toISOString()
                        }
                    })
                    if (item.lastMessageUserUID !== currentUserUID) {
                        const chatRef = doc(db, 'chats', item.docID);
                        await updateDoc(chatRef, { isRead: true });
                    }
                }}>
                    <View style={styles.userInfo}>
                        <View style={styles.userImgWrapper}>
                            <Avatar rounded source={{ uri: item.users[1].photoURL }} size={'medium'} />
                        </View>
                        <View style={styles.textSection}>
                            <View style={styles.userInfoText}>
                                <Text numberOfLines={1} ellipsizeMode="tail" style={[styles.userName, { color: !item.isRead && item.lastMessageUserUID !== currentUserUID ? '#74AD74' : theme.chatsUserNameColor }]}>{item.users[1].displayName}</Text>
                                <Text style={[styles.postTime, { color: !item.isRead && item.lastMessageUserUID !== currentUserUID ? '#74AD74' : theme.chatsLastMessageDateColor }]}>{item.lastMessageTime.toLocaleString()}</Text>
                            </View>
                            {
                                item.lastMessageText !== undefined
                                    ? <Text numberOfLines={2} ellipsizeMode="tail" style={[styles.messageText, { color: theme.chatsLastMessageTextColor }]}>
                                        {(item.lastMessageUserUID === currentUserUID ? 'usted: ' : '') + item.lastMessageText}
                                    </Text>
                                    : <Text numberOfLines={2} ellipsizeMode="tail" style={[styles.messageText, { color: '#74AD74', fontStyle: 'italic' }]} >
                                        {(item.lastMessageUserUID === currentUserUID ? 'usted: ' : '') + (item.lastMessageText !== undefined ? item.lastMessageText : 'enviar primer mensaje')}
                                    </Text>
                            }

                        </View>
                    </View>
                </TouchableOpacity >
            );
        }
        return null;
    };

    const renderUserItem = ({ item }) => {
        const itemData = item.displayName?.toUpperCase();
        const textData = filter?.toUpperCase();
        if (itemData.includes(textData)) {
            return (
                <TouchableOpacity onPress={() => createChat(item)}>
                    <View style={styles.userInfo}>
                        <View style={styles.userImgWrapper}>
                            <Avatar rounded source={{ uri: item.photoURL }} size={'medium'} />
                        </View>
                        <View style={styles.textSection}>
                            <View style={styles.userInfoText}>
                                <Text numberOfLines={1} ellipsizeMode="tail" style={[styles.userName, { color: theme.chatsUserNameColor }]}>{item.displayName}</Text>
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
            );
        }
        return null;
    };

    const createChat = (user) => {
        const user0 = {
            uid: user.uid
        };
        const user1 = {
            uid: auth?.currentUser?.uid
        };
        const users = [user0, user1]
        console.log('CREATE CHAT');
        addDoc(collection(db, 'chats'), {
            users,
            lastMessageTime: '',
            isRead: false
        }).then(docRef => {
            // Obtener el chat recién creado de la base de datos
            // const newChat = {
            //     chatID: docRef.id,
            //     users,
            //     lastMessageTime: ''
            // };

            // // Navegar a la pantalla de chat con el nuevo chat
            // navigation.navigate('Chat', {
            //     chat: newChat
            // });
        }).catch(error => {
            console.error("Error al crear el chat: ", error);
        });
    }

    const [isRefreshing, setIsRefreshing] = useState(false);

    const handleRefresh = async () => {
        setIsRefreshing(true);
        navigation.reset({
            index: 0,
            routes: [{ name: 'ChatsTab' }]
        });
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.chatsBackgroundColor }]} >
            <FlatList
                contentInsetAdjustmentBehavior="automatic"
                style={styles.container}
                data={chats}
                refreshing={isRefreshing}
                onRefresh={handleRefresh}
                keyExtractor={item => item.docID}
                renderItem={renderChatItem}
            />
            {
                filter !== '' && (
                    <>
                        <Text style={[{ color: theme.chatsUserNameColor }, styles.createChatText]}>Crear chat</Text>
                        <FlatList
                            contentInsetAdjustmentBehavior="automatic"
                            style={styles.container}
                            data={filteredUsers}
                            keyExtractor={item => item.uid}
                            renderItem={renderUserItem}
                        />
                    </>
                )
            }
        </View >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingLeft: 20,
        paddingRight: 20,
        width: '100%'
    },
    userInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    userImgWrapper: {
        paddingTop: 10,
    },
    userImg: {
        width: 50,
        height: 50,
        borderRadius: 25
    },
    textSection: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        padding: 15,
        paddingLeft: 0,
        marginLeft: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#cccccc'
    },
    userInfoText: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    userName: {
        fontSize: 14,
        flexShrink: 1,
        fontWeight: 'bold',
    },
    postTime: {
        fontSize: 12
    },
    messageText: {
        fontSize: 14,
        fontStyle: 'italic'
    },
    createChatText: {
        fontSize: 20,
    },
});