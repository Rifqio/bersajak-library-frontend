import { Button, Skeleton } from "@/components";
import { Heart, Share2 } from "lucide-react";
import { useState } from "react";

const BookDetailPage = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  const book = {
    title: "Et consectetur magna consectetur culpa.",
    author: "John Doe",
    isbn: "978-3-16-148410-0",
    description:
      "In esse amet cupidatat adipisicing exercitation minim elit irure eu nisi ex duis cupidatat nulla. Tempor irure ea proident dolore adipisicing Lorem.",
    totalRead: 126,
    totalLike: 53,
    rating: 4.5,
  };

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

  return (
    <div className="grid grid-cols-2 gap-10 w-full">
      {!isLoaded && <Skeleton className="object-cover h-full rounded-md" />}
      <img
        className={`object-cover h-full rounded-md drop-shadow-md ${isLoaded ? '' : 'hidden'}`}
        src="https://unsplash.it/600/400"
        alt="Book Cover"
        onLoad={() => setIsLoaded(true)}
      />
      <div className="mt-14">
        <h3 className="text-sm pb-4 tracking-wide text-gray-500">
          {book.author}
        </h3>
        <h1 className="text-2xl pb-4 leading-normal tracking-normal font-semibold font-poppins">
          {book.title.toUpperCase()}
        </h1>
        <p className="text-sm pb-8 pt-2 text-gray-600 tracking-normal font-normal leading-loose">
          {book.description}
        </p>

        {/* Book details */}
        <div className="grid grid-cols-2 gap-6">
          {generateDescription("Penulis", true)}
          {generateDescription(book.author)}

          {generateDescription("ISBN", true)}
          {generateDescription(book.isbn)}

          {generateDescription("Total Dibaca", true)}
          {generateDescription(book.totalRead)}

          {generateDescription("Disukai", true)}
          {generateDescription(book.totalLike)}
        </div>

        <div className="flex mt-8 justify-between pb-14">
          <Button variant="ghost" className="hover:bg-gray-200" size="icon">
            <Share2 />
          </Button>
          <Button variant="ghost" className="hover:bg-gray-200" size="icon">
            <Heart />
          </Button>
          <Button className="w-[350px] bg-[#E74848] hover:bg-[#851633]">
            Baca Sekarang
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BookDetailPage;
