/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { useMicrophone } from "@/hooks";
import { usePost, useSwr } from "@/lib/swr";
import { useParams } from "react-router-dom";
import { fetcher } from "@/lib/fetcher";
import { get, isEmpty } from "lodash";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button, Progress } from "@/components";
import { ROUTE } from "@/lib/constants";
import BooksIllustration from "../../assets/board.svg";
import { CancelDialog } from "@/sections/quiz";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import ScoreDialog from "@/sections/quiz/score-dialog";
import SpeechRecognition, {
  useSpeechRecognition
} from "react-speech-recognition";
import axios from "@/lib/axios";

const buttonView = {
  width: "100px",
  height: "100px"
};

function splitQuestion(question) {
  const clueMatch = question.match(/\b\w*_\w*\b/);
  if (!clueMatch) {
    return { question, clue: "" };
  }

  const clue = clueMatch[0];

  return {
    question: question,
    clue: clue
  };
}

const WordCompletionPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [countdown, setCountdown] = useState(20);
  const [numberQuiz, setNumberQuiz] = useState(1);
  const totalQuestion = 5;
  const [score, setScore] = useState(0);
  const [isPlayingIntro, setIsPlayingIntro] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(true);
  const [answerState, setAnswerState] = useState(0);
  const [isShowScore, setIsShowScore] = useState(false);
  const [cancelQuiz, setCancelQuiz] = useState(false);

  // FETCH SOAL
  const { data: questionResponse } = useSwr(
    `/quiz/word-completion/${id}?number=${numberQuiz}`,
    fetcher,
    {
      shouldRetryOnError: false,
      revalidateOnFocus: false
    }
  );

  const questionList = questionResponse?.data;
  const question = get(questionList, "question", "");
  const result = splitQuestion(question);
  const splitClue = result.clue.split("").map((letter) => letter.toUpperCase());

  const commands = [
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
    },
    {
      command: "*",
      callback: async (command) => {
        // To avoid double submit
        if (answerState > 1) {
          return;
        } else {
          setAnswerState((prev) => prev + 1);
          await onSubmitAnswer(command);
        }
      },
      matchInterim: true
    }
  ];

  useSpeechRecognition({ commands });
  const { data: answerCorrectUrl } = useSwr(
    "/guide/answer?type=correct",
    fetcher
  );
  const { data: answerWrongUrl } = useSwr("/guide/answer?type=wrong", fetcher);

  // HANDLE FUNCTION
  const handleBackButton = () => {
    setCancelQuiz(true);
  };

  const handleNext = () => {
    setNumberQuiz((prevPage) => prevPage + 1);
  };

  const onCancelQuiz = () => {
    navigate(ROUTE.Home);
  };

  const handleNextQuiz = () => {
    if (numberQuiz === totalQuestion) {
      setIsShowScore(true);
    } else {
      setAnswerState(0);
      setCountdown(20);
      handleNext();
    }
  };

  const onSubmitAnswer = async (command) => {
    setAnswerState((prev) => prev + 1);
    SpeechRecognition.stopListening();
    try {
      const body = {
        number: numberQuiz,
        answer: command
      };
      const response = await axios.post(`/quiz/word-completion/${id}`, body);
      if (response.status === 200) {
        setScore((prevScore) => prevScore + 100 / totalQuestion);
        toast.success("Jawaban benar!", {
          autoClose: 2000
        });

        answerCorrectRef.current.play();
      }
    } catch (error) {
      toast.error("Jawaban salah!", {
        autoClose: 2000
      });
      answerWrongRef.current.play();
    }
  };

  //AUDITO SECTION
  const answerCorrectRef = useRef(null);
  const answerWrongRef = useRef(null);
  const audioQuestionRef = useRef(null);
  const audioIntroRef = useRef(null);

  const { data: introData } = useSwr(`/guide/games?type=intro`, fetcher);
  const audioIntroUrl = introData?.data;
  const audioQuestionUrl = get(questionList, "question_audio_url", "");

  // TRIGGER EFFECT
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000);
    } else if (countdown === 0) {
      toast.error("Jawaban salah!", {
        autoClose: 2000
      });
      // answerWrongRef.current.play();
      handleNextQuiz();
    }

    return () => {
      clearInterval(timer);
    };
  }, [countdown, isPlayingIntro]);

  useEffect(() => {
    if (numberQuiz === 1 && audioIntroRef.current) {
      setIsPlayingIntro(true);
      setIsPlayingAudio(true);
      audioIntroRef.current.play();
    }
  }, [audioIntroUrl]);

  useEffect(() => {
    if (numberQuiz > 1 && audioQuestionRef.current) {
      setIsPlayingAudio(true);
      audioQuestionRef.current.play().catch((error) => {
        console.error("Error playing the audio:", error);
      });
    }
  }, [numberQuiz, audioQuestionUrl]);

  const AudioSection = () => {
    return (
      <>
        <audio
          onEnded={() => {
            audioQuestionRef.current.play();
          }}
          ref={audioIntroRef}
          className='hidden'
          src={audioIntroUrl}
        />
        <audio
          ref={audioQuestionRef}
          onEnded={() => setIsPlayingAudio(false)}
          onPlay={() => setIsPlayingAudio(true)}
          src={audioQuestionUrl}
          className='hidden'
        />
        <audio onEnded={handleNextQuiz}>
          <audio
            ref={answerCorrectRef}
            src={answerCorrectUrl?.data}
            className='hidden'
          />
          <audio
            ref={answerWrongRef}
            src={answerWrongUrl?.data}
            className='hidden'
          />
        </audio>
      </>
    );
  };

  // PRESENTATION RENDER
  return (
    <div className='mt-16 h-screen flex flex-col'>
      {AudioSection()}
      <ToastContainer />
      <Progress
        value={(countdown / 20) * 100}
        className='w-full fixed top-0 left-0 rounded-none h-2 bg-green-500'
      />
      <div style={{ padding: "20px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "20px"
          }}
        >
          <div style={buttonView}>
            <Button
              onClick={handleBackButton}
              className='bg-red-500 hover:bg-red-700 font-poppins font-bold text-white'
              style={{ width: "200px" }}
            >
              Kembali
            </Button>
          </div>
          <div>
            <div
              className='flex flex-col items-center justify-center h-screen'
              style={{ marginTop: "-8rem" }}
            >
              <div className='relative'>
                <img
                  src={BooksIllustration}
                  alt='Books Illustration'
                  className='mx-auto'
                  style={{ maxWidth: "100%", height: "500px" }}
                />
                <h1
                  className='text-4xl text-white font-poppins font-medium absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center'
                  style={{ top: "calc(50% - 120px)" }}
                >
                  {result.question}
                </h1>
                <div className='text-center pt-2' style={{ marginTop: "10px" }}>
                  {splitClue.map((letter, index) => (
                    <input
                      key={index}
                      type='text'
                      className='text-center drop-shadow-md w-12 h-12 bg-green-500 text-white font-poppins font-semibold text-2xl rounded-lg mx-2'
                      style={{ border: "none" }}
                      value={letter}
                      readOnly
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div style={{ width: "100px", height: "100px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100%"
              }}
            >
              <div className='bg-black text-white font-poppins font-bold text-xl p-4 rounded'>
                Score: {score}
              </div>
            </div>
          </div>
        </div>
      </div>
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
    </div>
  );
};

export default WordCompletionPage;
