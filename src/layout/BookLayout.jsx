import { Navbar } from "@/sections";
import { Outlet } from "react-router-dom";

const BookLayout = () => {
  return (
    <>
      <div className="min-h-screen bg-gray-900 px-20">
        <Navbar isDark={true} className="pt-10 bg-gray-900" />
        <Outlet />
      </div>
    </>
  );
};

export default BookLayout;
