import { useRef, useState } from "react";

const useSpeaker = () => {
  const utteranceRef = useRef(new SpeechSynthesisUtterance());
  const synth = window.speechSynthesis;
  const [isSpeaking, setIsSpeaking] = useState(false);

  const greeting = (text, loop = 2) => {
    utteranceRef.current.text = text;
    utteranceRef.current.rate = 0.8;
    utteranceRef.current.lang = "id-ID";

    utteranceRef.current.onstart = () => setIsSpeaking(true);
    utteranceRef.current.onend = () => {
      setIsSpeaking(false);
      stopSpeech();
      if (loop > 1) {
        greeting(text, loop - 1);
      }
    };

    if (!synth.speaking) {
      synth.speak(utteranceRef.current);
    }
  };

  const speaking = () => isSpeaking;

  const stopSpeech = () => {
    if (synth.speaking) {
      utteranceRef.current.onend = () => {
        synth.cancel();
        setIsSpeaking(false);
      };
    } else {
      synth.cancel();
      setIsSpeaking(false);
    }
  };

  const playSpeech = () => {
    if (!synth.speaking && !synth.pending) {
      synth.speak(utteranceRef.current);
    }
  };

  return { greeting, speaking, stopSpeech, playSpeech };
};

export default useSpeaker;
