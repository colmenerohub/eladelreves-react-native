import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { Video } from 'expo-av';
import { useRef, useState } from 'react';
import { Dimensions, TouchableOpacity, View } from 'react-native';

import { useTheme } from 'contexts/ThemeProvider';
import { useVideoPlayer } from 'expo-video';

const SingleReel = ({ item, index, currentIndex }) => {
    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;
    const { theme } = useTheme();
    const tabBarHeight = useBottomTabBarHeight();
    const player = useVideoPlayer(item.video, player => {
        player.loop = true;
        player.play();
    });

    const video = useRef(null);

    const [mute, setMute] = useState(false);

    return (
        <View
            style={{
                width: windowWidth,
                height: windowHeight - tabBarHeight,
                position: 'relative',
                justifyContent: 'center',
                alignItems: 'center',
            }}>
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => setMute(!mute)}
                style={{
                    width: '100%',
                    height: '100%',
                    position: 'absolute',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                {/* <VideoView
                    ref={video}
                    style={{
                        backgroundColor: theme.videoBackgroundColor,
                        width: '100%',
                        height: '100%',
                        position: 'absolute',
                    }}
                    player={player}
                    allowsFullscreen
                    allowsPictureInPicture
                    staysActiveInBackground={false}
                /> */}
                <Video
                    ref={video}
                    style={{
                        width: '100%',
                        height: '100%',
                        position: 'absolute',
                    }}
                    onBuffer={onBuffer}
                    onError={onError}
                    repeat={true}
                    source={{ uri: item.video }}
                    resizeMode="contain"
                    shouldPlay
                    isLooping
                />
            </TouchableOpacity>
            {/* <View
                style={{
                    position: 'absolute',
                    width: windowWidth,
                    zIndex: 1,
                    bottom: 0, //edited
                    padding: 10,
                }}>
                <View style={{}}>
                    <TouchableOpacity style={{ width: 150 }}>
                        <View
                            style={{ width: 100, flexDirection: 'row', alignItems: 'center' }}>
                            <View
                                style={{
                                    width: 32,
                                    height: 32,
                                    borderRadius: 100,
                                    backgroundColor: 'white',
                                    margin: 10,
                                }}>
                                <Image
                                    source={item.postProfile}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        resizeMode: 'cover',
                                        borderRadius: 100,
                                    }}
                                />
                            </View>
                            <Text style={{ color: 'white', fontSize: 16 }}>{item.title}</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View> */}
        </View>
    );
};

export default SingleReel;
