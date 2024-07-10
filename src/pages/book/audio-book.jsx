import { fetcher, fetcherWithRange } from "@/lib/fetcher";
import { useSwr } from "@/lib/swr";
import { StartQuizDialog } from "@/sections/quiz/start-quiz-dialog";
import { useState } from "react";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import { useParams } from "react-router-dom";

const AudioBookPage = () => {
    const { id } = useParams();
    const [onEndAudio, setOnEndAudio] = useState(false);
    const { data } = useSwr(`/book/${id}`, fetcher);

    const { data: audioData, error: audioError } = useSwr(
        `/audio/${id}`,
        fetcherWithRange
    );

    if (audioError) return <div>Error loading audio</div>;
    if (!audioData) return <div>Loading...</div>;

    const audioUrl = URL.createObjectURL(audioData);
    const book = data?.data;

    return (
        <div className='flex flex-col items-center p-4'>
            <div className='flex justify-center mb-4'>
                <img
                    className='object-cover w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl rounded-md drop-shadow-md'
                    src={book?.thumbnail_url}
                    alt='Book Cover'
                />
            </div>

            <AudioPlayer
                onEnded={() => setOnEndAudio(true)}
                autoPlay
                src={audioUrl}
            />

            <StartQuizDialog open={onEndAudio} onOpenChange={setOnEndAudio} />
        </div>
    );
};

export default AudioBookPage;
