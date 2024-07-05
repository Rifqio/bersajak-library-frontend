import BookList from "@/sections/book/book-list";
import BooksIllustration from "../../assets/books.svg";
import { MOCK_BOOK_LIST } from "@/lib/mock";
import { Button } from "@/components";

const HomePage = () => {
  const heroSection = () => {
    return (
      <div className="relative flex flex-row justify-between">
        <div className="absolute inset-0 bg-cover bg-[url('/grid.svg')] opacity-30 z-0"></div>
        <div className="font-nunito w-3/4 mt-20 relative z-10">
          <h1 className="font-bold leading-normal text-5xl pb-4 tracking-tighter">
            Membuka <span className="text-[#5E8EAC]">petualangan</span>{" "}
            <span className="text-[#DE6C6B]">baru</span> di setiap halaman
          </h1>
          <p className="text-gray-600 pb-4 tracking-tight">
            Pariatur laborum veniam irure id Lorem id dolor magna pariatur
            dolore deserunt. Adipisicing ullamco anim nisi exercitation Lorem
            exercitation sit anim sunt.
          </p>
          <Button className="bg-[#EEBE62] text-[#40485A] font-bold font-nunito text-base hover:bg-[#BF8140]">
            Gabung sekarang
          </Button>
        </div>
        <div className="items-start -mt-24 relative z-10">
          <img src={BooksIllustration} alt="Books Illustration" />
        </div>
      </div>
    );
  };

  const bookListSection = () => {
    return (
      <div className="mt-4 font-nunito">
        <h1 className="text-center font-bold tracking-tighter text-3xl">
          Mau baca buku apa hari ini?
        </h1>
        <p className="text-center text-gray-600 mt-2">
          Pariatur laborum veniam irure id Lorem id dolor magna pariatur dolore
          deserunt. Adipisicing ullamco anim nisi exercitation Lorem exercitation
          sit anim sunt. </p>
        <div className="mt-8 grid grid-cols-4 gap-2">
          {MOCK_BOOK_LIST.map((book) => (
            <BookList
              key={book.id}
              id={book.id}
              title={book.title}
              author={book.author}
              imageUrl={book.imageUrl}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <>
      {heroSection()}
      {bookListSection()}
    </>
  );
};

export default HomePage;
