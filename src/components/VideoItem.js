import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { useTheme } from "contexts/ThemeProvider";
import { Video } from "expo-av";
import { useEffect, useRef } from "react";
import { Dimensions, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Avatar } from "react-native-elements";

const { height } = Dimensions.get('window');

export default function VideoItem({ item, isPlaying }) {
    const { theme } = useTheme();
    const tabBarHeight = useBottomTabBarHeight();
    const videoRef = useRef(null);
    const isFocused = useIsFocused(); // Utiliza useIsFocused para detectar si la pantalla está enfocada
    const navigation = useNavigation();
    const { videoURL, photoURL, displayName, uid } = item

    useEffect(() => {
        if (!isFocused && videoRef.current) { // Si la pantalla no está enfocada, pausa el video
            videoRef.current.pauseAsync();
        }
    }, [isFocused]);

    useEffect(() => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.playAsync();
            } else {
                videoRef.current.pauseAsync();
            }
        }
    }, [isPlaying]);

    const togglePlayPause = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pauseAsync();
            } else {
                videoRef.current.playAsync();
            }
            isPlaying = !isPlaying
        }
    };

    const navigateToAccount = () => {
        navigation.navigate('OtherAccountTab', { uid: uid, photoURL: photoURL, displayName: displayName });
    };

    return (
        <TouchableOpacity
            style={[styles.container, { height: height - tabBarHeight, backgroundColor: theme.homeBackground }]}
            activeOpacity={1} // Esto hace que no parpadee
            onPress={togglePlayPause}>
            <Video
                ref={videoRef}
                source={{ uri: videoURL }}
                style={styles.video}
                resizeMode="contain"
                shouldPlay={isPlaying}
                isLooping
                useNativeControls={false} />
            <View style={styles.userProfile}>
                <Pressable onPress={navigateToAccount} style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 10
                }}>
                    <Avatar
                        size={'small'}
                        rounded
                        source={{ uri: photoURL }} />
                    <Text style={[styles.userName, { color: theme.homeUserTextColor }]}>{displayName}</Text>
                </Pressable>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        overflow: 'hidden',
        position: 'relative',
    },
    video: {
        height: height,
        width: '100%',
    },
    userProfile: {
        position: 'absolute',
        alignItems: 'center',
        width: '100%',
        bottom: 0,
        padding: 25,
        gap: 10,
        flexDirection: 'row'
    },
    userName: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        // textShadowColor: 'black', // Color de la sombra
        // textShadowOffset: { width: -1, height: 1 }, // Desplazamiento de la sombra
        // textShadowRadius: 5 // Radio de la sombra
    }
});