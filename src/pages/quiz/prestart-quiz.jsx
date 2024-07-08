/* eslint-disable react-hooks/exhaustive-deps */
import { useSpeaker, useMicrophone } from "@/hooks";
import { useEffect, useState } from "react";
import { Button, Progress } from "@/components";
import { useNavigate } from "react-router-dom";

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

  console.log(transcript);
  useEffect(() => {
    if (transcript.includes("MULAI")) {
      HandleStartQuiz();
    }
  }, [transcript]);

  return (
    <div className="mt-16 h-screen flex flex-col">
      <Progress
        value={(countdown / 10) * 100}
        className="w-full fixed top-0 left-0 rounded-none h-2 bg-green-500"
      />
      <div className="text-center pb-4">
        <h1 className="text-4xl text-white font-poppins font-medium">
          Apakah Kamu Siap Memulai Quiz?
        </h1>
      </div>
      <div className="flex justify-center items-center pb-4 pt-4">
        FLOW HERE
      </div>

      <Button
        onClick={HandleStartQuiz}
        className="bg-red-500 mt-8 hover:bg-red-700 font-poppins font-bold text-white"
      >
        Mulai
      </Button>
    </div>
  );
};

export default PrestartQuizPage;
