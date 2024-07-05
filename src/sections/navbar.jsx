import { Button } from "@/components";
import { ROUTE } from "@/lib/constants";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

export const Navbar = ({ className }) => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate(ROUTE.Home);
  };

  return (
    <nav className={`flex justify-between pb-10 items-center ${className}`}>
      <h1
        onClick={handleNavigate}
        className="text-2xl text-[#2B3448] font-poppins tracking-tight font-bold cursor-pointer"
      >
        Bersajak
      </h1>
      <div className="flex items-center">
        <ul className="flex items-center space-x-6">
          <li className="font-semibold text-gray-700">Masuk</li>
          <Button className="bg-[#EEBE62] text-white font-bold font-nunito text-base hover:bg-[#BF8140]">
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
