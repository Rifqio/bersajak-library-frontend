import { Button } from "@/components";

export const Navbar = () => {
  return (
    <nav className="flex justify-between pb-10 items-center">
      <h1 className="text-xl text-gray-800 font-bold">Bersajak</h1>
      <div className="flex items-center">
        <ul className="flex items-center space-x-6">
          <li className="font-semibold text-gray-700">Masuk</li>
          <Button>Daftar</Button>
        </ul>
      </div>
    </nav>
  );
};
