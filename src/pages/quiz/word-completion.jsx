/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { useMicrophone } from "@/hooks";
import { usePost, useSwr } from "@/lib/swr";
import { useParams } from "react-router-dom";
import { fetcher } from "@/lib/fetcher";
import { get } from "lodash";
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
  const maskedQuestion = question.replace(clue, "");

  return {
    question: maskedQuestion,
    clue: clue
  };
}

const WordCompletionPage = () => {
  const { id } = useParams();
  const { startListening, stopListening } = useMicrophone();
  const navigate = useNavigate();

  const [countdown, setCountdown] = useState(20);
  const [numberQuiz, setNumberQuiz] = useState(1);
  const totalQuestion = 5;
  const [score, setScore] = useState(0);
  const [isPlayingIntro, setIsPlayingIntro] = useState(false);
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
  const answerList = get(questionList, "answer", "");
  const result = splitQuestion(question);
  const splitClue = result.clue.split("").map((letter) => letter.toUpperCase());

  const commands = [
    {
      command: answerList,
      matchInterim: true
    }
  ];

  const { transcript, resetTranscript, listening } = useSpeechRecognition({
    commands
  });

  //POST ANSWER
  const validCommands = commands.map((cmd) => cmd.command).flat() || "";
  const isValidCommand = validCommands.some((cmd) =>
    transcript.includes(cmd.toLowerCase())
  ) || "";
  const foundCommands = validCommands.filter((cmd) =>
    transcript.includes(cmd.toLowerCase())
  );
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
  const { data: answerCorrectUrl } = useSwr('/guide/answer?type=correct', fetcher);
  const { data: answerWrongUrl } = useSwr('/guide/answer?type=wrong', fetcher);

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
    if (numberQuiz > totalQuestion - 1) {
      setTimeout(() => {
        resetTranscript();
        setIsShowScore(true);
      }, 3000);
    } else {
      setCountdown(20);
      resetTranscript();
      handleNext();
    }
  };

  // TRIGGER EFFECT
  useEffect(() => {
    if (isValidCommand) {
      validateAnswer()
        .then((response) => {
          if (response.status === true) {
            setScore((prevScore) => prevScore + 100 / totalQuestion);
            toast.success("Jawaban benar!", {
              autoClose: 2000
            });

            answerCorrectRef.current.play().catch((error) => {
              console.error("Error playing the audio:", error);
            });
          }
          if (response.status === 400) {
            toast.error("Jawaban salah!", {
              autoClose: 2000
            });

            answerWrongRef.current.play().catch((error) => {
              console.error("Error playing the audio:", error);
            });
          }
        })
        .catch((error) => {
          console.error("Error validating answer:", error);
        });
    }
  }, [isValidCommand]);

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
    }

    if (countdown <= 15 && countdown > 0) {
      startListening();
    }

    if (countdown === 0) {
      handleNextQuiz();
    }

    return () => {
      clearInterval(timer);
    };
  }, [listening, startListening]);

  useEffect(() => {
    if (
      !isPlayingIntro &&
      audioIntroUrl &&
      audioIntroRef.current &&
      numberQuiz > 1
    ) {
      audioIntroRef.current.play().catch((error) => {
        console.error("Error playing the audio:", error);
      });
    }
  }, [audioIntroUrl]);

  useEffect(() => {
    setIsPlayingIntro(true);
    audioIntroRef.current.play().catch((error) => {
      console.error("Error playing the audio:", error);
    });
  }, [audioIntroUrl]);

  useEffect(() => {
    if (numberQuiz > 1 && audioQuestionRef.current) {
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
          onPlaying={() => stopListening()}
          ref={audioIntroRef}
          className='hidden'
          src={audioIntroUrl}
        />
        <audio
          ref={audioQuestionRef}
          onEnded={() => startListening()}
          onPlay={() => stopListening()}
          src={audioQuestionUrl}
          className='hidden'
        />
        <audio
          ref={answerCorrectRef || answerWrongRef}
          onEnded={handleNextQuiz}
          src={answerCorrectUrl?.data ||answerWrongUrl?.data}
          className='hidden'
        />
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
      <ScoreDialog onOpen={isShowScore} onBack={onCancelQuiz} score={score} />
    </div>
  );
};

export default WordCompletionPage;
