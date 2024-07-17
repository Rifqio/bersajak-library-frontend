import { Button, Progress } from "@/components";
import { useMicrophone } from "@/hooks";
import axios from "@/lib/axios";
import { ROUTE } from "@/lib/constants";
import { fetcher } from "@/lib/fetcher";
import { useSwr } from "@/lib/swr";
import { getIndexFromKey } from "@/lib/utils";
import { CancelDialog } from "@/sections/quiz";
import ScoreDialog from "@/sections/quiz/score-dialog";
import { get } from "lodash";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SpeechRecognition, {
  useSpeechRecognition
} from "react-speech-recognition";
import { toast, ToastContainer } from "react-toastify";

export const NewMultipleChoice = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [countdown, setCountdown] = useState(40);
  const [cancelQuiz, setCancelQuiz] = useState(false);
  const [isShowScore, setIsShowScore] = useState(false);
  const [isPlayingIntro, setIsPlayingIntro] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState("");
  const [numberQuiz, setNumberQuiz] = useState(1);
  const [score, setScore] = useState(0);

  // Audio Ref Section
  const introRef = useRef(null);
  const questionAudioRef = useRef(null);
  const correctAnswerRef = useRef(null);
  const wrongAnswerRef = useRef(null);

  const { data: questionResponse } = useSwr(
    `/quiz/multiple-choice/${id}?number=${numberQuiz}`,
    fetcher
  );
  const { data: introAudio } = useSwr(`/guide/multiple-choice`, fetcher);
  const { data: correctAudio } = useSwr("/guide/answer?type=correct", fetcher);
  const { data: wrongAudio } = useSwr("/guide/answer?type=false", fetcher);

  const questionList = questionResponse?.data;
  const keyAnswer = ["a", "b", "c", "d"];
  const audioUrl = questionResponse?.data?.question_audio_url || "";
  const totalQuestion = 5;
  const optionList = get(questionList, "options", []);
  const question = get(questionList, "question", "");

  const { startListening } = useMicrophone();
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
    },
    {
      command: ["pilih buku", "selesai"],
      callback: (command) => {
        if (command === "pilih buku") {
          navigate(ROUTE.BookList);
        } else {
          navigate(ROUTE.Home);
        }
      },
      isFuzzyMatch: true,
      bestMatchOnly: true
    }
  ];

  useSpeechRecognition({ commands });

  const onSelectedAnswer = async (index, value) => {
    setSelectedIndex(index);
    try {
      await axios.post(`/quiz/multiple-choice/${id}`, {
        answer: value.key,
        number: numberQuiz
      });

      setScore((prevScore) => prevScore + 100 / totalQuestion);
      correctAnswerRef.current.play();
      toast.success("Jawaban benar!", {
        autoClose: 2000
      });
    } catch (error) {
      if (error.response.status === 400) {
        wrongAnswerRef.current.play();
        toast.error("Jawaban salah!", {
          autoClose: 2000
        });
      }
    }
  };

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      if (!isPlayingIntro && !isPlayingAudio) {
        timer = setInterval(() => {
          setCountdown((prevCountdown) => prevCountdown - 1);
        }, 1000);
      }
    }
    return () => {
      clearInterval(timer);
    };
  }, [startListening, isPlayingIntro, countdown, isPlayingAudio]);

  const handleBackButton = () => {
    setCancelQuiz(true);
  };

  const advanceQuizNumber = () => {
    setNumberQuiz((prevPage) => prevPage + 1);
  };

  const handleNextQuiz = () => {
    if (numberQuiz >= totalQuestion) {
      setIsShowScore(true);
    } else {
      advanceQuizNumber();
      setSelectedIndex("");
      setCountdown(40);
    }
  };

  const onCancelQuiz = () => {
    navigate(ROUTE.Home);
  };

  useEffect(() => {
    if (isPlayingAudio) {
      SpeechRecognition.stopListening();
    } else {
      SpeechRecognition.startListening({ continuous: true, language: "id-ID" });
    }
  }, [isPlayingAudio]);

  // for playing audio next question
  useEffect(() => {
    const firstCondition = !isPlayingIntro && audioUrl;
    const secondCondition = questionAudioRef.current && numberQuiz > 1;
    if (firstCondition && secondCondition) {
      questionAudioRef.current.play().catch((error) => {
        console.error("Error playing the audio:", error);
      });
    }
  }, [audioUrl, numberQuiz]);

  useEffect(() => {
    if (numberQuiz === 1 && introRef.current) {
      setIsPlayingIntro(true);
      setIsPlayingAudio(true);
      introRef.current.play();
    }
  }, [introAudio, numberQuiz]);

  const onEndedIntro = () => {
    setIsPlayingIntro(false);
    questionAudioRef.current.play().catch((error) => {
      console.error("Error playing the audio:", error);
    });
  };

  const getBackgroundColor = (index) => {
    if (selectedIndex === index) {
      return "#D70B52";
    }
    return "";
  };

  const onPlayAudio = () => {
    setIsPlayingAudio(true);
    SpeechRecognition.stopListening();
  };

  const renderAudioSection = () => {
    return (
      <>
        <audio
          onEnded={onEndedIntro}
          ref={introRef}
          onPlay={onPlayAudio}
          className='hidden'
          src={introAudio?.data}
        />
        <audio
          onPlay={onPlayAudio}
          onEnded={() => setIsPlayingAudio(false)}
          ref={questionAudioRef}
          src={audioUrl}
          className='hidden'
        />
        <audio onEnded={handleNextQuiz}>
          <audio
            ref={correctAnswerRef}
            src={correctAudio?.data}
            className='hidden'
          />
          <audio
            ref={wrongAnswerRef}
            src={wrongAudio?.data}
            className='hidden'
          />
        </audio>
      </>
    );
  };

  const renderQuizDialog = () => {
    return (
      <>
        {/* <Button
          onClick={handleBackButton}
          className='bg-red-500 mt-8 hover:bg-red-700 font-poppins font-bold text-white'
        >
          Kembali
        </Button> */}
        <CancelDialog
          onOpen={cancelQuiz}
          onOpenChange={setCancelQuiz}
          onCancel={onCancelQuiz}
        />
        <ScoreDialog
          isPlayingAudio={isPlayingAudio}
          setIsPlayingAudio={setIsPlayingAudio}
          onOpen={isShowScore}
          onBack={onCancelQuiz}
          score={score}
        />
      </>
    );
  };

  return (
    <div className='bg-quiz-darkBlue h-screen font-poppins'>
      {renderAudioSection()}
      <Progress
        value={(countdown / 40) * 100}
        className='w-full fixed top-0 left-0 rounded-none h-2 bg-quiz-red'
      />
      <ToastContainer />
      <div className='flex flex-col items-center justify-center min-h-screen px-4 sm:px-8'>
        <div className='w-3/4 md:w-2/3 lg:w-1/2 xl:w-1/3 h-[30vh] lg:h-[40vh] flex items-center justify-center border-quiz-lightBlue border-4 rounded-xl mb-6'>
          <h1 className='px-4 text-center text-white text-3xl lg:text-4xl'>{question}</h1>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8'>
          {optionList.map((item, index) => (
            <button
              onClick={() => onSelectedAnswer(index, item)}
              key={item.id}
              style={{
                backgroundColor: getBackgroundColor(index)
              }}
              className='border-quiz-lightBlue w-full md:w-80 mb-4 md:mb-0 flex items-center h-20 border-4 rounded-lg focus:bg-quiz-red hover:bg-quiz-red hover:cursor-pointer'
            >
              <h1 className='pl-4 text-base md:text-2xl font-bold text-white'>
                {item.key.toUpperCase()}
              </h1>
              <p className='pl-4 text-white font-semibold leading-none tracking-normal'>
                {item.value}
              </p>
            </button>
          ))}
        </div>
      </div>
      {renderQuizDialog()}
    </div>
  );
};
