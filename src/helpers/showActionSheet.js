import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import { ActionSheetIOS, Alert, Platform } from 'react-native';
import { uploadMediaFile } from "services/Videos";

export const showActionSheet = (navigation) => {
    if (Platform.OS === 'ios') {
        ActionSheetIOS.showActionSheetWithOptions(
            {
                options: ['Cancel', 'Grabar Video', 'Seleccionar video la galería',],
                cancelButtonIndex: 0,
            },
            buttonIndex => {
                handleActionSheetOption(buttonIndex, navigation)
            }
        );
    } else {
        Alert.alert(
            "Seleccione una opción",
            "",
            [
                {
                    text: "Tomar Foto",
                    onPress: () => handleActionSheetOption(1, navigation)
                },
                {
                    text: "Abrir Galería",
                    onPress: () => handleActionSheetOption(2, navigation)
                },
                {
                    text: "Cancel",
                    style: "cancel",
                    onPress: () => handleActionSheetOption(0, navigation)
                }
            ],
            { cancelable: true }
        );
    }
}

const handleActionSheetOption = async (buttonIndex, navigation) => {
    if (buttonIndex === 1) {
        let { statusCamera } = await ImagePicker.requestCameraPermissionsAsync();
        if (statusCamera !== 'granted') {
            const { status } = await ImagePicker.requestCameraPermissionsAsync();
            if (status !== 'granted') {
                alert('Sorry, we need camera roll permissions to make this work!');
                return;
            }
            statusCamera = status;
        }
        handleMediaSelection(ImagePicker.launchCameraAsync, 'You did not record any video.', navigation);
    } else if (buttonIndex === 2) {
        let { status } = await MediaLibrary.requestPermissionsAsync();
        if (status !== 'granted') {
            const { status: newStatus } = await MediaLibrary.requestPermissionsAsync();
            if (newStatus !== 'granted') {
                Alert.alert('Error', 'Permission to access media library was denied.');
                return;
            }
            status = newStatus;
        }
        handleMediaSelection(ImagePicker.launchImageLibraryAsync, 'You did not select any video.', navigation);
    }
};

const handleMediaSelection = async (launchFunction, errorMessage, navigation) => {
    let result = await launchFunction({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
    });

    if (!result.canceled) {
        const videoUri = result.assets[0].uri;
        const response = await fetch(videoUri);
        const blob = await response.blob();
        Alert.alert('Alert Title', "Subiendo...");
        const downloadURL = await uploadMediaFile(blob, 'videos');
        if (downloadURL) {
            Alert.alert(
                'Success',
                'Video uploaded successfully.',
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
    } else {
        Alert.alert('Error', errorMessage);
    }
};