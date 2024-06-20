import { StyleSheet, Text, View } from "react-native"
import { Input } from "react-native-elements"

const { useField } = require("formik")

export const FormikInput = ({ name, inputStyle = {}, ...props }) => {
    const [field, meta, helpers] = useField(name)

    return (
        <View>
            <Input
                inputStyle={inputStyle}
                inputContainerStyle={meta.error ? styles.inputContainerError : styles.inputContainer}
                value={field.value}
                onChangeText={value => helpers.setValue(value)}
                {...props}
            />
            {meta.error && <Text style={styles.errorText}>{meta.error}</Text>}
        </View>
    )
}

const styles = StyleSheet.create({
    inputContainer: {
        borderBottomColor: 'gray',
    },
    inputContainerError: {
        borderBottomColor: 'red',
    },
    errorText: {
        color: 'red',
        position: 'absolute',
        bottom: 0,
        left: 10
    }
})