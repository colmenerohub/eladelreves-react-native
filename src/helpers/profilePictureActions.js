
import * as ImagePicker from 'expo-image-picker';
import { ActionSheetIOS, Alert, Platform } from 'react-native';

export const handleOpenActionSheet = async () => {
    let uri = '';
    return new Promise((resolve, reject) => {
        if (Platform.OS === 'ios') {
            ActionSheetIOS.showActionSheetWithOptions(
                {
                    options: ['Cancel', 'Tomar Fotografía', 'Seleccionar imagen de la galería'],
                    cancelButtonIndex: 0,
                },
                async buttonIndex => {
                    if (buttonIndex === 1) {
                        uri = await handleTakePhoto();
                    } else if (buttonIndex === 2) {
                        uri = await handleSelectPhoto();
                    }
                    resolve(uri);
                }
            );
        } else {
            Alert.alert(
                "Seleccione una opción",
                "",
                [
                    {
                        text: "Tomar Foto",
                        onPress: async () => {
                            uri = await handleTakePhoto();
                            resolve(uri);
                        }
                    },
                    {
                        text: "Abrir Galería",
                        onPress: async () => {
                            uri = await handleSelectPhoto();
                            resolve(uri);
                        }
                    },
                    {
                        text: "Cancel",
                        style: "cancel",
                        onPress: () => resolve(uri)
                    }
                ],
                { cancelable: true }
            );
        }
    });
};

const handleSelectPhoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
        alert('Sorry, we need access to your library to make this work!');
    } else {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            return result.assets[0].uri
        } else {
            Alert.alert('Error', 'You did not select any image.');
        }
    }
};

const handleTakePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
    } else {
        let result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            return result.assets[0].uri
        } else {
            Alert.alert('Error', 'You did not take any photo.');
        }
    }
};