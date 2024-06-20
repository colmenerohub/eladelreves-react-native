import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { Video } from 'expo-av';
import { useEffect, useRef, useState } from 'react';
import { Dimensions, FlatList } from 'react-native';
import { getRandomVideoFromRandomUser } from 'services/Videos';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const ReelsComponent = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [videoData, setVideoData] = useState([]);
    const tabBarHeight = useBottomTabBarHeight();
    const video = useRef(null);

    const handleChangeIndexValue = async ({ index }) => {
        setCurrentIndex(index);
        console.log(currentIndex, index);
        if (index > currentIndex) {
            try {
                for (let index = 0; index < 3; index++) {
                    const nextVideo = await getRandomVideoFromRandomUser();
                    videoData.push(nextVideo);
                }
            } catch (error) {
                console.error('Error al cambiar el índice:', error);
            }
        }
    };

    useEffect(() => {
        async function getRandomVideo() {
            let initialVideos = [];
            for (let index = 0; index < 3; index++) {
                const nextVideo = await getRandomVideoFromRandomUser();
                initialVideos.push(nextVideo);
            }
            setVideoData(initialVideos)
        }
        getRandomVideo()
    }, [])

    const onViewableItemsChanged = ({ viewableItems }) => {
        if (viewableItems.length > 0) {
            setCurrentIndex(viewableItems[0].index);
        }
    };

    const viewabilityConfig = {
        itemVisiblePercentThreshold: 50,
    };

    return (
        <FlatList
            data={videoData}
            renderItem={({ item, index }) => (
                <Video
                    ref={video}
                    style={{
                        width: '100%',
                        height: '100%',
                        flex: 1
                    }}
                    repeat={true}
                    source={{ uri: item.video }}
                    resizeMode="contain"
                    shouldPlay
                    isLooping
                />
            )}
            keyExtractor={(item, index) => index.toString()}
            pagingEnabled
            showsVerticalScrollIndicator={false}
            onViewableItemsChanged={onViewableItemsChanged}
            viewabilityConfig={viewabilityConfig}
            getItemLayout={(videoData, index) => ({
                length: windowHeight - tabBarHeight,
                offset: (windowHeight - tabBarHeight) * index,
                index,
            })}
        />
    );
};

export default ReelsComponent;
