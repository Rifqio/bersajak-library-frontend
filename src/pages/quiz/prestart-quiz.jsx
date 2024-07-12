/* eslint-disable react-hooks/exhaustive-deps */
import { useSpeaker, useMicrophone } from "@/hooks";
import { useEffect, useState } from "react";
import { Button, Progress } from "@/components";
import { useNavigate } from "react-router-dom";
import BooksIllustration from "../../assets/board.svg";

const PrestartQuizPage = () => {
  const { transcript, startListening, stopListening, resetTranscript } =
    useMicrophone();
  const { greeting, stopSpeech } = useSpeaker();
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(10);

  const HandleStartQuiz = () => {
    setTimeout(() => {
      stopListening();
      resetTranscript();
      navigate("/quiz/word-completion/1");
    }, 2000);
  };

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000);
    }

    if (countdown > 5) {
      greeting("Apakah Kamu Siap Memulai Quiz?", 2);
    } else if (countdown <= 5 && countdown > 0) {
      stopSpeech();
      startListening();
    }

    return () => {
      clearInterval(timer);
    };
  }, [countdown, startListening, stopSpeech]);

  useEffect(() => {
    if (transcript.includes("MULAI" || "SIAP")) {
      HandleStartQuiz();
    }
  }, [transcript]);

  return (
    <div className='mt-16 h-screen flex flex-col'>
      <Progress
        value={(countdown / 10) * 100}
        className='w-full fixed top-0 left-0 rounded-none h-2 bg-green-500'
      />
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
            style={{ top: "calc(50% - 60px)" }}
          >
            Apakah Kamu Siap Memulai Quiz?
          </h1>
          <div className='absolute left-1/2 transform -translate-x-1/2 bottom-10'>
            <Button
              onClick={HandleStartQuiz}
              className='bg-red-500 hover:bg-red-700 font-poppins font-bold text-white'
              style={{ width: "200px" }}
            >
              Mulai
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrestartQuizPage;
