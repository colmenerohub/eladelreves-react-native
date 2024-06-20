import * as yup from 'yup';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const minNumberOfCharacters = 8

export const loginValidationSchema = yup.object().shape({
    email: yup
        .string()
        .matches(emailRegex, 'Email must be a valid email')
        .when([], {
            is: (email) => email && email.length > 0,
            then: yup.string().required('email is required')
        })
});
