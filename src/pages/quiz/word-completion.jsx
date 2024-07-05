import { useEffect, useState } from "react";
import { Button, Progress } from "@/components";
import useMicrophone from "@/components/input-voice";
import { ROUTE } from "@/lib/constants";
import { MOCK_WORD_COMPLETIONS } from "@/lib/mock";
import { CancelDialog } from "@/sections/quiz";
import { useNavigate } from "react-router-dom";
import useSpeaker from "@/components/speaker";

const WordCompletionPage = () => {
  const { transcript } = useMicrophone();
  const { greeting } = useSpeaker();
  // const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const { question, imageUrl, answer, clue } = MOCK_WORD_COMPLETIONS[0];
  const splitClue = clue.split("");
  const answerQuiz = answer.split("");

  const [countdown, setCountdown] = useState(20);
  const [cancelQuiz, setCancelQuiz] = useState(false);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000);

      return () => {
        clearInterval(timer);
      };
    }
  }, [countdown]);

  const handleBackButton = () => {
    setCancelQuiz(true);
  };

  const onCancelQuiz = () => {
    navigate(ROUTE.Home);
  };

  useEffect(() => {
    greeting(question, 2);
  }, [question, greeting]);

  return (
    <div className="mt-16 h-screen flex flex-col">
      <Progress
        value={(countdown / 20) * 100}
        className="w-full fixed top-0 left-0 rounded-none h-2 bg-green-500"
      />
      <div className="text-center pb-4">
        <h1 className="text-4xl text-white font-poppins font-medium">
          {question}
        </h1>
      </div>
      <div className="flex justify-center items-center pb-4 pt-4">
        <img
          src={imageUrl}
          alt={question}
          style={{
            backgroundImage:
              "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.2) 100%)",
          }}
          className="max-w-lg max-h-max rounded-lg"
        />
      </div>
      <div className="text-center pt-4">
        {transcript.includes(answer)
          ? answerQuiz.map((letter, index) => (
              <input
                key={index}
                type="text"
                className="text-center drop-shadow-md w-12 h-12 bg-green-500 text-white font-poppins font-semibold text-2xl rounded-lg mx-2"
                style={{ border: "none" }}
                value={letter}
                readOnly
              />
            ))
          : splitClue.map((letter, index) => (
              <input
                key={index}
                type="text"
                className="text-center drop-shadow-md w-12 h-12 bg-green-500 text-white font-poppins font-semibold text-2xl rounded-lg mx-2"
                style={{ border: "none" }}
                value={letter}
                readOnly
              />
            ))}
      </div>

      <Button
        onClick={handleBackButton}
        className="bg-red-500 mt-8 hover:bg-red-700 font-poppins font-bold text-white"
      >
        Kembali
      </Button>
      <CancelDialog
        onOpen={cancelQuiz}
        onOpenChange={setCancelQuiz}
        onCancel={onCancelQuiz}
      />
    </div>
  );
};

export default WordCompletionPage;
