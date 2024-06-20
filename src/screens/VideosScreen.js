import { useIsFocused } from '@react-navigation/native';
import VideoItem from 'components/VideoItem';
import { useCallback, useEffect, useRef, useState } from 'react';
import { FlatList } from 'react-native';
import { getRandomVideoFromRandomUser } from 'services/Videos';

export default function VideosScreen() {
    const [videoData, setVideoData] = useState([]);
    const [playingIndex, setPlayingIndex] = useState(null);
    const isFocused = useIsFocused();

    const onViewableItemsChanged = useCallback(({ viewableItems }) => {
        if (viewableItems.length > 0) {
            setPlayingIndex(viewableItems[0].index);
        }
    }, []);

    const viewabilityConfig = useRef({
        itemVisiblePercentThreshold: 50,
    }).current;

    const fetchNextVideo = async () => {
        const nextVideo = await getRandomVideoFromRandomUser();
        setVideoData(prevData => [...prevData,
        {
            id: `${prevData.length + 1}`,
            uid: nextVideo.uid,
            videoURL: nextVideo.videoURL,
            photoURL: nextVideo.photoURL,
            displayName: nextVideo.displayName
        }]);
    };

    useEffect(() => {
        fetchNextVideo();
        fetchNextVideo();
    }, [])

    useEffect(() => {
        if (playingIndex !== null && playingIndex === videoData.length - 1) {
            fetchNextVideo();
        }
    }, [playingIndex, videoData]);

    useEffect(() => {
        if (!isFocused && playingIndex !== null) { // Si la pantalla no está enfocada, establece playingIndex en null
            setPlayingIndex(null);
        }
    }, [isFocused]);

    return (
        <FlatList
            data={videoData}
            renderItem={({ item, index }) => (
                <VideoItem item={item} isPlaying={index === playingIndex} />
            )}
            keyExtractor={(item) => item.id}
            pagingEnabled
            onViewableItemsChanged={onViewableItemsChanged}
            viewabilityConfig={viewabilityConfig}
            showsVerticalScrollIndicator={false}
        />
    );
};
