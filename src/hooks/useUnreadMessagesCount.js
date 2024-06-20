import { auth, db } from 'config/firebase-config';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';

const useUnreadMessagesCount = () => {
    const [unreadChatsCount, setUnreadChatsCount] = useState(0);
    const userId = auth.currentUser.uid;

    useEffect(() => {
        const q = query(
            collection(db, 'chats'),
            where('isRead', '==', false),
            where('lastMessageUserUID', '!=', userId),
        );

        const unsubscribe = onSnapshot(q, querySnapshot => {
            const chatIds = new Set();
            querySnapshot.forEach(doc => {
                const chatData = doc.data();
                if (chatData.users.some(user => user.uid === userId)) {
                    chatIds.add(doc.id);
                }
            });
            setUnreadChatsCount(chatIds.size);
        });

        return () => unsubscribe();
    }, [userId]);
    return unreadChatsCount;
};

export default useUnreadMessagesCount;

// const useUnreadMessagesCount = () => {
//     const [unreadChatsCount, setUnreadChatsCount] = useState(0);
//     const userId = auth.currentUser.uid;

//     useEffect(() => {
//         const q = query(
//             collection(db, 'messages'),
//             where('messageTo', '==', userId),
//             where('isRead', '==', false)
//         );

//         const unsubscribe = onSnapshot(q, querySnapshot => {
//             const chatIds = new Set();
//             querySnapshot.forEach(doc => {
//                 const message = doc.data();
//                 chatIds.add(message.chatId);
//             });
//             setUnreadChatsCount(chatIds.size);
//         });

//         return () => unsubscribe();
//     }, [userId]);

//     return unreadChatsCount;