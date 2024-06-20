import { Text, View } from "react-native";

export default function EmptyView() {

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>EMPTY VIEW</Text>
        </View>
    );
}