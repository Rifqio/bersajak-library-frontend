import { useEffect } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

const useMicrophone = (language = 'id-ID') => {
  const { transcript, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();

  useEffect(() => {
    if (browserSupportsSpeechRecognition) {
      SpeechRecognition.startListening({ continuous: true, language });
    }

    return () => {
      SpeechRecognition.stopListening();
    };
  }, [browserSupportsSpeechRecognition, language]);

  return { transcript, resetTranscript };
};

export default useMicrophone;
