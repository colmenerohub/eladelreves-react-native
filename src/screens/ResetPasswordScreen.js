import { FormikInput } from 'components/FormikInput';
import { auth } from 'config/firebase-config';
import { useTheme } from 'contexts/ThemeProvider';
import { sendPasswordResetEmail } from 'firebase/auth';
import { Formik } from 'formik';
import { Alert, Image, Keyboard, SafeAreaView, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { loginValidationSchema } from 'src/schemas/loginValidationSchema';

const initialValues = {
    email: ''
};

export default function ResetPasswordScreen({ navigation }) {
    const { theme } = useTheme();
    const isDarkMode = theme.theme === 'dark';
    const logoImg = isDarkMode ? require('@assets/images/logo-dark.png') : require('@assets/images/logo.png');

    const sendResetPasswordEmail = (values) => {
        sendPasswordResetEmail(auth, values.email)
            .then(() => {
                Alert.alert('Correo de recuperación enviado');
                navigation.navigate('Login')
            })
            .catch((error) => {
                Alert.alert(error);
            });
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <SafeAreaView style={[styles.container, { backgroundColor: theme.loginBackgroundColor }]}>
                <Image source={logoImg} style={styles.logoImg} />
                <Formik
                    validationSchema={loginValidationSchema}
                    validateOnChange={true}
                    initialValues={initialValues}
                    onSubmit={sendResetPasswordEmail}
                >
                    {({ handleSubmit }) => (
                        <View style={styles.form}>
                            <FormikInput
                                inputStyle={{ color: theme.loginInputTextColor }}
                                label='Email'
                                placeholder='Correo de recuperación'
                                leftIcon={{ type: 'ionicon', name: 'mail-outline', color: theme.loginIconsColor }}
                                name='email'
                            />
                            <TouchableOpacity onPress={handleSubmit} style={[styles.button, { backgroundColor: theme.loginButtonBackgroundColor }]}>
                                <Text style={[styles.textButton, { color: theme.loginButtonTextColor }]}>Enviar correo de recuperación</Text>
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