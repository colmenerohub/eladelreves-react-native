import { auth } from '@config/firebase-config';
import { FormikInput } from 'components/FormikInput';
import { PasswordVisibilityIcon } from 'components/PasswordVisibilityIcon';
import { useTheme } from 'contexts/ThemeProvider';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Formik } from 'formik';
import { useState } from 'react';
import { Alert, Image, Keyboard, SafeAreaView, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { loginValidationSchema } from 'src/schemas/loginValidationSchema';

const initialValues = {
    email: '',
    password: ''
};

export default function LoginScreen({ navigation }) {
    const [showPassword, setShowPassword] = useState(true);
    const { theme } = useTheme();
    const isDarkMode = theme.theme === 'dark';
    const logoImg = isDarkMode ? require('@assets/images/logo-dark.png') : require('@assets/images/logo.png');

    const handleSignIn = (values) => {
        signInWithEmailAndPassword(auth, values.email, values.password)
            .then((userCredential) => {
                const user = userCredential.user;
                console.log(user);
            })
            .catch(err => {
                console.log(err);
                Alert.alert('Usuario o contraseña incorrectos');
            });
    };

    const toggleShowPassword = () => {
        setShowPassword(prev => !prev);
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <SafeAreaView style={[styles.container, { backgroundColor: theme.loginBackgroundColor }]}>
                <Image source={logoImg} style={styles.logoImg} />
                <Formik
                    validationSchema={loginValidationSchema}
                    validateOnChange={true}
                    initialValues={initialValues}
                    onSubmit={handleSignIn}
                >
                    {({ handleSubmit }) => (
                        <View style={styles.form}>
                            <FormikInput
                                inputStyle={{ color: theme.loginInputTextColor }}
                                label='Email'
                                placeholder='Introduce tu correo'
                                leftIcon={{ type: 'ionicon', name: 'mail-outline', color: theme.loginIconsColor }}
                                name='email'
                            />
                            <FormikInput
                                inputStyle={{ color: theme.loginInputTextColor }}
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
                            <TouchableOpacity onPress={() => navigation.navigate('ResetPassword')}>
                                <Text style={{ marginLeft: 10, fontStyle: 'italic' }}>He olvidado mi contraseña...</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleSubmit} style={[styles.button, { backgroundColor: theme.loginButtonBackgroundColor }]}>
                                <Text style={[styles.textButton, { color: theme.loginButtonTextColor }]}>Iniciar sesión</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => navigation.navigate('SignUp')} style={{ justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={[styles.underlinedText, { color: theme.loginUnderlinedTextColor }]}>Regístrate aquí</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </Formik>
            </SafeAreaView>
        </TouchableWithoutFeedback>
    );
};

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
        textDecorationLine: 'underline',
    },
    button: {
        marginTop: 30,
        borderRadius: 30,
        paddingHorizontal: 10,
        paddingVertical: 20,
        alignItems: 'center',
        justifyContent: 'center',
    }
});