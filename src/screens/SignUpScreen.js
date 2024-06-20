import { auth, db } from '@config/firebase-config'
import { FormikInput } from 'components/FormikInput'
import { PasswordVisibilityIcon } from 'components/PasswordVisibilityIcon'
import { useTheme } from 'contexts/ThemeProvider'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import { Formik } from 'formik'
import { useState } from 'react'
import { Alert, Image, Keyboard, SafeAreaView, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import Icon from 'react-native-vector-icons/SimpleLineIcons'
import { isDisplayNameUnique } from 'services/Auth'
import { signUpValidationSchema } from 'src/schemas/signUpValidationSchema'

const initialValues = {
    displayName: '',
    email: '',
    password: '',
    passwordConfirmation: ''
};

export default function SignUpScreen({ navigation }) {
    const [showPassword, setShowPassword] = useState(true)

    const { theme } = useTheme();
    const isDarkMode = theme.theme === 'dark';
    const logoImg = isDarkMode ? require('@assets/images/logo-dark.png') : require('@assets/images/logo.png');

    const createUserInDatabase = (values) => {
        const { displayName, uid, email, photoURL } = values
        setDoc(doc(db, 'users', uid), {
            displayName,
            uid,
            email,
            photoURL
        })
    }

    const handleCreateAccount = async (values) => {
        if (await isDisplayNameUnique(values.displayName)) {
            if (values.password === values.passwordConfirmation) {
                createUserWithEmailAndPassword(auth, values.email, values.password)
                    .then((userCredential) => {
                        let user = userCredential.user
                        // Le pongo por defecto un avatar
                        updateProfile(user, {
                            displayName: values.displayName,
                            photoURL: 'https://firebasestorage.googleapis.com/v0/b/urblink-2b58e.appspot.com/o/default-avatar.jpg?alt=media&token=8c9a463d-83e6-4503-a2ed-5f0ea77b3257'
                        }).then(function () {
                            createUserInDatabase(user)
                        }).catch(function (err) {
                            // Error
                        });
                    })
                    .catch(err => {
                        console.log(err);
                        Alert.alert(err.message)
                    })
            } else {
                Alert.alert('Contraseñas no coincidentes')
            }
        } else {
            Alert.alert('Nombre de usuario cogido')
        }
    }

    const toggleShowPassword = () => {
        setShowPassword(prev => !prev);
    };

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
                                leftIcon={<Icon name='user' size={22} color={theme.signUpIconsColor} />}
                                name='displayName'
                            />
                            <FormikInput
                                inputStyle={{ color: theme.signUpInputTextColor }}
                                label='Email'
                                placeholder='Introduce tu correo'
                                leftIcon={{ type: 'ionicon', name: 'mail-outline', color: theme.loginIconsColor }}
                                name='email'
                            />
                            <FormikInput
                                inputStyle={{ color: theme.signUpInputTextColor }}
                                label='Contraseña'
                                placeholder='Introduce tu contraseña'
                                leftIcon={{ type: 'ionicon', name: 'lock-closed-outline', color: theme.loginIconsColor }}
                                name='password'
                                rightIcon={
                                    <PasswordVisibilityIcon
                                        onPress={toggleShowPassword}
                                        showPassword={showPassword}
                                        color={theme.loginIconsColor}
                                    />
                                }
                                secureTextEntry={showPassword}
                            />
                            <FormikInput
                                inputStyle={{ color: theme.signUpInputTextColor }}
                                label='Confirmación de contraseña'
                                placeholder='Confirma tu contraseña'
                                leftIcon={{ type: 'ionicon', name: 'lock-closed-outline', color: theme.loginIconsColor }}
                                name='passwordConfirmation'
                                rightIcon={
                                    <PasswordVisibilityIcon
                                        onPress={toggleShowPassword}
                                        showPassword={showPassword}
                                        color={theme.loginIconsColor}
                                    />
                                }
                                secureTextEntry={showPassword}
                            />
                            <TouchableOpacity style={[styles.button, { backgroundColor: theme.signUpButtonBackgroundColor }]} onPress={handleSubmit}>
                                <Text style={[styles.textButton, { color: theme.signUpButtonTextColor }]}>Crear usuario</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => navigation.navigate('Login')} style={{ justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={[styles.underlinedText, { color: theme.signUpUnderlinedTextColor }]}>Inicia sesión aquí</Text>
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