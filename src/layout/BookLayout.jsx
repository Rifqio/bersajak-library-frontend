import { Navbar } from "@/sections";
import { Outlet } from "react-router-dom";

const BookLayout = () => {
  return (
    <>
      <Navbar className="px-20 py-10 bg-white" />
      <div className="min-h-screen bg-background_1 px-20">
        <Outlet />
      </div>
    </>
  );
};

export default BookLayout;
