import { useEffect, useRef } from 'react';

const useSpeaker = () => {
  const utteranceRef = useRef(null);

  const greeting = (text) => {
    const synth = window.speechSynthesis;
    utteranceRef.current.text = text;
    utteranceRef.current.lang = 'id-ID';
    synth.speak(utteranceRef.current);
  };

  useEffect(() => {
    utteranceRef.current = new SpeechSynthesisUtterance();
    return () => {
      if (utteranceRef.current && window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  return { greeting };
};

export default useSpeaker;
