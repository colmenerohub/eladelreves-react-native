const { TouchableOpacity } = require("react-native");
import { Entypo } from '@expo/vector-icons';

export const PasswordVisibilityIcon = ({ onPress, showPassword, color }) => (
    <TouchableOpacity onPress={onPress}>
        {showPassword ? (
            <Entypo name="eye" size={24} color={color} />
        ) : (
            <Entypo name="eye-with-line" size={24} color={color} />
        )}
    </TouchableOpacity>
);