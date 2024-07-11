import BookList from "@/sections/book/book-list";
import BooksIllustration from "../../assets/books.svg";
import { Button } from "@/components";
import { useEffect, useRef, useState } from "react";
import { ModalSound } from "@/sections/home/modal-sound";
import { useAudioStore } from "@/zustand";
import { Volume2, VolumeX } from "lucide-react";
import { useMicrophone, useSpeaker } from "@/hooks";
import { useSwr } from "@/lib/swr";
import { fetcher } from "@/lib/fetcher";
import { BookListLoading } from "@/sections/book/book-list-loading";
import { useSpeechRecognition } from "react-speech-recognition";

const HomePage = () => {
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
          // handleSelectReading();
        } else {
          // handleSiniarSection();
        }
      },
      matchInterim: true
    }
  ];

  const [soundModal, setSoundModal] = useState(false);
  const [queryHome, setQueryHome] = useState("greetings=true");
  const [onPlayGreetings, setOnPlayGreetings] = useState(false);
  const [stepAudio, setStepAudio] = useState(1);
  const [navigationUrl, setNavigationUrl] = useState(null);
  const [bookListUrl, setBookListUrl] = useState(null);
  const [bookListInView, setBookListInView] = useState(false);

  const { data: navigationData } = useSwr(navigationUrl, fetcher);
  const { data, isLoading } = useSwr("/book/list", fetcher);
  const { data: bookListAudio } = useSwr(bookListUrl, fetcher);
  const { data: homeData } = useSwr(`/guide/home?${queryHome}`, fetcher);

  const { startListening, stopListening } = useMicrophone();
  const { resetTranscript } = useSpeechRecognition({ commands });

  const { greeting } = useSpeaker();
  const { isAudioEnabled, firstVisit, setIsAudioEnabled } = useAudioStore();

  const audioRef = useRef(null);
  const audioNavigationRef = useRef(null);
  const bookListRef = useRef(null);
  const scrollAudioRef = useRef(null);
  const audioUrl = homeData?.data?.audio;

  useEffect(() => {
    if (audioUrl && audioRef.current) {
      if (queryHome !== "greetings=true") {
        audioRef.current.play().catch(error => console.error('Error playing greeting audio:', error));
      }
    }
  }, [audioUrl, queryHome]);

  useEffect(() => {
    const firstCondition = navigationData?.data?.audio && audioNavigationRef.current;
    const secondCondition = !onPlayGreetings && stepAudio === 2;

    if (firstCondition && secondCondition) {
      audioNavigationRef.current.play().catch(error => console.error('Error playing navigation audio:', error));
    }

    return () => {
      if (audioNavigationRef.current) {
        audioNavigationRef.current.pause();
      }
    };
  }, [navigationData, onPlayGreetings, stepAudio]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setBookListInView(true);
        } else {
          setBookListInView(false);
        }
      },
      { threshold: 0.5 }
    );

    if (bookListRef.current) {
      observer.observe(bookListRef.current);
    }

    return () => {
      if (bookListRef.current) {
        observer.unobserve(bookListRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (bookListInView && scrollAudioRef.current) {
      console.log('Playing scroll audio');
      scrollAudioRef.current.play().catch(error => console.error('Error playing scroll audio:', error));
    } else if (scrollAudioRef.current) {
      console.log('Pausing scroll audio');
      scrollAudioRef.current.pause();
    }
  }, [bookListInView]);

  const onEnableAudioSpeech = () => {
    setIsAudioEnabled(true);
    setSoundModal(false);
  };

  const onDisabledAudioSpeech = () => {
    setIsAudioEnabled(false);
    stopListening();
    setSoundModal(false);
  };

  const onEnableAudio = () => {
    setQueryHome("isAudioEnabled=true");
    setSoundModal(false);
    setIsAudioEnabled(true);
    setNavigationUrl("/guide/navigation");
  };

  const onDisabledAudio = () => {
    setQueryHome("isAudioEnabled=false");
    setIsAudioEnabled(false);
    setSoundModal(false);
  };

  const onEndedGreeting = () => {
    setOnPlayGreetings(false);
    setStepAudio(2);
  };

  const handleSelectBooks = () => {
    setBookListUrl("/guide/book-list");
    setStepAudio(3);
  }

  const HeroSection = () => {
    return (
      <div className='relative flex flex-col md:flex-row justify-between'>
        <div className="absolute inset-0 bg-cover bg-[url('/grid.svg')] opacity-30 z-0"></div>
        <div className='font-nunito w-full md:w-3/4 mt-20 relative z-10 px-4 md:px-0'>
          <h1 className='font-bold leading-normal text-3xl md:text-5xl pb-4 tracking-tighter'>
            Membuka <span className='text-[#5E8EAC]'>petualangan</span>{" "}
            <span className='text-[#DE6C6B]'>baru</span> di setiap halaman
          </h1>
          <p className='text-gray-600 pb-4 tracking-tight'>
            Pariatur laborum veniam irure id Lorem id dolor magna pariatur
            dolore deserunt. Adipisicing ullamco anim nisi exercitation Lorem
            exercitation sit anim sunt.
          </p>
          <Button className='bg-[#EEBE62] text-[#40485A] font-bold font-nunito text-base hover:bg-[#BF8140]'>
            Gabung sekarang
          </Button>
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
      <div id='book-list' ref={bookListRef} className='mt-4 font-nunito px-4 md:px-0'>
        <h1 className='text-center font-bold tracking-tighter text-2xl md:text-3xl'>
          Mau baca buku apa hari ini?
        </h1>
        <p className='text-center text-gray-600 mt-2'>
          Pariatur laborum veniam irure id Lorem id dolor magna pariatur dolore
          deserunt. Adipisicing ullamco anim nisi exercitation Lorem
          exercitation sit anim sunt.
        </p>
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

  const AudioSection = () => {
    return (
      <>
        <audio
          autoPlay={firstVisit && isAudioEnabled}
          ref={audioRef}
          onPlay={() => setOnPlayGreetings(true)}
          onEnded={onEndedGreeting}
          src={audioUrl}
          className='hidden'
        />
        <audio
          src={navigationData?.data?.audio}
          ref={audioNavigationRef}
          onEnded={handleSelectBooks}
          className='hidden'
        />
        <audio
          ref={scrollAudioRef}
          src={bookListAudio?.data?.audio}
          className='hidden'
        />
      </>
    );
  };

  return (
    <>
      {AudioSection()}
      {HeroSection()}
      {isLoading ? <BookListLoading /> : BookListSection()}
      <Button
        onClick={() => setSoundModal(true)}
        className='fixed bottom-14 left-5 z-30 rounded-full w-14 h-14'
      >
        {isAudioEnabled ? <Volume2 size={24} /> : <VolumeX size={24} />}
      </Button>
      <ModalSound
        disabled={onPlayGreetings}
        onOpen={firstVisit || soundModal}
        onEnableAudio={onEnableAudio}
        onOpenChange={setSoundModal}
        onDisabledAudio={onDisabledAudio}
      />
    </>
  );
};

export default HomePage;
