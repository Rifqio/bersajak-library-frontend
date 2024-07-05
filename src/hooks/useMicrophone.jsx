import { useEffect } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

const useMicrophone = (language = 'id-ID') => {
  const { transcript: rawTranscript, resetTranscript } = useSpeechRecognition();
  const transcript = rawTranscript.toUpperCase();

  const startListening = () => {
    SpeechRecognition.startListening({ continuous: true, language });
  };

  const stopListening = () => {
    SpeechRecognition.stopListening();
  };

  useEffect(() => {
    return () => {
      SpeechRecognition.abortListening();
    };
  }, []);

  return { transcript, resetTranscript, startListening, stopListening };
};

export default useMicrophone;
