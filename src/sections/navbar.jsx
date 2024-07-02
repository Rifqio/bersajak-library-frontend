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
        className="text-xl text-gray-800 font-bold cursor-pointer"
      >
        Bersajak
      </h1>
      <div className="flex items-center">
        <ul className="flex items-center space-x-6">
          <li className="font-semibold text-gray-700">Masuk</li>
          <Button>Daftar</Button>
        </ul>
      </div>
    </nav>
  );
};

Navbar.propTypes = {
  className: PropTypes.string,
};
