import { FontAwesome6 } from '@expo/vector-icons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useFocusEffect, useRoute } from '@react-navigation/native';
import NoVideos from "components/NoVideos";
import { storage } from 'config/firebase-config';
import { useUser } from "contexts/AuthenticatedUserProvider";
import { useTheme } from "contexts/ThemeProvider";
import { Video } from "expo-av";
import { deleteObject, ref } from 'firebase/storage';
import { handleOpenActionSheet } from "helpers/profilePictureActions";
import { useCallback, useRef, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import ActionSheet from 'react-native-actions-sheet';
import { Avatar } from "react-native-elements";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { removeOldProfilePhotos, uploadProfilePhoto } from 'services/Auth';
import { getVideosByUser, uploadMediaFile } from "services/Videos";

const VIDEOS_PER_PAGE = 9;

export default function AccountScreen({ navigation }) {
    const route = useRoute();
    const { user: currentUser, handleLogout } = useUser();
    const { theme, toggleTheme } = useTheme();
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [visibleVideos, setVisibleVideos] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const actionSheetRef = useRef(null);
    const insets = useSafeAreaInsets();
    const [user, setUser] = useState(currentUser);
    const [isAccountScreen, setIsAccountScreen] = useState(route.name === 'AccountTab');
    const [isRefreshing, setIsRefreshing] = useState(false);

    useFocusEffect(
        useCallback(() => {
            const { uid, photoURL, displayName } = route.params || {};
            const newUser = uid ? { uid, photoURL, displayName } : currentUser;
            setUser(newUser);
            setIsAccountScreen(route.name === 'Account');

            const fetchVideos = async () => {
                setLoading(true);
                try {
                    const files = await getVideosByUser(newUser.uid);
                    setVideos(files);
                    setVisibleVideos(files.slice(0, VIDEOS_PER_PAGE));
                } catch (error) {
                    console.error('Error fetching videos:', error);
                } finally {
                    setLoading(false);
                }
            };

            fetchVideos();
        }, [route.params, currentUser])
    );

    const handleUploadPhoto = async () => {
        try {
            const uri = await handleOpenActionSheet();
            if (uri) {
                const response = await fetch(uri);
                const blob = await response.blob();

                await removeOldProfilePhotos(user);

                Alert.alert('Alert Title', "Subiendo...");
                const downloadURL = await uploadMediaFile(blob, 'images');
                const result = await uploadProfilePhoto(downloadURL, user);
                if (result) {
                    Alert.alert(
                        'Success',
                        'Photo uploaded successfully.',
                        [
                            {
                                text: 'OK',
                                onPress: () => {
                                    navigation.reset({
                                        index: 0,
                                        routes: [{ name: 'AccountTab' }]
                                    });
                                }
                            }
                        ]
                    );
                }
            }
        } catch (error) {
            console.error('Error uploading photo:', error);
            Alert.alert('Error', 'Failed to upload photo.');
        }
    };

    const handleDeletePress = (item) => {
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
                    onPress: () => deleteVideoFromStorage(item),
                    style: "destructive"
                }
            ],
            { cancelable: true }
        );
    };

    const deleteVideoFromStorage = async (videoUri) => {
        const videoRef = ref(storage, videoUri);

        try {
            await deleteObject(videoRef);
            Alert.alert(
                'Success',
                'Video deleted successfully.',
                [
                    {
                        text: 'OK',
                        onPress: () => {
                            navigation.reset({
                                index: 0,
                                routes: [{ name: 'AccountTab' }]
                            });
                        }
                    }
                ]
            );
        } catch (error) {
            console.error("Error al eliminar el video: ", error);
        }
    };

    const navigateToEditAccount = () => {
        navigation.navigate('EditAccountTab', { uid: user.uid, displayName: user.displayName, email: user.email });
        actionSheetRef.current?.hide()
    };

    const handleRefresh = async () => {
        setIsRefreshing(true);
        navigation.reset({
            index: 0,
            routes: [{ name: 'Account' }]
        });
    };

    const handleLoadMore = () => {
        const nextPage = currentPage + 1;
        const nextVideos = videos.slice(0, nextPage * VIDEOS_PER_PAGE);
        setVisibleVideos(nextVideos);
        setCurrentPage(nextPage);
    };

    const renderHeader = () => (
        <View style={styles.profilePhotoContainer}>
            {isAccountScreen &&
                <Pressable onPress={() => actionSheetRef.current?.show()} style={styles.editPhotoIcon} >
                    <FontAwesome name="gear" size={24} style={[{ color: theme.accountEditPhotoIconColor }]} />
                </Pressable>}
            <Avatar
                size={'xlarge'}
                rounded
                source={{
                    uri: user?.photoURL
                }}
            />
            <Text style={[styles.displayName, { color: theme.accountNameColor }]} >{user.displayName}</Text>
            <Text style={[styles.videosCount, { color: theme.videosCountColor }]} >Ha{isAccountScreen ? 's' : ''} subido {videos.length} vídeos</Text>
            {isAccountScreen &&
                <ActionSheet ref={actionSheetRef} >
                    <Pressable style={[styles.actionSheetOption, { backgroundColor: theme.accountThemeActionSheetOptionBackgroundColor }]} onPress={() => { toggleTheme(!theme) }}>
                        <Text style={[styles.actionSheetText, { color: theme.accountThemeActionSheetOptionColor }]}>Tema</Text>
                    </Pressable>
                    <Pressable style={[styles.actionSheetOption, { backgroundColor: theme.accountActionSheetOptionBackgroundColor }]} onPress={navigateToEditAccount}>
                        <Text style={[styles.actionSheetText, { color: theme.accountActionSheetOptionColor }]}>Editar nombre de usuario</Text>
                    </Pressable>
                    <Pressable style={[styles.actionSheetOption, { backgroundColor: theme.accountActionSheetOptionBackgroundColor }]} onPress={handleUploadPhoto}>
                        <Text style={[styles.actionSheetText, { color: theme.accountActionSheetOptionColor }]}>Cambiar foto de perfil</Text>
                    </Pressable>
                    <Pressable style={[styles.actionSheetOption, { backgroundColor: '#c40e0e' }]} onPress={handleLogout}>
                        <Text style={[styles.actionSheetText, { color: theme.accountActionSheetOptionColor }]}>Cerrar sesión</Text>
                    </Pressable>
                </ActionSheet>}
        </View>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.loginBackgroundColor }]}>
            {loading ? (
                <ActivityIndicator size="large" color={theme.accountEditPhotoIconColor} />
            ) : (
                <FlatList
                    style={{ width: '100%' }}
                    data={visibleVideos}
                    keyExtractor={(item) => item}
                    refreshing={isRefreshing}
                    onRefresh={handleRefresh}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => (
                        <View style={{ width: "33%", height: 200, position: 'relative' }}>
                            <Video
                                source={{ uri: item }}
                                rate={1.0}
                                volume={1.0}
                                isMuted={true}
                                resizeMode="cover"
                                isLooping
                                style={{ width: "100%", height: 200 }}
                                useNativeControls
                            />
                            {isAccountScreen && (
                                <Pressable onPress={() => { handleDeletePress(item) }} style={styles.deleteVideoIcon} >
                                    <FontAwesome6 name="trash" size={18} style={[{ color: theme.accountEditPhotoIconColor, width: 16, margin: 'auto' }]} />
                                </Pressable>
                            )}
                        </View>
                    )}
                    numColumns={3}
                    contentContainerStyle={{ gap: 2 }}
                    columnWrapperStyle={{ gap: 2 }}
                    ListHeaderComponent={renderHeader}
                    ListEmptyComponent={isAccountScreen ? NoVideos : <Text style={{ color: theme.accountNameColor, textAlign: 'center', fontSize: 60 }}>:(</Text>}
                    ListFooterComponent={
                        visibleVideos.length < videos.length ? (
                            <Pressable onPress={handleLoadMore} style={styles.loadMoreButton}>
                                <Text style={styles.loadMoreText}>Cargar más</Text>
                            </Pressable>
                        ) : null
                    }
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    profilePhotoContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        margin: 'auto',
        marginTop: 50,
        position: 'relative',
        width: 200,
    },
    editPhotoIcon: {
        position: 'absolute',
        top: 0,
        right: 0,
    },
    deleteVideoIcon: {
        position: 'absolute',
        top: 0,
        right: 0,
        left: 0,
        width: 'fit-content',
        margin: 'auto',
        marginTop: 10,
    },
    displayName: {
        marginTop: 15,
        fontSize: 15, // Cambiado a número
        fontWeight: 'bold',
    },
    videosCount: {
        marginTop: 10,
        marginBottom: 40,
        fontSize: 20, // Cambiado a número
    },
    firstVideoText: {
        marginTop: 50,
        textAlign: 'center',
        fontSize: 30, // Cambiado a número
    },
    textButton: {
        fontSize: 20, // Cambiado a número
        color: 'white'
    },
    actionSheetOption: {
        padding: 15,
        borderTopWidth: 1,
        borderTopColor: '#8a8a8a',
        alignItems: 'center',
    },
    actionSheetText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    loadMoreButton: {
        padding: 15,
        alignItems: 'center',
        backgroundColor: '#74AD74',
        borderRadius: 5,
        marginVertical: 10,
    },
    loadMoreText: {
        color: 'white',
        fontSize: 16,
    }
});
