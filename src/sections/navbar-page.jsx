import { Button } from "@/components";
import { ROUTE } from "@/lib/constants";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { useState } from "react";
import { AlignJustify, Circle, X } from "lucide-react";

export const NavbarPage = ({ className, isDark }) => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleNavigate = () => {
    navigate(ROUTE.Home);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className={`${className} bg-home-background`}>
      <div className='max-w-7xl md:z-10 mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between h-16'>
          <div className='flex-shrink-0 flex items-center cursor-pointer' onClick={handleNavigate}>
            <img className='w-16 h-16' src='/bersajak.png' />
            <button
              className={`text-2xl ${
                isDark ? "text-yellow-100 " : "text-white "
              } font-poppins tracking-tight font-bold cursor-pointer`}
            >
              Bersajak
            </button>
          </div>
          <div className='hidden md:flex md:items-center font-fredoka z-10'>
            <ul className='flex items-center space-x-6'>
              <button className='bg-home-background text-home-yellow border-4 border-home-background tracking-wide rounded-full w-20 h-10 text-light text-base hover:bg-[#BF8140]'>
                Masuk
              </button>
              <button className='bg-home-yellow text-home-background tracking-wide rounded-full w-28 h-10 text-light text-base hover:cursor-pointer hover:bg-[#BF8140]'>
                Daftar
              </button>
            </ul>
          </div>
          <div className='flex md:hidden items-center'>
            <button
              onClick={toggleMenu}
              className='text-gray-700 focus:outline-none'
            >
              {!isMenuOpen ? <AlignJustify size={24} /> : <X size={24} />}
            </button>
          </div>
        </div>
      </div>
      <div className={`md:hidden ${isMenuOpen ? "block" : "hidden"}`}>
        <ul className='px-2 pt-2 pb-3 space-y-2 sm:px-3'>
          <Button className='w-full text-white font-bold font-nunito'>
            Masuk
          </Button>
          <Button className='bg-[#EEBE62] z-10 text-white font-bold font-nunito text-base hover:bg-[#BF8140] w-full text-center'>
            Daftar
          </Button>
        </ul>
      </div>
      <div className='absolute left-0 top-0 w-14 z-0 h-14 rounded-br-full bg-[#94C1EB]' />
      <div className='absolute right-0 pl-20 top-0 w-44 z-0 h-36 rounded-bl-full bg-[#E33A79]' />
    </nav>
  );
};

NavbarPage.propTypes = {
  className: PropTypes.string,
  isDark: PropTypes.bool
};
