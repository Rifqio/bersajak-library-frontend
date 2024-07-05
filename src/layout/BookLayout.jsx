import { Navbar } from "@/sections";
import { Outlet } from "react-router-dom";

const BookLayout = () => {
  return (
    <>
      <div className="min-h-screen bg-gradient-to-t from-white to-pink-50 px-20">
        <Navbar className="pt-10" />
        <Outlet />
      </div>
    </>
  );
};

export default BookLayout;
