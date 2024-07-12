import { fetcher, fetcherWithRange } from "@/lib/fetcher";
import { useSwr } from "@/lib/swr";
import { StartQuizDialog } from "@/sections/quiz/start-quiz-dialog";
import { useEffect, useRef, useState } from "react";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import { useParams } from "react-router-dom";

const AudioBookPage = () => {
  const { id } = useParams();
  const [onPlayBookAudio, setOnPlayBookAudio] = useState(false);
  const [onPlayIntroAudio, setOnPlayIntroAudio] = useState(false);
  const [onStartQuiz, setOnStartQuiz] = useState(false);

  const [bookFinishedAudio, setBookFinishedAudio] = useState(null);
  const introAudio = useRef(null);
  const bookAudio = useRef(null);
  const quizStartAudio = useRef(null);

  const { data } = useSwr(`/book/${id}`, fetcher);
  const { data: guideData } = useSwr(`/guide/book-read?id=${id}`, fetcher);
  const { data: bookFinished } = useSwr(bookFinishedAudio, fetcher);
  const { data: audioData, error: audioError } = useSwr(
    `/audio/${id}`,
    fetcherWithRange
  );

  useEffect(() => {
    setOnPlayIntroAudio(true);
  }, [id]);

  const onEndIntroAudio = () => {
    setOnPlayIntroAudio(false);
    setOnPlayBookAudio(true);
  };

  const onEndBookAudio = () => {
    setOnPlayBookAudio(false);
    setOnStartQuiz(true);
    setBookFinishedAudio(`/guide/book-finished`);
  };

  if (audioError) return <div>Error loading audio</div>;
  if (!audioData) return <div>Loading...</div>;

  const audioUrl = URL.createObjectURL(audioData);
  const introAudioUrl = guideData?.data;
  const book = data?.data;

  return (
    <div className='flex flex-col items-center p-4'>
      <audio
        className='hidden'
        onEnded={onEndIntroAudio}
        ref={introAudio}
        src={introAudioUrl}
        autoPlay={onPlayIntroAudio}
      />
      <audio
        ref={quizStartAudio}
        className='hidden'
        autoPlay={onStartQuiz}
        src={bookFinished?.data}
      />
      <div className='flex justify-center mb-4'>
        <img
          className='object-cover w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl rounded-md drop-shadow-md'
          src={book?.thumbnail_url}
          alt='Book Cover'
        />
      </div>

      <AudioPlayer
        style={onPlayIntroAudio ? { pointerEvents: "none" } : {}}
        ref={bookAudio}
        loop={false}
        onEnded={onEndBookAudio}
        autoPlay={onPlayBookAudio}
        src={audioUrl}
      />

      <StartQuizDialog open={onStartQuiz} onOpenChange={setOnStartQuiz} />
    </div>
  );
};

export default AudioBookPage;
