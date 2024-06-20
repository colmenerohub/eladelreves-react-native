import { useRoute } from '@react-navigation/native'
import { FormikInput } from 'components/FormikInput'
import { auth, db } from 'config/firebase-config'
import { useTheme } from 'contexts/ThemeProvider'
import { updateProfile } from 'firebase/auth'
import { collection, getDocs, query, updateDoc, where } from 'firebase/firestore'
import { Formik } from 'formik'
import { Alert, Image, Keyboard, SafeAreaView, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import Icon from 'react-native-vector-icons/SimpleLineIcons'
import { isDisplayNameUnique } from 'services/Auth'
import { signUpValidationSchema } from 'src/schemas/signUpValidationSchema'

export default function EditAccountScreen({ navigation }) {
    const route = useRoute();
    const { uid, displayName, email } = route.params;
    const { theme } = useTheme();
    const isDarkMode = theme.theme === 'dark';
    const logoImg = isDarkMode ? require('@assets/images/yellow-logo-dark.png') : require('@assets/images/yellow-logo.png');

    const initialValues = {
        uid: uid,
        displayName: displayName,
        email: email,
    };

    const handleCreateAccount = async (values) => {
        if (values.displayName === initialValues.displayName || await isDisplayNameUnique(values.displayName)) {
            updateProfile(auth.currentUser, {
                displayName: values.displayName,
            })

            const usersCollectionRef = collection(db, 'users');
            const q = query(usersCollectionRef, where('uid', '==', initialValues.uid));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach(async (doc) => {
                console.log('db');
                await updateDoc(doc.ref, {
                    displayName: values.displayName
                });
            });

            Alert.alert('User edited')
            navigation.reset({
                index: 0,
                routes: [{ name: 'Account' }]
            });
        } else {
            Alert.alert('Nombre de usuario cogido')
        }
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <SafeAreaView style={[styles.container, { backgroundColor: theme.signUpBackgroundColor }]}>
                <Image source={logoImg} style={styles.logoImg} />
                <Formik
                    validationSchema={signUpValidationSchema}
                    validateOnChange={true}
                    initialValues={initialValues}
                    onSubmit={handleCreateAccount}
                >
                    {({ handleSubmit }) => (
                        <View style={styles.form}>
                            <FormikInput
                                inputStyle={{ color: theme.signUpInputTextColor }}
                                label='Nombre de usuario'
                                placeholder='Introduce tu nombre de usuario'
                                leftIcon={<Icon name='user' size={22} color={'#f5b942'} />}
                                name='displayName'
                            />
                            <TouchableOpacity style={[styles.button, { backgroundColor: '#f5b942' }]} onPress={handleSubmit}>
                                <Text style={[styles.textButton, { color: theme.signUpButtonTextColor }]}>Editar usuario</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </Formik>
            </SafeAreaView>
        </TouchableWithoutFeedback>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoImg: {
        height: 130,
        resizeMode: 'contain'
    },
    form: {
        width: '70%',
        marginTop: 50,
        gap: 15,
    },
    text: {
        fontSize: 16
    },
    textButton: {
        fontSize: 20,
    },
    underlinedText: {
        fontSize: 16,
        textDecorationLine: 'underline', // Aplica subrayado
    },
    button: {
        borderRadius: 30, // Añade esquinas redondeadas
        paddingHorizontal: 10, // Espaciado horizontal dentro del TextInput
        paddingVertical: 20,
        alignItems: 'center',
        justifyContent: 'center',
    }
})