import { ROUTE } from "@/lib/constants";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

export const NavbarPage = ({ className, isDark }) => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate(ROUTE.Home);
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
          {/* Desktop */}
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
          {/* Mobile */}
        </div>
      </div>
    
      <div className='absolute left-0 top-0 w-10 h-10 md:w-14 z-0 md:h-14 rounded-br-full bg-[#94C1EB]' />
      <div className='absolute z-0 right-0 lg:pl-20 top-0 w-28 h-28 lg:w-44 lg:h-36 rounded-bl-full bg-[#E33A79]' />
    </nav>
  );
};

NavbarPage.propTypes = {
  className: PropTypes.string,
  isDark: PropTypes.bool
};
