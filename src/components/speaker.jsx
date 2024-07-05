import { useEffect, useRef } from 'react';

const useSpeaker = () => {
  const utteranceRef = useRef(null);
  const countRef = useRef(0);

  useEffect(() => {
    utteranceRef.current = new SpeechSynthesisUtterance();
    return () => {
      if (utteranceRef.current && speechSynthesis.speaking) {
        speechSynthesis.cancel();
      }
    };
  }, []);

  const greeting = (text, times = 1) => {
    const synth = window.speechSynthesis;
    utteranceRef.current.text = text;
    utteranceRef.current.lang = 'id-ID';

    utteranceRef.current.onend = () => {
      countRef.current++;
      if (countRef.current < times) {
        synth.speak(utteranceRef.current);
      } else {
        countRef.current = 0;
      }
    };

    synth.speak(utteranceRef.current);
  };

  return { greeting };
};

export default useSpeaker;
