/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import BookList from "@/sections/book/book-list";
import BooksIllustration from "../../assets/books.svg";
import { MOCK_BOOK_LIST } from "@/lib/mock";
import { Button } from "@/components";
import { useEffect, useState } from "react";
import { ModalSound } from "@/sections/home/modal-sound";
import { useAudioStore } from "@/zustand";
import { Volume2, VolumeX } from "lucide-react";
import { useMicrophone, useSpeaker } from "@/hooks";
import { WelcomeSpeech } from "@/data/HomeSpeech";
import { useSwr } from "@/lib/swr";
import { fetcher } from "@/lib/fetcher";
import { BookListLoading } from "@/sections/book/book-list-loading";
import { useSpeechRecognition } from "react-speech-recognition";

const HomePage = () => {
  const [soundModal, setSoundModal] = useState(false);
  const { data, error, isLoading } = useSwr("/book/list", fetcher);

  const commands = [
    {
      command: ["iya", "tidak"],
      callback: ({ command }) => {
        if (command.includes("iya") || command.includes("ya")) {
          onEnableAudioSpeech();
        } else {
          onDisabledAudioSpeech();
        }
      },
      matchInterim: true
    },
    {
      command: ["aku mau", "tidak"],
      callback: ({ command }) => {
        if (command.includes("aku mau") || command.includes("mau")) {
          handleSelectReading();
        } else {
          handleSiniarSection();
        }
      },
      matchInterim: true
    }
  ];

  const { startListening, stopListening } =
    useMicrophone();
  const { transcript, resetTranscript } = useSpeechRecognition({ commands });

  const { greeting, stopSpeech } = useSpeaker();
  const { isAudioEnabled, firstVisit, setIsAudioEnabled } = useAudioStore();
  const [countdown, setCountdown] = useState(20);

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000);
    }

    if (countdown > 10 && firstVisit) {
      greeting(WelcomeSpeech, 1);
    } else if (countdown <= 5 && countdown > 0) {
      stopSpeech();
      startListening();
    }

    return () => {
      clearInterval(timer);
    };
  }, [countdown, greeting, startListening, stopSpeech]);

  console.log(transcript);

  const handleReadingSection = () => {
    setTimeout(() => {
      greeting("Apakah kamu mau membaca buku?", 1);
      resetTranscript();
      startListening();
    }, 2000);
  };
  const handleSelectReading = () => {
    setTimeout(() => {
      greeting("Mau baca buku apa hari ini?", 1);
      resetTranscript();
      startListening();
    }, 2000);
  };

  const handleSiniarSection = () => {
    setTimeout(() => {
      greeting("Apakah kamu ingin mendengar siniar?", 1);
      resetTranscript();
      startListening();
    }, 2000);
  };

  const onEnableAudioSpeech = () => {
    setIsAudioEnabled(true);
    setSoundModal(false);
    handleReadingSection();
  };

  const onDisabledAudioSpeech = () => {
    setIsAudioEnabled(false);
    stopListening();
    setSoundModal(false);
  };

  const onEnableAudio = () => {
    setSoundModal(false);
    setIsAudioEnabled(true);
  };

  const onDisabledAudio = () => {
    setIsAudioEnabled(false);
    setSoundModal(false);
  };

  const HeroSection = () => {
    return (
      <div className='relative flex flex-col md:flex-row justify-between'>
        <div className="absolute inset-0 bg-cover bg-[url('/grid.svg')] opacity-30 z-0"></div>
        <div className='font-nunito w-full md:w-3/4 mt-20 relative z-10 px-4 md:px-0'>
          <h1 className='font-bold leading-normal text-3xl md:text-5xl pb-4 tracking-tighter'>
            Membuka <span className='text-[#5E8EAC]'>petualangan</span>{" "}
            <span className='text-[#DE6C6B]'>baru</span> di setiap halaman
          </h1>
          {/* <p className='text-gray-600 pb-4 tracking-tight'>
            Pariatur laborum veniam irure id Lorem id dolor magna pariatur
            dolore deserunt. Adipisicing ullamco anim nisi exercitation Lorem
            exercitation sit anim sunt.
          </p> */}
          {/* <Button className='bg-[#EEBE62] text-[#40485A] font-bold font-nunito text-base hover:bg-[#BF8140]'>
            Gabung sekarang
          </Button> */}
        </div>
        <div className='items-start mt-10 md:-mt-24 relative z-10 px-4 md:px-0'>
          <img
            src={BooksIllustration}
            alt='Books Illustration'
            className='w-full md:w-auto'
          />
        </div>
      </div>
    );
  };

  const BookListSection = () => {
    return (
      <div className='mt-4 font-nunito px-4 md:px-0'>
        <h1 className='text-center font-bold tracking-tighter text-2xl md:text-3xl'>
          Mau baca buku apa hari ini?
        </h1>
        {/* <p className='text-center text-gray-600 mt-2'>
          Pariatur laborum veniam irure id Lorem id dolor magna pariatur dolore
          deserunt. Adipisicing ullamco anim nisi exercitation Lorem
          exercitation sit anim sunt.
        </p> */}
        <div className='mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
          {data?.data?.map((book) => (
            <BookList
              isLoading={isLoading}
              key={book.id}
              id={book.id}
              title={book.title}
              author={book.author}
              imageUrl={book.thumbnail_url}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <>
      {HeroSection()}
      {isLoading ? <BookListLoading /> : BookListSection()}
      <Button
        onClick={() => setSoundModal(true)}
        className='fixed bottom-14 left-5 z-30 rounded-full w-14 h-14'
      >
        {isAudioEnabled ? <Volume2 size={24} /> : <VolumeX size={24} />}
      </Button>
      <ModalSound
        onOpen={firstVisit || soundModal}
        onEnableAudio={onEnableAudio}
        onOpenChange={setSoundModal}
        onDisabledAudio={onDisabledAudio}
      />
    </>
  );
};

export default HomePage;
