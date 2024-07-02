import { Card, CardContent, CardTitle } from "@/components/card";
import { ROUTE } from "@/lib/constants";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

const BookList = ({ title, author }) => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate(ROUTE.Book + `/${title}`);
  };

  return (
    <Card
      onClick={handleNavigate}
      className="w-[300px] h-[450px] cursor-pointer flex flex-col"
    >
      <div
        className="w-full h-3/4 bg-cover bg-center"
        style={{ backgroundImage: `url(https://placehold.co/600x400)` }}
      ></div>
      <CardContent className="mt-6">
        <CardTitle>{title.substring(0, 10)}</CardTitle>
        <h3 className="text-lg font-medium pt-2 text-gray-600">{author}</h3>
      </CardContent>
    </Card>
  );
};

BookList.propTypes = {
  title: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
};

export default BookList;
