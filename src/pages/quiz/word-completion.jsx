/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { useMicrophone } from "@/hooks";
import { usePost, useSwr } from "@/lib/swr";
import { useParams, useNavigate } from "react-router-dom";
import { fetcher } from "@/lib/fetcher";
import { get, isEmpty } from "lodash";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button, Progress } from "@/components";
import { ROUTE } from "@/lib/constants";
import BooksIllustration from "../../assets/board.svg";
import { CancelDialog } from "@/sections/quiz";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import ScoreDialog from "@/sections/quiz/score-dialog";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import axios from "@/lib/axios";

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

  // AUDIO SECTION
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
      toast.error("Waktu habis!", {
        autoClose: 2000
      });
      handleNextQuiz();
    }

    return () => {
      clearInterval(timer);
    };
  }, [countdown]);

  useEffect(() => {
    if (numberQuiz === 1 && audioIntroRef.current) {
      audioIntroRef.current.play();
    }
  }, [audioIntroUrl]);

  useEffect(() => {
    if (audioQuestionRef.current) {
      audioQuestionRef.current.play().catch((error) => {
        console.error("Error playing the audio:", error);
      });
    }
  }, [numberQuiz, audioQuestionUrl]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {/* Audio Elements */}
      <audio ref={audioIntroRef} src={audioIntroUrl} className="hidden" />
      <audio ref={audioQuestionRef} src={audioQuestionUrl} className="hidden" />
      <audio ref={answerCorrectRef} src={answerCorrectUrl?.data} className="hidden" />
      <audio ref={answerWrongRef} src={answerWrongUrl?.data} className="hidden" />

      <ToastContainer />

      <Progress
        value={(countdown / 20) * 100}
        className="w-full fixed top-0 left-0 h-2 bg-green-500"
      />

      <div className="w-full max-w-5xl px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <Button
            onClick={handleBackButton}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Kembali
          </Button>
          <div className="text-xl font-bold">Score: {score}</div>
        </div>

        <div className="flex flex-col items-center bg-white shadow-lg rounded-lg p-8">
          <img
            src={BooksIllustration}
            alt="Books Illustration"
            className="w-full max-w-md mb-8"
          />
          <h1 className="text-2xl md:text-4xl font-semibold text-center mb-4">
            {result.question}
          </h1>
          <div className="flex space-x-2">
            {splitClue.map((letter, index) => (
              <div
                key={index}
                className="w-12 h-12 md:w-16 md:h-16 flex items-center justify-center bg-green-500 text-white text-xl md:text-2xl font-bold rounded-lg shadow"
              >
                {letter}
              </div>
            ))}
          </div>
        </div>
      </div>

      <CancelDialog
        onOpen={cancelQuiz}
        onOpenChange={setCancelQuiz}
        onCancel={onCancelQuiz}
      />
      <ScoreDialog
        onOpen={isShowScore}
        onBack={onCancelQuiz}
        score={score}
      />
    </div>
  );
};

export default WordCompletionPage;
