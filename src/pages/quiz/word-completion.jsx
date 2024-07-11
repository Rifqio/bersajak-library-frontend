/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { useSpeaker, useMicrophone } from "@/hooks";
import { usePost, useSwr } from "@/lib/swr";
import { useParams } from "react-router-dom";
import { fetcher } from "@/lib/fetcher";
import { get } from "lodash";
import { useCallback, useEffect, useState } from "react";
import { Button, Progress } from "@/components";
import { ROUTE } from "@/lib/constants";
import BooksIllustration from "../../assets/books.svg";
import { CancelDialog } from "@/sections/quiz";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import ScoreDialog from "@/sections/quiz/score-dialog";

function splitQuestion(question) {
  const clueMatch = question.match(/\b\w*_\w*\b/);
  if (!clueMatch) {
    return { question, clue: "" };
  }

  const clue = clueMatch[0];
  const maskedQuestion = question.replace(clue, ".....");

  return {
    question: maskedQuestion,
    clue: clue
  };
}

const WordCompletionPage = () => {
  const { id } = useParams();
  const { transcript, startListening, stopListening, resetTranscript } =
    useMicrophone();
  const { greeting, stopSpeech } = useSpeaker();
  const navigate = useNavigate();

  const [countdown, setCountdown] = useState(20);
  const [numberQuiz, setNumberQuiz] = useState(1);
  const [score, setScore] = useState(0);
  const [isShowScore, setIsShowScore] = useState(false);
  const [cancelQuiz, setCancelQuiz] = useState(false);

  //post data  
  const body = {
    number: numberQuiz,
    answer: transcript
  }
  const { mutate: validateAnswer } = usePost(`/quiz/word-completion/${id}`, body);

  // fetch data
  const { data: questionResponse } = useSwr(
    `/quiz/word-completion/${id}?number=${numberQuiz}`,
    fetcher,
    {
      shouldRetryOnError: false,
      revalidateOnFocus: false
    }
  );
  const questionList = questionResponse?.data;
  const totalQuestion = 10;
  const question = get(questionList, "question", "");
  const result = splitQuestion(question);
  const splitClue = result.clue.split("").map((letter) => letter.toUpperCase());

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
    const roundedScore = score.toFixed(1);
    if (numberQuiz >= totalQuestion - 1) {
      setTimeout(() => {
        stopListening();
        resetTranscript();
        setIsShowScore(true);
      }, 3000);
    } else {
      toast.success(`Skor anda adalah ${roundedScore}`, {
        position: "top-center",
        autoClose: 1000,
        pauseOnHover: false
      });
      setTimeout(() => {
        setCountdown(20);
        stopListening();
        resetTranscript();
        handleNext();
      }, 3000);
    }
  };

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000);
    }

    if (countdown > 10) {
      greeting(result.question, 2);
    } else if (countdown <= 10 && countdown > 0) {
      stopSpeech();
      startListening();
    } else {
      handleNextQuiz();
    }

    return () => {
      clearInterval(timer);
    };
  }, [countdown, startListening, stopSpeech]);

  useEffect(() => {
    if (countdown <= 10 && countdown > 0) {
      validateAnswer();
    }
  }, [transcript, numberQuiz, countdown, id, validateAnswer]);

  return (
    <div className='mt-16 h-screen flex flex-col'>
      <ToastContainer />
      <Progress
        value={(countdown / 20) * 100}
        className='w-full fixed top-0 left-0 rounded-none h-2 bg-green-500'
      />
      <div className='text-center pb-4'>
        <h1 className='text-4xl text-white font-poppins font-medium'>
          {result.question}
        </h1>
      </div>
      <div className='flex justify-center items-center pb-4 pt-4'>
        <img
          src={BooksIllustration}
          alt='Books Illustration'
          style={{ width: "600px", height: "400px" }}
        />
      </div>
      <div className='text-center pt-4'>
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

export default WordCompletionPage;
