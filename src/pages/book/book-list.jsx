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

  return (
    <div className='grid grid-cols-4 gap-4 pt-4'>
      <audio src={chooseBookData?.data?.audio} onEnded={onListen} autoPlay />
      {booklist?.data.map((book) => (
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
  );
};
