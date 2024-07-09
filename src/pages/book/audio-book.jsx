import { fetcherWithRange } from "@/lib/fetcher";
import { useSwr } from "@/lib/swr";
import PropTypes from "prop-types";
import { useRef, useState } from "react";
import "./audio-player.css";

const AudioPlayer = ({ filename }) => {
    const { data, error } = useSwr(`/audio/${filename}`, fetcherWithRange);
    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);

    if (error) return <div>Error loading audio</div>;
    if (!data) return <div>Loading...</div>;

    const audioUrl = URL.createObjectURL(data);

    const togglePlayPause = () => {
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    const handleTimeUpdate = () => {
        const currentProgress =
            (audioRef.current.currentTime / audioRef.current.duration) * 100;
        setProgress(currentProgress);
    };

    return (
        <div className='audio-player'>
            <audio
                ref={audioRef}
                src={audioUrl}
                onTimeUpdate={handleTimeUpdate}
                className='hidden'
            />
            <div className='controls'>
                <button onClick={togglePlayPause} className='play-pause-btn'>
                    {isPlaying ? "Pause" : "Play"}
                </button>
                <div className='progress-bar'>
                    <div
                        className='progress'
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>
        </div>
    );
};

const AudioBookPage = () => {
    return (
        <div className='min-h-screen flex flex-col justify-between'>
            <div className='flex-grow'>
                {/* Your page content goes here */}
                {/* <AudioPlayer filename='audio.mp3' /> */}
            </div>
            <div className='fixed bottom-0 w-full h-16 bg-white rounded-md'>
                {/* Your bottom div content */}
            </div>
        </div>
    );
};

AudioPlayer.propTypes = {
    filename: PropTypes.string.isRequired
};

export default AudioBookPage;
