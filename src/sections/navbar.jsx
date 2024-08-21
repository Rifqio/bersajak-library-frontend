import { ROUTE } from "@/lib/constants";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

export const Navbar = ({ className, isDark }) => {
  const navigate = useNavigate();
  const handleNavigate = () => {
    navigate(ROUTE.Home);
  };


  return (
    <nav className={`${className}`}>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between h-16'>
          <div className='flex-shrink-0 flex items-center'>
            <img className='w-16 h-16' src='/bersajak.png' />
            <button
              onClick={handleNavigate}
              className={`text-2xl ${
                isDark ? "text-yellow-100 " : "text-white "
              } font-poppins tracking-tight font-bold cursor-pointer`}
            >
              Bersajak
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

Navbar.propTypes = {
  className: PropTypes.string,
  isDark: PropTypes.bool
};
