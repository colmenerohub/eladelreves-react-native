import { useTheme } from 'contexts/ThemeProvider';
import { Image, Linking, Pressable, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function WebScreen() {
    const { theme } = useTheme();
    const isDarkMode = theme.theme === 'dark';
    const logoImg = isDarkMode ? require('@assets/images/web-dark.png') : require('@assets/images/web.png');

    const openWeb = () => {
        const url = "https://eladelreves.vercel.app";
        Linking.openURL(url);
    }
    return (
        <SafeAreaView style={{
            flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.webBackgroundColor
        }}>
            <Image source={logoImg} style={styles.logoImg} />
            <Text style={[styles.webTitle, { color: theme.webTextColor }]}>¡<Text style={{ color: '#74AD74' }}>Date una vuelta</Text> por nuestra <Text style={{ color: '#74AD74' }}>web</Text>!
            </Text>
            <Text style={[styles.webText, { color: theme.webTextColor }]}>Aquí encontrarás <Text style={{ color: '#74AD74' }}>información detallada</Text> sobre la enfermedad, las <Text style={{ color: '#74AD74' }}>últimas noticias</Text> y avances en investigación, y una plataforma segura para <Text style={{ color: '#74AD74' }}>realizar donaciones</Text>.
            </Text>
            <Text style={[styles.webText, { color: theme.webTextColor }]}><Text style={{ color: '#74AD74' }}>Únete a nosotros</Text> en esta batalla y ayuda a marcar la diferencia en la vida de quienes enfrentan la <Text style={{ color: '#74AD74' }}>ELA</Text>. ¡Contamos contigo!
            </Text>
            <Pressable style={styles.button} onPress={openWeb}>
                <Text style={styles.textButton}>Visitar web</Text>
            </Pressable>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    logoImg: {
        width: '75%',
    },
    webTitle: {
        fontSize: 22,
        width: '85%',
        fontWeight: 'bold',
        marginTop: 20,
    },
    webText: {
        fontSize: 18,
        textAlign: 'justify',
        width: '85%',
        marginTop: 20,
    },
    button: {
        marginTop: 35,
        backgroundColor: 'transparent',
        position: 'relative',
        paddingVertical: 5,
        paddingHorizontal: 15,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 25,
        fontWeight: '600',
        textDecorationLine: 'none',
        cursor: 'pointer',
        borderWidth: 2,
        borderColor: '#74AD74',
        borderRadius: 25,
        outlineStyle: 'none',
        overflow: 'hidden',
        color: '#74AD74',
        transitionProperty: 'color',
        transitionDuration: '0.3s',
        transitionTimingFunction: 'ease-out',
        transitionDelay: '0.1s',
        textAlign: 'center',
    },
    textButton: {
        color: '#74AD74',
        fontSize: 22,
        fontWeight: 'bold',
    },
})