import { ErrorModal } from "@/components/error-modal";
import { NavbarPage } from "@/sections/navbar-page";
import CloudIllustration from "../assets/cloudNavbar3.svg";
import { Outlet } from "react-router-dom";

const BookLayout = () => {
  return (
    <>
      <NavbarPage className='pt-10 px-20 pb-10'/>
      <img
        src={CloudIllustration}
        className='absolute z-10 w-full top-[7.2rem] md:top-12 lg:top-14 object-contain'
      />
      <div className='min-h-screen bg-white px-20'>
        <Outlet />
        <ErrorModal />
      </div>
    </>
  );
};

export default BookLayout;
