import { Input } from "@/components/input";
import { fetcher } from "@/lib/fetcher";
import { useSwr } from "@/lib/swr";
import BookList from "@/sections/book/book-list";
import { useNavigate } from "react-router-dom";
import SpeechRecognition, {
  useSpeechRecognition
} from "react-speech-recognition";

export const BookListPage = () => {
  const navigate = useNavigate();
  const { data: booklist, isLoading } = useSwr("/book/list", fetcher);
  const { data: chooseBookData } = useSwr("/guide/book-list", fetcher);
  const commands = [
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

  useSpeechRecognition({ commands });
  const onListen = () => {
    SpeechRecognition.startListening({ continuous: true, language: "id-ID" });
  };

  const displayBooks = () => {
    if (isLoading) {
      return <h1>Loading...</h1>;
    }
    return (
      <>
        {booklist?.data.map((book) => (
          <div key={book.id}>
            <BookList
              isLoading={isLoading}
              key={book.id}
              id={book.id}
              title={book.title}
              author={book.author}
              imageUrl={book.thumbnail_url}
            />
          </div>
        ))}
      </>
    );
  };

  return (
    <div className='pt-10'>
      <div className='text-center flex flex-col justify-center items-center'>
        <Input placeholder="Cari Buku" className="w-full lg:w-1/2 h-8 font-fredoka rounded-full focus-visible:ring-home-background"/>
        <h1 className='text-home-background text-2xl md:text-4xl pt-4 font-fredoka font-semibold'>
          Temukan Berbagai
        </h1>
        <h1 className='text-home-background text-2xl md:text-4xl font-fredoka font-semibold'>
          Macam Pilihan Buku
        </h1>
      </div>
      <div className='grid grid-cols-2 lg:grid-cols-4 gap-y-8 gap-x-14 md:gap-y-0 md:gap-x-2 pt-8'>
        <audio src={chooseBookData?.data?.audio} onEnded={onListen} autoPlay />
        {displayBooks()}
      </div>
    </div>
  );
};
