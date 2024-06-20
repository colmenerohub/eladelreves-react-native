import { auth, db } from '@config/firebase-config';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from 'contexts/ThemeProvider';
import { addDoc, collection, doc, onSnapshot, orderBy, query, updateDoc } from 'firebase/firestore';
import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { ImageBackground, LogBox, View } from "react-native";
import { Bubble, GiftedChat, Send } from "react-native-gifted-chat";
import { useSafeAreaInsets } from 'react-native-safe-area-context';

LogBox.ignoreLogs([
    'Warning: Avatar: Support for defaultProps will be removed from function components in a future major release. Use JavaScript default parameters instead.'
]);

export default function ChatScreen() {
    const route = useRoute();
    const [messages, setMessages] = useState([]);
    const insets = useSafeAreaInsets();
    const chat = { ...route.params.chat };
    if (chat.lastMessageTime) {
        chat.lastMessageTime = new Date(chat.lastMessageTime);
    }
    const currentUserUID = auth?.currentUser?.uid;
    const otherUserUID = chat.users[1].uid;
    const { theme } = useTheme();
    const [lastMessageUserUID, setLastMessageUserUID] = useState(chat.lastMessageUserUID || '');
    const nav = useNavigation();

    useEffect(() => {
        nav.setOptions({
            headerStyle: {
                backgroundColor: theme.chatsBackgroundColor, // Cambia el color de fondo del header
            },
            headerTintColor: theme.chatsTitleColor
        });
    }, [theme]);

    useLayoutEffect(() => {
        const collectionRef = collection(db, 'messages');
        const q = query(collectionRef, orderBy('createdAt', 'desc'));

        const unsubscribe = onSnapshot(q, snapshot => {
            const filteredMessages = snapshot.docs
                .map(doc => ({
                    _id: doc.id,
                    createdAt: doc.data().createdAt.toDate(),
                    text: doc.data().text,
                    user: doc.data().user,
                    messageTo: doc.data().messageTo,
                }))
                .filter(message =>
                    (message.user._id === currentUserUID && message.messageTo === otherUserUID) ||
                    (message.user._id === otherUserUID && message.messageTo === currentUserUID)
                );

            console.log('lastMessageUserUID', lastMessageUserUID);
            console.log('currentUserUID', currentUserUID);
            if (lastMessageUserUID && lastMessageUserUID != currentUserUID) {
                setUnreadChat(true)
            }

            setMessages(filteredMessages);
        });
        return () => unsubscribe();
    }, []);

    const setUnreadChat = async (value) => {
        console.log('ISREAD ', value);
        const docRef = doc(db, "chats", chat.docID);
        await updateDoc(docRef, {
            isRead: value
        });
    };

    const onSend = useCallback(async (messages = []) => {
        setMessages(prevMessages => GiftedChat.append(prevMessages, messages));

        // Ejecutar setLastMessageUserUID y asegurarse que se complete antes de continuar
        await new Promise(resolve => {
            setLastMessageUserUID(currentUserUID);
            resolve();
        });

        const { _id, createdAt, text, user } = messages[0];
        const messageTo = otherUserUID;

        // Añadir el mensaje a la colección de Firestore
        await addDoc(collection(db, 'messages'), {
            _id,
            createdAt,
            text,
            user,
            messageTo
        });

        // Actualizar el último mensaje en el chat
        updateLastMessageOnChat(messages[0]);
        setUnreadChat(false);
    }, []);


    const updateLastMessageOnChat = async (lastMessage) => {
        const docRef = doc(db, "chats", chat.docID);
        await updateDoc(docRef, {
            lastMessageText: lastMessage.text,
            lastMessageTime: lastMessage.createdAt,
            lastMessageUserUID: lastMessage.user._id
        });
    };

    const renderBubble = (props) => (
        <Bubble
            {...props}
            wrapperStyle={{
                right: { backgroundColor: '#74AD74' },
                left: { backgroundColor: '#74AD74' }
            }}
            textStyle={{
                right: { color: 'white' },
                left: { color: 'white' }
            }}
        />
    );

    const renderSend = (props) => (
        <Send {...props}>
            <View>
                <Ionicons
                    name="send-sharp"
                    size={32}
                    color={'#74AD74'}
                    style={{ marginBottom: 5, marginRight: 5 }}
                />
            </View>
        </Send>
    );

    const scrollToBottomComponent = () => (
        <Ionicons name="arrow-down" size={22} color={'blue'} />
    );

    return (
        <ImageBackground
            source={theme.theme === 'light' ? require('@assets/images/pattern.jpg') : require('@assets/images/pattern-dark.jpg')}
            style={{ flex: 1, paddingBottom: insets.bottom }}
        >
            <GiftedChat
                messages={messages}
                onSend={messages => onSend(messages)}
                user={{ _id: auth?.currentUser?.uid }}
                renderBubble={renderBubble}
                renderSend={renderSend}
                renderAvatar={null}
                showUserAvatar={false}
                showAvatarForEveryMessage={false}
                scrollToBottom
                placeholder='Escribe un mensaje...'
                timeFormat="HH:mm"
                scrollToBottomComponent={scrollToBottomComponent}
                timeTextStyle={{
                    right: { color: 'white' },
                    left: { color: 'white' }
                }}
            />
        </ImageBackground>
    );
}
