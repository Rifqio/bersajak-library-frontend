import { pressLeftArrow, pressRightArrow, pressSpacebar } from "@/lib/accessibility";
import { fetcher } from "@/lib/fetcher";
import { useSwr } from "@/lib/swr";
import { StartQuizDialog } from "@/sections/quiz/start-quiz-dialog";
import { useEffect, useRef, useState } from "react";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import { useNavigate, useParams } from "react-router-dom";
import SpeechRecognition, {
  useSpeechRecognition
} from "react-speech-recognition";

const AudioBookPage = () => {
  const { id } = useParams();
  const [onPlayBookAudio, setOnPlayBookAudio] = useState(false);
  const [onPlayIntroAudio, setOnPlayIntroAudio] = useState(false);
  const [onStartQuiz, setOnStartQuiz] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isPlayingAudioBook, setIsPlayingAudioBook] = useState(false);

  const [bookFinishedAudio, setBookFinishedAudio] = useState(null);
  const introAudio = useRef(null);
  const bookAudio = useRef(null);
  const quizStartAudio = useRef(null);

  const navigate = useNavigate();
  const { data } = useSwr(`/book/${id}`, fetcher);
  const { data: guideData } = useSwr(`/guide/book-read?id=${id}`, fetcher);
  const { data: bookFinished } = useSwr(bookFinishedAudio, fetcher);
  const audioUrl = data?.data?.audio_url;

  useEffect(() => {
    setOnPlayIntroAudio(true);
    introAudio.current.play();
    setIsPlayingAudio(true);
  }, [id]);

  const commands = [
    {
      command: ["pilihan ganda", "melengkapi kata"],
      callback: (command) => {
        if (!isPlayingAudio) {
          if (command === "pilihan ganda") {
            navigate(`/quiz/multiple-choice/${id}`);
          } else {
            navigate(`/quiz/word-completion/${id}`);
          }
        }
      },
      isFuzzyMatch: true,
      fuzzyMatchingThreshold: 0.2,
      bestMatchOnly: true
    },
    {
      command: ["percepat", "berhenti", "kembali"],
      callback: (command) => {
        if (!isPlayingAudioBook) {
          return;
        }
        if (command === "percepat") {
          pressRightArrow();
        } else if (command === "berhenti") {
          pressSpacebar();
        } else if (command === "kembali") {
          pressLeftArrow();
        }
      }
    }
  ];

  useSpeechRecognition({ commands });

  const onEndIntroAudio = () => {
    setOnPlayIntroAudio(false);
    setOnPlayBookAudio(true);
    if (bookAudio.current) {
      SpeechRecognition.startListening({ continuous: true, language: "id-ID" });
      bookAudio.current.audio.current.play();
    }
  };

  const onEndBookAudio = () => {
    setIsPlayingAudioBook(false);
    setOnPlayBookAudio(false);
    setOnStartQuiz(true);
    setBookFinishedAudio(`/guide/book-finished`);
  };

  useEffect(() => {
    if (!isPlayingAudio) {
      SpeechRecognition.startListening({ continuous: true, language: "id-ID" });
    } else {
      SpeechRecognition.stopListening();
    }
  }, [isPlayingAudio]);

  const introAudioUrl = guideData?.data;
  const book = data?.data;

  return (
    <div className='flex flex-col items-center p-4'>
      <audio
        className='hidden'
        onEnded={onEndIntroAudio}
        ref={introAudio}
        onPlaying={() => {
          bookAudio.current.audio.current.pause();
        }}
        src={introAudioUrl}
        autoPlay={onPlayIntroAudio}
      />
      <audio
        ref={quizStartAudio}
        className='hidden'
        autoPlay={onStartQuiz}
        onEnded={() => {
          setIsPlayingAudio(false);
        }}
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
        controls
        style={onPlayIntroAudio ? { pointerEvents: "none" } : {}}
        ref={bookAudio}
        onPlay={() => setIsPlayingAudioBook(true)}
        onEnded={onEndBookAudio}
        autoPlay={onPlayBookAudio}
        src={audioUrl}
      />

      <StartQuizDialog open={onStartQuiz} onOpenChange={setOnStartQuiz} />
    </div>
  );
};

export default AudioBookPage;
