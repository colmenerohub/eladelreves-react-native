import { auth, db } from '@config/firebase-config';
import { storage } from 'config/firebase-config';
import { onAuthStateChanged, signOut, updateProfile } from 'firebase/auth';
import { collection, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { deleteObject, listAll, ref } from 'firebase/storage';

export function getCurrentUser() {
    const unsubscribe = onAuthStateChanged(auth,
        async authenticatedUser => {
            return authenticatedUser
        }
    )
    return () => unsubscribe();
}

export const logout = () => {
    signOut(auth).catch(err => console.error(err));
}

export const getUserById = async (userId) => {
    const usersCollectionRef = collection(db, 'users'); // Cambia 'users' al nombre de tu colección de usuarios
    const userQuery = query(usersCollectionRef, where('uid', '==', userId));

    try {
        const querySnapshot = await getDocs(userQuery);
        if (!querySnapshot.empty) {
            // Si se encuentra un usuario con el ID especificado
            const userData = querySnapshot.docs[0].data();
            return userData;
        } else {
            // Si no se encuentra ningún usuario con el ID especificado
            return null;
        }
    } catch (error) {
        console.error('Error fetching user:', error);
        return null;
    }
};

export const removeOldProfilePhotos = async (user) => {
    try {
        const storageRef = ref(storage, `images/${user.uid}`);
        const listResult = await listAll(storageRef);
        const deletePromises = listResult.items.map(itemRef => deleteObject(itemRef));
        await Promise.all(deletePromises);
    } catch (error) {
        console.error('Error al borrar fotos de perfil antiguas', error);
    }
}

export async function isDisplayNameUnique(displayName) {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('displayName', '==', displayName));
    const querySnapshot = await getDocs(q);
    return querySnapshot.empty;
}

export const uploadProfilePhoto = async (downloadURL, user) => {
    try {
        // Actualizar el perfil de Firebase Authentication
        await updateProfile(user, {
            photoURL: downloadURL
        });

        // Crear una consulta para encontrar el documento con el uid del usuario
        const usersCollectionRef = collection(db, 'users');
        const q = query(usersCollectionRef, where('uid', '==', auth.currentUser.uid));
        const querySnapshot = await getDocs(q);

        // Asumimos que hay un solo documento que coincide con el uid del usuario
        querySnapshot.forEach(async (doc) => {
            await updateDoc(doc.ref, {
                photoURL: downloadURL
            });
        });

        return true;
    } catch (error) {
        console.error('Error al actualizar el campo "photoURL":', error);
        return false;
    }
}