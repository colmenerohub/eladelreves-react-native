import "react-native-gesture-handler";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AuthenticatedUserProvider } from "./src/contexts/AuthenticatedUserProvider";
import { ThemeProvider } from "./src/contexts/ThemeProvider";
import RootNavigator from './src/nav/RootNavigator';

export default function App() {
    return (
        <GestureHandlerRootView>
            <ThemeProvider>
                <AuthenticatedUserProvider>
                    <RootNavigator />
                </AuthenticatedUserProvider>
            </ThemeProvider>
        </GestureHandlerRootView>
    );
}