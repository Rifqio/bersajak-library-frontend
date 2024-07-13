/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Progress } from "@/components";
import { ROUTE } from "@/lib/constants";
import { CancelDialog } from "@/sections/quiz";
import { CircleCheck } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useSWR from "swr";
import { get } from "lodash";
import { fetcher } from "@/lib/fetcher";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ScoreDialog from "@/sections/quiz/score-dialog";
import axios from "@/lib/axios";
import { HOVER_COLORS, OPTION_COLORS } from "@/lib/theme";
import SpeechRecognition, {
  useSpeechRecognition
} from "react-speech-recognition";
import { useSwr } from "@/lib/swr";
import { getIndexFromKey } from "@/lib/utils";
import { useMicrophone } from "@/hooks";

export const MultipleChoicePage = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [countdown, setCountdown] = useState(40);
  const [cancelQuiz, setCancelQuiz] = useState(false);
  const [isShowScore, setIsShowScore] = useState(false);
  const [isPlayingIntro, setIsPlayingIntro] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const [answerAudioUrl, setAnswerAudioUrl] = useState(null);
  const [numberQuiz, setNumberQuiz] = useState(1);
  const [score, setScore] = useState(0);
  const audioRef = useRef(null);
  const introRef = useRef(null);
  const answerAudioRef = useRef(null);

  // FETCH QUESTION
  const { data: questionResponse } = useSwr(
    `/quiz/multiple-choice/${id}?number=${numberQuiz}`,
    fetcher
  );

  const { data: introAudio } = useSwr(`/guide/multiple-choice`, fetcher);
  const { data: answerAudio } = useSWR(answerAudioUrl, fetcher);

  const questionList = questionResponse?.data;
  const keyAnswer = ["a", "b", "c", "d"];
  const audioUrl = questionResponse?.data?.question_audio_url || "";
  const totalQuestion = 5;
  const optionList = get(questionList, "options", []);
  const question = get(questionList, "question", "");
  const commands = [
    {
      command: keyAnswer,
      callback: async ({ command }) => {
        const value = {
          key: command
        };
        const index = getIndexFromKey(optionList, command);
        await onSelectedAnswer(index, value);
      },
      matchInterim: true
    }
  ];

  const { listening } = useSpeechRecognition({ commands });
  const { startListening } = useMicrophone();

  const onSelectedAnswer = async (index, value) => {
    setSelectedIndex(index);
    setSelectedOption(value.key);

    try {
      await axios.post(`/quiz/multiple-choice/${id}`, {
        answer: value.key,
        number: numberQuiz
      });
      setScore((prevScore) => prevScore + 100 / totalQuestion);
      setAnswerAudioUrl("/guide/answer?type=correct");
      toast.success("Jawaban benar!", {
        autoClose: 2000
      });
    } catch (error) {
      if (error.response.status === 400) {
        setAnswerAudioUrl("/guide/answer?type=wrong");
        toast.error("Jawaban salah!", {
          autoClose: 2000
        });
      }
      console.error("Error posting answer:", error);
    }

    answerAudioRef.current.play().catch((error) => {
      console.error("Error playing the audio:", error);
    });
  };

  // HANDLE FUNCTION
  const getBackgroundColor = (index, isHovered) => {
    if (selectedIndex === index) {
      return HOVER_COLORS[index % HOVER_COLORS.length];
    } else if (isHovered) {
      return HOVER_COLORS[index % HOVER_COLORS.length];
    } else {
      return OPTION_COLORS[index % OPTION_COLORS.length];
    }
  };

  const onHoverIn = (e, index) => {
    e.currentTarget.style.backgroundColor = getBackgroundColor(index, true);
  };

  const onHoverOut = (e, index) => {
    e.currentTarget.style.backgroundColor = getBackgroundColor(index, false);
  };

  const handleBackButton = () => {
    setCancelQuiz(true);
  };

  const handleNext = () => {
    setNumberQuiz((prevPage) => prevPage + 1);
  };

  useEffect(() => {
    if (!isPlayingIntro && audioUrl && audioRef.current && numberQuiz > 1) {
      audioRef.current.play().catch((error) => {
        console.error("Error playing the audio:", error);
      });
    }
  }, [audioUrl]);

  const handleNextQuiz = () => {
    if (numberQuiz >= totalQuestion) {
      setIsShowScore(true);
    } else {
      handleNext();
      setSelectedIndex("");
      setCountdown(40);
    }
  };

  const onCancelQuiz = () => {
    navigate(ROUTE.Home);
  };

  useEffect(() => {
    setIsPlayingIntro(true);
    introRef.current.play().catch((error) => {
      console.error("Error playing the audio:", error);
    });
  }, [introAudio]);

  useEffect(() => {
    if (numberQuiz > 1 && audioRef.current) {
      audioRef.current.play().catch((error) => {
        console.error("Error playing the audio:", error);
      });
    }
  }, [numberQuiz, audioUrl]);

  const stopListeningAndClearTimer = (timer) => {
    clearInterval(timer);
    SpeechRecognition.stopListening();
  };

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000);
    }

     if (countdown <= 15 && countdown > 0) {
       startListening();
     }

    return () => {
      clearInterval(timer);
    };
  }, [listening, startListening]);

  // RENDER FUNCTION
  const renderCheckmark = (index) => {
    if (selectedIndex === index) {
      return (
        <div className='absolute top-2 right-2'>
          <Button variant='ghost' className='bg-accent' size='icon'>
            <CircleCheck />
          </Button>
        </div>
      );
    }
  };

  const onStartListening = () => {
    SpeechRecognition.startListening({ continuous: true, language: "id-ID" });
  };

  return (
    <div className='mt-16 h-screen flex flex-col'>
      <audio
        ref={audioRef}
        onEnded={() => onStartListening()}
        onPlay={() => SpeechRecognition.stopListening()}
        src={audioUrl}
        className='hidden'
      />
      <audio
        onEnded={() => {
          audioRef.current.play();
        }}
        onPlaying={() => SpeechRecognition.stopListening()}
        ref={introRef}
        className='hidden'
        src={introAudio?.data}
      />
      <audio
        ref={answerAudioRef}
        onEnded={handleNextQuiz}
        src={answerAudio?.data}
        className='hidden'
      />
      <ToastContainer />
      <Progress
        value={(countdown / 40) * 100}
        className='w-full fixed top-0 left-0 rounded-none h-2 bg-green-500'
      />
      <div className='text-center pb-32'>
        <h1 className='text-4xl text-white font-poppins font-medium'>
          {question}
        </h1>
      </div>

      <div className='grid grid-cols-4 gap-4 text-center flex-grow'>
        {optionList.map((option, index) => (
          <button
            disabled={!introRef.current}
            key={option.key}
            onClick={() => onSelectedAnswer(index, option)}
            className='relative w-full rounded-lg flex items-center justify-center h-full cursor-pointer transition-colors duration-300'
            style={{
              backgroundColor: getBackgroundColor(index, false),
              backgroundImage:
                "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.2) 100%)"
            }}
            onMouseEnter={(e) => onHoverIn(e, index)}
            onMouseLeave={(e) => onHoverOut(e, index)}
          >
            <h3 className='font-bold text-3xl font-poppins text-white'>
              {option.value}
            </h3>

            {renderCheckmark(index)}
            <div className='absolute bottom-0 rounded-b-lg w-full h-4 bg-black opacity-30'></div>
          </button>
        ))}
      </div>

      <Button
        onClick={handleBackButton}
        className='bg-red-500 mt-8 hover:bg-red-700 font-poppins font-bold text-white'
      >
        Kembali
      </Button>
      <CancelDialog
        onOpen={cancelQuiz}
        onOpenChange={setCancelQuiz}
        onCancel={onCancelQuiz}
      />
      <ScoreDialog onOpen={isShowScore} onBack={onCancelQuiz} score={score} />
    </div>
  );
};
