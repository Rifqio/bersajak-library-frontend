import SpeechRecognition, {
  useSpeechRecognition
} from "react-speech-recognition";
import { Button } from "@/components";
import BooksIllustration from "../../assets/books.svg";
import CloudIllustration from "../../assets/cloud.svg";
import { Navbar } from "@/sections";
import { useSwr } from "@/lib/swr";
import { fetcher } from "@/lib/fetcher";
import BookList from "@/sections/book/book-list";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@/components/carousel";
import { ModalSound } from "@/sections/home/modal-sound";
import { useEffect, useRef, useState } from "react";
import { useAudioStore } from "@/zustand";
import { useNavigate } from "react-router-dom";

export const NewHomePage = () => {
  const { setIsAudioEnabled, isAudioEnabled } = useAudioStore();

  const [onPlayGreetings, setOnPlayGreetings] = useState(true);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [soundModal, setSoundModal] = useState(true);
  const [bookListUrl, setBookListUrl] = useState(null);
  const [bookChooseUrl, setBookChooseUrl] = useState(null);
  const [navigationUrl, setNavigationUrl] = useState(null);

  const [queryAudioEnabled, setQueryAudioEnabled] = useState(
    "isAudioEnabled=true"
  );

  const { data: bookListAudio } = useSwr(bookListUrl, fetcher);
  const { data: chooseBookData } = useSwr(bookChooseUrl, fetcher);
  const { data: navigationData } = useSwr(navigationUrl, fetcher);
  const { data, isLoading } = useSwr("/book/list", fetcher);
  const { data: soundActivation } = useSwr("/guide/audio-options", fetcher);
  const { data: chooseAudioData } = useSwr(
    `/guide/home?${queryAudioEnabled}`,
    fetcher
  );

  const navigate = useNavigate();

  const soundActivationRef = useRef(null);
  const chooseEnableAudioRef = useRef(null);
  const audioNavigationRef = useRef(null);
  const chooseBookAudioRef = useRef(null);
  const availableBookAudioRef = useRef(null);

  const onEndedGreetings = () => {
    setOnPlayGreetings(false);
    soundActivationRef.current.play();
  };

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

  const handleSelectBooks = () => {
    setBookListUrl("/guide/book-list");
    setIsAudioPlaying(true);
  };

  const onPlayChooseBook = () => {
    setIsAudioPlaying(true);
    setBookChooseUrl("/guide/any?type=book-choose");
    availableBookAudioRef.current.play();
  };

  const commands = [
    {
      command: ["ya", "tidak"],
      callback: (command) => {
        if (!isAudioPlaying && soundModal) {
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

  const goToBookList = () => {
    navigate('/book/list');
  }

  useEffect(() => {
    if (onPlayGreetings && soundModal) {
      const greetings = new Audio("/audio/greeting.mp3");
      greetings.play();
      greetings.onended = () => onEndedGreetings();
    }
  }, [onPlayGreetings, soundModal]);

  useEffect(() => {
    if (isAudioPlaying) {
      SpeechRecognition.stopListening();
    } else if (!isAudioPlaying && !onPlayGreetings) {
      SpeechRecognition.startListening({ continuous: true, language: "id-ID" });
    }
  }, [isAudioPlaying, isAudioEnabled, onPlayGreetings]);

  useSpeechRecognition({ commands });

  const hero = () => {
    return (
      <div className='bg-home-background px-4 py-4 md:px-10 md:py-10 lg:px-20 lg:py-10'>
        <Navbar />

        <div className='font-fredoka relative flex flex-col md:flex-row justify-between h-2/4'>
          <div className="absolute inset-0 bg-cover bg-[url('/grid.svg')] opacity-30 z-0"></div>
          <div className='w-full md:w-3/4 mt-20 relative z-10 px-4 md:px-0'>
            <h1 className='font-semibold  text-white leading-normal text-3xl md:text-5xl pb-2 tracking-normal'>
              Membuka petualangan baru di setiap halaman
            </h1>
            <h2 className='text-home-yellow text-3xl font-semibold pb-2'>
              Enim do Lorem qui.
            </h2>
            <p className='text-white pb-4 font-light tracking-tight'>
              Pariatur laborum veniam irure id Lorem id dolor magna pariatur
              dolore deserunt. Adipisicing ullamco anim nisi exercitation Lorem
              exercitation sit anim sunt.
            </p>
            <Button className='bg-home-yellow font-normal text-home-background rounded-full text-base hover:bg-[#BF8140]'>
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
      </div>
    );
  };

  const subheading = () => {
    return (
      <div className='h-0 md:h-1/3 bg-[#E3F0FA] pt-12 font-fredoka text-center flex items-center flex-col'>
        <h3 className='text-4xl text-home-background font-semibold'>
          Temukan Pilihan Buku Favoritmu
        </h3>
        <p className='text-xl pt-2 font-light md:w-[35rem]'>
          Terdapat berbagai macam pilihan buku yang bisa kamu dengarkan atau
          baca.
        </p>
      </div>
    );
  };

  const booksResponsive = () => {
    return (
      <div className='mt-8 md:hidden gap-4'>
        <Carousel className='w-full max-w-xs flex justify-center ml-10'>
          <CarouselContent className='items-center'>
            {data?.data?.map((book, index) => (
              <CarouselItem className='basis-1/2 items-center' key={index}>
                <BookList
                  isLoading={isLoading}
                  id={book.id}
                  title={book.title}
                  author={book.author}
                  imageUrl={book.thumbnail_url}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext className='mr-10' />
        </Carousel>
      </div>
    );
  };

  const books = () => {
    return (
      <div className='bg-[#E3F0FA] pt-0 h-[70%] md:h-screen flex justify-center flex-col items-center md:justify-normal md:block md:pt-0 px-8 font-fredoka'>
        <h3 className='text-2xl'>Buku Yang Tersedia</h3>
        <div className='mt-8 hidden md:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
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
        <div className='flex items-center justify-center pt-4'>
          <Button onClick={goToBookList} className='bg-[#EEBE62] text-white font-bold font-nunito text-base hover:bg-[#BF8140] text-center'>
            Lihat Buku Lain
          </Button>
        </div>
        {booksResponsive()}
      </div>
    );
  };

  const audioSection = () => {
    return (
      <>
        <audio
          src={soundActivation?.data?.audio}
          onPlay={() => setIsAudioPlaying(true)}
          onEnded={() => setIsAudioPlaying(false)}
          ref={soundActivationRef}
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
      {hero()}
      {audioSection()}
      <img
        src={CloudIllustration}
        className='hidden absolute md:block md:bottom-[-3.5rem] w-full object-cover md:object-contain'
      />
      {subheading()}
      {books()}
      {/* TODO */}
      <ModalSound
        disabled={isAudioPlaying || onPlayGreetings}
        onOpen={soundModal}
        onEnableAudio={onEnableAudio}
        onOpenChange={setSoundModal}
        onDisabledAudio={onDisabledAudio}
      />
    </>
  );
};
