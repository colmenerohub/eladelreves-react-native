import { auth, db, storage } from "@config/firebase-config";
import { collection, getDocs, query, where } from "firebase/firestore";
import { deleteObject, getDownloadURL, getMetadata, listAll, ref, uploadBytesResumable } from "firebase/storage";

export const uploadMediaFile = async (blob, path) => {
    try {
        const fileName = blob._data.name;
        const storageRef = ref(storage, `${path}/${auth.currentUser.uid}/${fileName}`);
        const uploadTask = uploadBytesResumable(storageRef, blob);

        return new Promise((resolve, reject) => {
            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log("Upload is " + progress.toFixed() + "% done");
                },
                (error) => {
                    console.error('Error during upload:', error);
                    reject(error);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref)
                        .then((downloadURL) => {
                            resolve(downloadURL);
                        })
                        .catch((error) => {
                            console.error('Error getting download URL:', error);
                            reject(error);
                        });
                }
            );
        });
    } catch (error) {
        console.error('Error al subir el archivo:', error);
    }
};

const fetchAllUsers = async () => {
    const collectionRef = collection(db, 'users');
    const q = query(collectionRef, where('uid', '!=', auth.currentUser.uid));
    const snapshot = await getDocs(q);
    const users = snapshot.docs.map(doc => ({
        displayName: doc.data().displayName,
        photoURL: doc.data().photoURL,
        uid: doc.data().uid,
    }));
    return users;
};


// This set will hold references to the videos that have already been shown
const shownVideos = new Set();

export const getRandomVideoFromRandomUser = async () => {
    try {
        const users = await fetchAllUsers();

        if (users.length === 0) {
            console.error('No hay usuarios disponibles.');
            return null;
        }

        let videoUrl = null;
        let randomUser = null;
        let userId = null;
        let attemptCount = 0;

        while (!videoUrl && attemptCount < 10) { // Add a safety limit to avoid infinite loop
            randomUser = users[Math.floor(Math.random() * users.length)];
            userId = randomUser.uid;

            const videosRef = ref(storage, `videos/${userId}`);
            const videoList = await listAll(videosRef);

            if (videoList.items.length === 0) {
                continue;
            }

            const availableVideos = videoList.items.filter(item => !shownVideos.has(item.fullPath));

            if (availableVideos.length === 0) {
                continue;
            }

            const randomVideoRef = availableVideos[Math.floor(Math.random() * availableVideos.length)];
            videoUrl = await getDownloadURL(randomVideoRef);
            shownVideos.add(randomVideoRef.fullPath);
        }

        if (!videoUrl) {
            console.error('No hay videos disponibles o todos los videos ya han sido mostrados.');
            return null;
        }

        return {
            videoURL: videoUrl,
            photoURL: randomUser.photoURL,
            uid: userId,
            displayName: randomUser.displayName,
        };
    } catch (error) {
        console.error('Error al obtener un video al azar:', error);
        return null;
    }
};


export const getVideosByUser = async (id) => {
    try {
        const videosRef = ref(storage, `videos/${id}`);
        const videoList = await listAll(videosRef);

        const videosWithMetadata = await Promise.all(videoList.items.map(async (item) => {
            const url = await getDownloadURL(item);
            const metadata = await getMetadata(item);
            return { url, modified: metadata.updated };
        }));

        // Ordenar los videos por fecha de modificación más reciente
        const sortedVideos = videosWithMetadata.sort((a, b) => new Date(b.modified) - new Date(a.modified));

        // Retornar solo las URLs ordenadas
        return sortedVideos.map(video => video.url);
    } catch (error) {
        console.error('Error al obtener los videos:', error);
        return [];
    }
}

export const deleteVideo = async (videoUrl) => {
    const videoRef = ref(storage, videoUrl);
    try {
        await deleteObject(videoRef);
    } catch (error) {

    }
};