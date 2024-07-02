export const Navbar = () => {
  return (
    <nav className="flex justify-between pb-10 items-center">
      <h1 className="text-xl text-gray-800 font-bold">Book World</h1>
      <div className="flex items-center">
        <ul className="flex items-center space-x-6">
          <li className="font-semibold text-gray-700">Masuk</li>
          <li className="font-semibold text-gray-700">Daftar</li>
        </ul>
      </div>
    </nav>
  );
};
