import { fetcherWithRange } from "@/lib/fetcher";
import { useSwr } from "@/lib/swr";
import PropTypes from "prop-types";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";

const Player = ({ filename }) => {
    const { data, error } = useSwr(`/audio/${filename}`, fetcherWithRange);

    if (error) return <div>Error loading audio</div>;
    if (!data) return <div>Loading...</div>;

    const audioUrl = URL.createObjectURL(data);

    return <AudioPlayer autoPlay src={audioUrl} />;
};

const AudioBookPage = () => {
    return (
        <div className='flex flex-col justify-center'>
            <div className='flex justify-center'>
                <img
                    className='object-cover h-full rounded-md drop-shadow-md mb-4'
                    src='https://unsplash.it/450/400'
                    alt='Book Cover'
                />
            </div>
            <Player filename='audio.mp3' />
        </div>
    );
};

Player.propTypes = {
    filename: PropTypes.string.isRequired
};

export default AudioBookPage;
