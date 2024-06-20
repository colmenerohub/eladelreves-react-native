export default {
    "expo": {
        "name": "eladelreves-react-native",
        "slug": "eladelreves-react-native",
        "version": "1.0.0",
        "orientation": "portrait",
        "icon": "./assets/images/icon.png",
        "userInterfaceStyle": "automatic",
        "splash": {
            "image": "./assets/images/splash.png",
            "resizeMode": "contain",
            "backgroundColor": "#FFFFFF"
        },
        "ios": {
            "supportsTablet": true,

            "infoPlist": {
                "NSCameraUsageDescription": "This app uses the camera to let users upload their profile pictures.",
                "NSPhotoLibraryUsageDescription": "This app needs access to your photo library to let you upload your profile pictures."
            }
        },
        "android": {
            "adaptiveIcon": {
                "foregroundImage": "./assets/images/adaptive-icon.png",
                "backgroundColor": "#ffffff"
            },
            "permissions": [
                "CAMERA",
                "INTERNET",
                "READ_EXTERNAL_STORAGE",
                "WRITE_EXTERNAL_STORAGE"
            ],
            "package": "com.eladelreves"
        },
        "web": {
            "favicon": "./assets/images/favicon.png"
        },
        "extra": {
            apiKey: process.env.EXPO_PUBLIC_API_KEY,
            authDomain: process.env.EXPO_PUBLIC_AUTH_DOMAIN,
            projectId: process.env.EXPO_PUBLIC_PROJECT_ID,
            storageBucket: process.env.EXPO_PUBLIC_STORAGE_BUCKET,
            messagingSenderId: process.env.EXPO_PUBLIC_MESSAGING_SENDER_ID,
            appId: process.env.EXPO_PUBLIC_APP_ID
        }
    }
}