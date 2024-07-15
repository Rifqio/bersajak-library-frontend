import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components";
import { ROUTE } from "@/lib/constants";
import { fetcher } from "@/lib/fetcher";
import { useSwr } from "@/lib/swr";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import SpeechRecognition,{ useSpeechRecognition } from "react-speech-recognition";

const ScoreDialog = ({ onOpen, score }) => {
  const navigate = useNavigate();
  const scoreAudioRef = useRef(null);
  const outroAudioRef = useRef(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const { data: scoreAudio } = useSwr(`/guide/score?score=${score}`, fetcher);
  const { data: outroData } = useSwr(`/guide/games?type=outro`, fetcher);
  const audioOutroUrl = outroData?.data;
  const roundedScore = score.toFixed(0);
  const percentage = (roundedScore / 100) * 100;
  const circumference = 2 * Math.PI * 50;
  const offset = circumference - (percentage / 100) * circumference;

  const commands = [
    {
      command: [
        "pilih buku",
        "selesai",
      ],
      callback: (command) => {
        if (command === "pilih buku") {
          navigate(ROUTE.Home);
        } else {
          window.location.reload();
        }
      },
      isFuzzyMatch: true,
      bestMatchOnly: true
    }
  ];

  useSpeechRecognition({ commands });

  useEffect(() => {
    if (isPlayingAudio) {
      SpeechRecognition.stopListening();
    } else {
      SpeechRecognition.startListening({ continuous: true, language: 'id-ID' });
    }
    return () => {
      SpeechRecognition.stopListening();
    };
  }, [isPlayingAudio]);

  const handleReload = () => {
    window.location.reload();
  }

  const handleGoTo = () => {
    navigate(ROUTE.Home);
  };

  const handleScoreAudioEnded = () => {
    if (outroAudioRef.current) {
      outroAudioRef.current.play();
    }
  };

  return (
    <Dialog open={onOpen}>
      <DialogContent className='font-poppins'>
        <DialogHeader>
          <DialogTitle className='text-center text-3xl'>Skor Kamu</DialogTitle>
        </DialogHeader>
        <div className='relative pt-10 flex justify-center items-center'>
          <svg className='absolute w-52 h-52'>
            <circle
              cx='50%'
              cy='50%'
              r='50'
              className='stroke-gray-300'
              strokeWidth='10'
              fill='none'
            />
            <circle
              cx='50%'
              cy='50%'
              r='50'
              className='stroke-green-600'
              strokeWidth='10'
              fill='none'
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              style={{ transition: "stroke-dashoffset 0.5s ease" }}
            />
          </svg>
          <div className='text-5xl font-bold text-green-600'>
            {roundedScore}
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleReload} variant='outline'>
            Ulangi
          </Button>
          <Button onClick={() => handleGoTo()} variant='destructive'>
            Kembali
          </Button>
          <audio
            ref={scoreAudioRef}
            src={scoreAudio?.data}
            onPlay={() => setIsPlayingAudio(true)}
            autoPlay
            className='hidden'
            onEnded={handleScoreAudioEnded}
          />
          <audio
            ref={outroAudioRef}
            src={audioOutroUrl}
            className='hidden'
            onEnded={() => setIsPlayingAudio(false)}
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

ScoreDialog.propTypes = {
  onOpen: PropTypes.bool.isRequired,
  onBack: PropTypes.func.isRequired,
  score: PropTypes.string
};

export default ScoreDialog;
