import { useRef } from 'react';

const useSpeechSynthesis = () => {
  const utteranceRef = useRef(new SpeechSynthesisUtterance());
  const synth = window.speechSynthesis;

  const greeting = (text, perulangan = 2) => {
    utteranceRef.current.text = text;
    utteranceRef.current.rate = 0.8;
    utteranceRef.current.lang = 'id-ID';

    const speak = () => {
      if (synth.speaking) {
        console.error('SpeechSynthesisUtterance sedang berbicara.');
        return;
      }
      for (let i = 0; i < perulangan; i++) {
        synth.speak(utteranceRef.current);
      }
    };

    speak();
  };

  const stopSpeech = () => {
    if (synth.speaking) {
      utteranceRef.current.onend = () => {
        synth.cancel();
      };
    } else {
      synth.cancel();
    }
  };

  const playSpeech = () => {
    if (!synth.speaking && !synth.pending) {
      synth.speak(utteranceRef.current);
    }
  };

  return { greeting, stopSpeech, playSpeech };
};

export default useSpeechSynthesis;
