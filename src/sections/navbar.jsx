import { Button } from "@/components";
import { ROUTE } from "@/lib/constants";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { useState } from "react";
import { AlignJustify, X } from "lucide-react";

export const Navbar = ({ className }) => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleNavigate = () => {
    navigate(ROUTE.Home);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className={`bg-background_1 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex-shrink-0 flex items-center">
            <button
              onClick={handleNavigate}
              className="text-2xl text-[#2B3448] font-poppins tracking-tight font-bold cursor-pointer"
            >
              Bersajak
            </button>
          </div>
          <div className="hidden md:flex md:items-center">
            <ul className="flex items-center space-x-6">
              <li className="font-semibold text-gray-700">Masuk</li>
              <Button className="bg-[#EEBE62] text-white font-bold font-nunito text-base hover:bg-[#BF8140]">
                Daftar
              </Button>
            </ul>
          </div>
          <div className="flex md:hidden items-center">
            <button
              onClick={toggleMenu}
              className="text-gray-700 focus:outline-none"
            >
              {!isMenuOpen ? <AlignJustify size={24} /> : <X size={24} />}
            </button>
          </div>
        </div>
      </div>
      <div className={`md:hidden ${isMenuOpen ? "block" : "hidden"}`}>
        <ul className="px-2 pt-2 pb-3 space-y-2 sm:px-3">
          <Button className="font-semibold w-full text-white font-bold font-nunito">
            Masuk
          </Button>
          <Button className="bg-[#EEBE62] text-white font-bold font-nunito text-base hover:bg-[#BF8140] w-full text-center">
            Daftar
          </Button>
        </ul>
      </div>
    </nav>
  );
};

Navbar.propTypes = {
  className: PropTypes.string,
};
