import * as yup from 'yup';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const passwordRegex = /^(?=.*[A-Za-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()[\]{}<>;:,.~`])[A-Za-z\d!@#$%^&*()[\]{}<>;:,.~`]{8,}$/;
const minNumberOfCharacters = 8
const maxNumberOfCharacters = 30

export const signUpValidationSchema = yup.object().shape({
    displayName: yup.string()
        .max(maxNumberOfCharacters, `No puede tener mas de 30 caracteres`)
        .when([], {
            is: (displayName) => displayName && displayName.length > 0,
            then: yup.string().required('displayName is required')
        }),
    email: yup.string()
        .matches(emailRegex, 'Email must be a valid email')
        .when([], {
            is: (email) => email && email.length > 0,
            then: yup.string().required('email is required')
        }),
    password: yup.string()
        .min(minNumberOfCharacters, `Mayúscula, número, símbolo, 8 caracteres`)
        .matches(passwordRegex, `Mayúscula, número, símbolo, 8 caracteres`)
        .when([], {
            is: (password) => password && password.length > 0,
            then: yup.string().required('Password is required')
        }),
    passwordConfirmation: yup.string()
        .min(minNumberOfCharacters, `Mayúscula, número, símbolo, 8 caracteres`)
        .matches(passwordRegex, `Mayúscula, número, símbolo, 8 caracteres`)
        .when([], {
            is: (password) => password && password.length > 0,
            then: yup.string().required('Password is required')
        })

});
