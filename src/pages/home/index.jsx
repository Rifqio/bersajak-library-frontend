import BookList from "@/sections/book-list";
import BooksIllustration from "../../assets/books.svg";

const HomePage = () => {
  const heroSection = () => {
    return (
      <div className="flex flex-row justify-between">
        <div className="w-3/4 mt-20">
          <h1 className="font-playfair leading-normal text-5xl pb-4 tracking-wide">
            Membuka petualangan baru di setiap halaman
          </h1>
          <p className="text-sm tracking-wide">
            Pariatur laborum veniam irure id Lorem id dolor magna pariatur
            dolore deserunt. Adipisicing ullamco anim nisi exercitation Lorem
            exercitation sit anim sunt.
          </p>
        </div>
        <div className="items-start -mt-24">
          <img src={BooksIllustration} alt="Books Illustration" />
        </div>
      </div>
    );
  };

  const bookListSection = () => {
    return (
      <div>
        <h1 className="text-center font-thin text-3xl font-openSans">
          Mau baca buku apa hari ini?
        </h1>
        <div className="mt-8 grid grid-cols-3 gap-6">
          {[1, 2, 3].map((_, index) => (
            <BookList key={index} title="Judul" author="Test Author" />
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
