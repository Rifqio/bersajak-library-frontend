import BooksIllustration from "../../assets/books.svg";

const HomePage = () => {
  return (
    <div className="flex flex-row justify-between">
      <div className="w-3/4 mt-20">
        <h1 className="font-playfair leading-normal text-5xl pb-4 tracking-wide">
          Where every page is new Adventure
        </h1>
        <p className="text-sm tracking-wide">
          Pariatur laborum veniam irure id Lorem id dolor magna pariatur dolore
          deserunt. Adipisicing ullamco anim nisi exercitation Lorem
          exercitation sit anim sunt.
        </p>
      </div>
      <div className="items-start -mt-24">
        <img src={BooksIllustration} alt="Books Illustration" />
      </div>
    </div>
  );
};

export default HomePage;
