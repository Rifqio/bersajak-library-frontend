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
import BooksIllustration from "../../assets/board.svg";
import { CancelDialog } from "@/sections/quiz";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import ScoreDialog from "@/sections/quiz/score-dialog";
import { useSpeechRecognition } from "react-speech-recognition";

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
  const maskedQuestion = question.replace(clue, ".....");

  return {
    question: maskedQuestion,
    clue: clue
  };
}

const WordCompletionPage = () => {
  const { id } = useParams();
  const { startListening, stopListening } =
    useMicrophone();
  const { greeting, stopSpeech } = useSpeaker();
  const navigate = useNavigate();

  const [countdown, setCountdown] = useState(20);
  const [numberQuiz, setNumberQuiz] = useState(1);
  const [score, setScore] = useState(0);
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
  const totalQuestion = 10;
  const question = get(questionList, "question", "");
  const answerList = get(questionList, "answer", "");
  const result = splitQuestion(question);
  const splitClue = result.clue.split("").map((letter) => letter.toUpperCase());

  const commands = [
    {
      command: answerList,
      callback: ({ command }) => {
        if (command.includes(answerList)) {
          setScore(prevScore => prevScore + (100/20));
        }
      },
      matchInterim: true
    }
  ];

  const { transcript, resetTranscript } = useSpeechRecognition({ commands });

  //POST ANSWER
  const validCommands = commands.map(cmd => cmd.command).flat();
  const isValidCommand = validCommands.some(cmd => transcript.includes(cmd.toLowerCase()));
  const foundCommands = validCommands.filter(cmd => transcript.includes(cmd.toLowerCase()));
  const answerData = foundCommands.length > 0 ? foundCommands[0] : "";
  const usePostQuizAnswer = (url, body) => {
    const { mutate: validateAnswer } = usePost(url, body);
    return validateAnswer;
  };
  const body = {
    number: numberQuiz,
    answer: answerData
  };
  
  const validateAnswer = usePostQuizAnswer(`/quiz/word-completion/${id}`, body);
  console.log(score);

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

  // TRIGGER EFFECT
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000);
    }

    if (countdown > 10) {
      greeting(result.question, 1);
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
    if (isValidCommand) {
      validateAnswer();
    }
  }, [isValidCommand]);

  return (
    <div className='mt-16 h-screen flex flex-col'>
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
      <ScoreDialog onOpen={isShowScore} onBack={onCancelQuiz} score={score} />
    </div>
  );
};

export default WordCompletionPage;
