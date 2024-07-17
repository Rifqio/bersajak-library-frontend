import { Button, Card, CardContent } from "@/components";
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

export const NewHomePage = () => {
  const { data, isLoading } = useSwr("/book/list", fetcher);

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
      <div className='h-1/3 bg-[#E3F0FA] pt-12 font-fredoka text-center flex items-center flex-col'>
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
        <Carousel className='w-full max-w-xs flex'>
          <CarouselContent className="items-center">
            {data?.data?.map((book, index) => (
              <CarouselItem key={index}>
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
          <CarouselNext className="mr-10" />
        </Carousel>
      </div>
    );
  };

  const books = () => {
    return (
      <div className='bg-[#E3F0FA] pt-14 flex justify-center flex-col items-center md:justify-normal md:block md:pt-0 px-8 font-fredoka h-screen'>
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
        {booksResponsive()}
      </div>
    );
  };

  return (
    <>
      {hero()}
      <img
        src={CloudIllustration}
        className='absolute bottom-[-20rem] md:bottom-[-3.5rem] w-full object-cover md:object-contain'
      />
      {subheading()}
      {books()}
      <div className='bg-[#E3F0FA] h-1/6 md:hidden' />
      {/* TODO */}
      <ModalSound
        disabled={true}
        onOpen={false}
        onEnableAudio={true}
        // onOpenChange={setSoundModal}
        onDisabledAudio={false}
      />
    </>
  );
};
