/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Progress } from "@/components";
import { ROUTE } from "@/lib/constants";
import { CancelDialog } from "@/sections/quiz";
import { CircleCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Toastify from "@/components/toast";
import useSpeaker from "@/components/speaker";
import useMicrophone from "@/components/input-voice";
import useSWR from "swr";
import { get } from "lodash";
import { useParams } from "react-router-dom";
import fetcher from "@/lib/fetcher";
import { MOCK_QUESTIONS } from "@/lib/mock";
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

function validateIndex(questionData) {
  const correctAnswer = questionData.answer;
  const sanitized = questionData.options.findIndex(option => option.option === correctAnswer);

  return sanitized;
}

export const MultipleChoicePage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { transcript, resetTranscript } = useSpeechRecognition();

  const startListening = () => {
    SpeechRecognition.startListening({ continuous: true, language : 'id-ID' });
  };

  const stopListening = () => {
    SpeechRecognition.stopListening();
  };

  const { greeting, stopSpeech } = useSpeaker();
  const optionsColors = ["#2971B0", "#63CACA", "#EFAB26", "#D6536D"];
  const hoverColors = ["#14417E", "#318091", "#AC6D13", "#9A2955"];
  const [countdown, setCountdown] = useState(20);
  const [cancelQuiz, setCancelQuiz] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState('');
  const [selectedOption, setSelectedOption] = useState('');
  const [numberQuiz, setNumberQuiz] = useState(0);

  // fetch data
  const { data: questionResponse } = useSWR(`/quiz/multiple-choice/${id}?number=${numberQuiz}`, fetcher, {
    shouldRetryOnError: false,
    revalidateOnFocus: false,
  });
  const questionList = questionResponse?.data || MOCK_QUESTIONS[numberQuiz];
  const optionList = get(questionList, 'options', []);
  const question = get(questionList, 'question', '');
  const answer = get(questionList, 'answer', '');
  console.log(transcript);

  const getBackgroundColor = (index, isHovered) => {
    if (selectedIndex === index) {
      return hoverColors[index % hoverColors.length];
    } else if (isHovered) {
      return hoverColors[index % hoverColors.length];
    } else {
      return optionsColors[index % optionsColors.length];
    }
  };

  const onHoverIn = (e, index) => {
    e.currentTarget.style.backgroundColor = getBackgroundColor(index, true);
  };

  const onHoverOut = (e, index) => {
    e.currentTarget.style.backgroundColor = getBackgroundColor(index, false);
  };

  const onSelectedAnswer = (index, value) => {
    setSelectedIndex(index);
    setSelectedOption(value.option);
  };

  const handleBackButton = () => {
    setCancelQuiz(true);
  };

  const handleNext = () => {
    setNumberQuiz((prevPage) => prevPage + 1);
  };

  const handleNextQuiz = () => {  
    setTimeout(() => {
      setCountdown(20);
      setSelectedIndex('');
      setSelectedOption('');
      stopListening();
      handleNext();
      resetTranscript();
    }, 3000);
  };
  

  const onCancelQuiz = () => {
    navigate(ROUTE.Home);
  };
  
  const renderCheckmark = (index) => {
    if (selectedIndex === index) {
      return (
        <div className="absolute top-2 right-2">
          <Button variant="ghost" className="bg-accent" size="icon">
            <CircleCheck />
          </Button>
        </div>
      );
    }
  };

  useEffect(() => {
    if(transcript.includes(answer)){
      setSelectedIndex(validateIndex(MOCK_QUESTIONS[numberQuiz]));
    }
  }, [transcript]);

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000);
    }

    if (countdown > 10) {
      greeting(question, 2);
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

  return (
    <div className="mt-16 h-screen flex flex-col">
      <Toastify
        transcript={selectedOption || transcript}
        answer={answer}
        toastText="Jawaban Anda Benar"
      />
      <Progress
        value={(countdown / 20) * 100}
        className="w-full fixed top-0 left-0 rounded-none h-2 bg-green-500"
      />
      <div className="text-center pb-32">
        <h1 className="text-4xl text-white font-poppins font-medium">
          {question}
        </h1>
      </div>

      <div className="grid grid-cols-4 gap-4 text-center flex-grow">
        {optionList.map((option, index) => (
          <button
            key={option.option}
            onClick={() => onSelectedAnswer(index, option)}
            className="relative w-full rounded-lg flex items-center justify-center h-full cursor-pointer transition-colors duration-300"
            style={{
              backgroundColor: getBackgroundColor(index, false),
              backgroundImage:
                "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.2) 100%)",
            }}
            onMouseEnter={(e) => onHoverIn(e, index)}
            onMouseLeave={(e) => onHoverOut(e, index)}
          >
            <h3 className="font-bold text-3xl font-poppins text-white">
              {option.text}
            </h3>

            {renderCheckmark(index)}
            <div className="absolute bottom-0 rounded-b-lg w-full h-4 bg-black opacity-30"></div>
          </button>
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
