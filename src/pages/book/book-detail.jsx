import { Button } from "@/components";
import { Badge } from "@/components/badge";
import { fetcher } from "@/lib/fetcher";
import { useSwr } from "@/lib/swr";
import { useAudioStore } from "@/zustand";
import { Heart, Share2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

const BookDetailPage = () => {
  const { id } = useParams();
  const { isAudioEnabled } = useAudioStore();
  const navigate = useNavigate();
  const { data } = useSwr(`/book/${id}`, fetcher);

  const book = data?.data;

  const generateDescription = (text, bold) => {
    const boldText = bold ? "font-semibold" : "font-normal";
    return (
      <p
        className={`text-sm text-gray-800 tracking-normal ${boldText} leading-loose`}
      >
        {text}
      </p>
    );
  };

  const handleReadEbook = () => {
    if (isAudioEnabled) {
      navigate(`/book/read/audio/${id}`);
    } else {
      navigate(`/book/read/${id}`);
    }
  };

  return (
    <div className='grid grid-cols-2 gap-10 w-full'>
      <img
        className={`object-cover h-full rounded-md drop-shadow-md`}
        src={book?.thumbnail_url}
        alt='Book Cover'
      />
      <div className='mt-14'>
        <h3 className='text-sm pb-4 tracking-wide text-gray-500'>
          {book?.author}
        </h3>
        <h1 className='text-2xl pb-4 leading-normal tracking-normal font-semibold font-poppins'>
          {book?.title.toUpperCase()}
        </h1>
        <p className='text-sm pb-4 pt-2 text-gray-600 tracking-normal font-normal leading-loose'>
          {book?.description}
        </p>

        {/* <div className='flex flex-row gap-4 pb-8'>
          {book?.genres.map((genre) => (
            <Badge key={genre} variant='primary' className='text-sm'>
              {genre}
            </Badge>
          ))}
        </div> */}

        {/* Book details */}
        <div className='grid grid-cols-2 gap-6'>
          {generateDescription("Penulis", true)}
          {generateDescription(book?.author)}

          {generateDescription("Total Dibaca", true)}
          {generateDescription(book?.total_reads)}

          {generateDescription("Disukai", true)}
          {generateDescription(book?.total_likes)}
        </div>

        <div className='flex mt-8 justify-between pb-14'>
          <Button variant='ghost' className='hover:bg-gray-200' size='icon'>
            <Share2 />
          </Button>
          <Button variant='ghost' className='hover:bg-gray-200' size='icon'>
            <Heart />
          </Button>
          <Button
            onClick={handleReadEbook}
            className='w-[350px] bg-[#E74848] hover:bg-[#851633]'
          >
            Baca Sekarang
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BookDetailPage;
