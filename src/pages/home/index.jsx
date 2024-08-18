import BookList from "@/sections/book/book-list";
import BooksIllustration from "../../assets/books.svg";
import { Button } from "@/components";
import { useEffect, useRef, useState } from "react";
import { ModalSound } from "@/sections/home/modal-sound";
import { useAudioStore } from "@/zustand";
import { Volume2, VolumeX } from "lucide-react";
import { useSwr } from "@/lib/swr";
import { fetcher } from "@/lib/fetcher";
import { BookListLoading } from "@/sections/book/book-list-loading";
import SpeechRecognition, {
  useSpeechRecognition
} from "react-speech-recognition";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const [soundModal, setSoundModal] = useState(false);
  const [queryAudioEnabled, setQueryAudioEnabled] = useState(
    "isAudioEnabled=true"
  );
  const [onPlayGreetings, setOnPlayGreetings] = useState(true);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [navigationUrl, setNavigationUrl] = useState(null);
  const [bookListUrl, setBookListUrl] = useState(null);
  const [bookChooseUrl, setBookChooseUrl] = useState(null);

  const { data, isLoading } = useSwr("/book/list", fetcher);
  const { data: navigationData } = useSwr(navigationUrl, fetcher);
  const { data: toActivateSoundAudio } = useSwr(
    "/guide/audio-options",
    fetcher
  );
  const { data: bookListAudio } = useSwr(bookListUrl, fetcher);
  const { data: chooseAudioData } = useSwr(
    `/guide/home?${queryAudioEnabled}`,
    fetcher
  );
  const { data: chooseBookData } = useSwr(bookChooseUrl, fetcher);

  const { isAudioEnabled, firstVisit, setIsAudioEnabled } = useAudioStore();

  const navigate = useNavigate();
  const greetingAudioRef = useRef(null);
  const audioNavigationRef = useRef(null);
  const bookListRef = useRef(null);
  const toActivateSoundAudioRef = useRef(null);
  const chooseEnableAudioRef = useRef(null);
  const chooseBookAudioRef = useRef(null);
  const availableBookAudioRef = useRef(null);

  useEffect(() => {
    // if (firstVisit) {
    setSoundModal(true);
    setOnPlayGreetings(true);
    new Audio("/audio/greeting.mp3").play();
    // }
  }, []);

  useEffect(() => {
    if (isAudioPlaying) {
      SpeechRecognition.stopListening();
    } else if (!isAudioPlaying && isAudioEnabled) {
      SpeechRecognition.startListening({ continuous: true, language: "id-ID" });
    }
  }, [isAudioPlaying, isAudioEnabled, onPlayGreetings]);

  const commands = [
    {
      command: ["ya", "tidak"],
      callback: (command) => {
        if (firstVisit && !isAudioPlaying && soundModal) {
          if (command === "ya" || command.includes("ya")) {
            onEnableAudio();
          } else if (command === "tidak" || command.includes("tidak")) {
            onDisabledAudio();
          } else {
            console.error("Command not found");
          }
        }
      },
      isFuzzyMatch: true,
      fuzzyMatchingThreshold: 0.2,
      bestMatchOnly: true
    },
    {
      command: ["bawah"],
      callback: () => {
        window.scrollTo(0, document.body.scrollHeight);
      },
      isFuzzyMatch: true,
      fuzzyMatchingThreshold: 0.2,
      bestMatchOnly: true
    },
    {
      command: ["atas"],
      callback: () => {
        window.scrollTo(0, 0);
      },
      isFuzzyMatch: true,
      fuzzyMatchingThreshold: 0.2,
      bestMatchOnly: true
    },
    {
      command: ["pilih buku"],
      callback: () => {
        window.scrollTo(0, document.body.scrollHeight);
        chooseBookAudioRef.current.play();
        handleSelectBooks();
      },
      isFuzzyMatch: true,
      fuzzyMatchingThreshold: 0.2,
      bestMatchOnly: true
    },
    // ! Hardcoded at the momment due to prototype
    {
      command: [
        "suara gemuruh itu",
        "hutan larangan",
        "membuat ekoenzim",
        "wabah penyakit"
      ],
      callback: (command) => {
        if (command === "suara gemuruh itu") {
          navigate("/book/read/audio/2");
        } else if (command === "hutan larangan") {
          navigate("/book/read/audio/3");
        } else if (command.includes("membuat")) {
          navigate("/book/read/audio/4");
        } else if (command.includes("wabah")) {
          navigate("/book/read/audio/5");
        }
      },
      isFuzzyMatch: true,
      // fuzzyMatchingThreshold: 0.2,
      bestMatchOnly: true
    }
  ];

  const { isMicrophoneAvailable } = useSpeechRecognition({ commands });

  const onEnableAudio = () => {
    setSoundModal(false);
    setIsAudioPlaying(true);
    setIsAudioEnabled(true);
    chooseEnableAudioRef.current.play();
    setNavigationUrl("/guide/navigation");
  };

  const onDisabledAudio = () => {
    setSoundModal(false);
    setIsAudioEnabled(false);
    setQueryAudioEnabled("isAudioEnabled=false");
    chooseEnableAudioRef.current.play();
  };

  const onEndedGreeting = () => {
    if (firstVisit) {
      toActivateSoundAudioRef.current.play();
      setOnPlayGreetings(false);
    } else {
      setIsAudioPlaying(false);
      setOnPlayGreetings(false);
      SpeechRecognition.startListening({ continuous: true, language: "id-ID" });
    }
  };

  const handleSelectBooks = () => {
    setBookListUrl("/guide/book-list");
    setIsAudioPlaying(true);
  };

  const onPlayChooseBook = () => {
    setIsAudioPlaying(true);
    setBookChooseUrl("/guide/any?type=book-choose");
    availableBookAudioRef.current.play();
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
          <p className='text-gray-600 pb-4 tracking-tight'>
            Pariatur laborum veniam irure id Lorem id dolor magna pariatur
            dolore deserunt. Adipisicing ullamco anim nisi exercitation Lorem
            exercitation sit anim sunt.
          </p>
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
      <div
        id='book-list'
        ref={bookListRef}
        className='mt-4 font-nunito px-4 md:px-0'
      >
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
        {/* Selamat datang di bersajak... */}
        <audio
          ref={greetingAudioRef}
          autoPlay
          onPlay={() => setIsAudioPlaying(true)}
          onEnded={onEndedGreeting}
          // src={audioUrl}
          src='/audio/greeting.mp3'
          className='hidden'
        />
        {/* Untuk mengaktifkan .... */}
        <audio
          ref={toActivateSoundAudioRef}
          onPlay={() => setIsAudioPlaying(true)}
          src={toActivateSoundAudio?.data?.audio}
          onEnded={() => setIsAudioPlaying(false)}
        />
        {/* Suara diaktifkan / Suara dinonaktifkan... */}
        <audio
          onPlay={() => setIsAudioPlaying(true)}
          ref={chooseEnableAudioRef}
          onEnded={() => {
            audioNavigationRef.current.play();
          }}
          src={chooseAudioData?.data?.audio}
          className='hidden'
        />
        {/* Ada beberapa navigasi yang dapat kamu gunakan... */}
        <audio
          src={navigationData?.data?.audio}
          ref={audioNavigationRef}
          onEnded={() => {
            setIsAudioPlaying(false);
            SpeechRecognition.startListening({
              continuous: true,
              language: "id-ID"
            });
          }}
          className='hidden'
        />
        <audio
          onEnded={() => {
            onPlayChooseBook();
          }}
          onPlay={() => SpeechRecognition.stopListening()}
          ref={chooseBookAudioRef}
          src={bookListAudio?.data?.audio}
          className='hidden'
        />
        <audio
          onPlay={() => SpeechRecognition.stopListening()}
          ref={availableBookAudioRef}
          src={chooseBookData?.data}
          onEnded={() => setIsAudioPlaying(false)}
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
        disabled={isAudioPlaying}
        onOpen={soundModal}
        onEnableAudio={onEnableAudio}
        onOpenChange={setSoundModal}
        onDisabledAudio={onDisabledAudio}
      />
    </>
  );
};

export default HomePage;
