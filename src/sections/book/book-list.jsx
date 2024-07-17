import { Card, CardContent, CardTitle } from "@/components";
import { ROUTE } from "@/lib/constants";
import { useAudioStore } from "@/zustand";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

const BookList = ({ id, title, author, imageUrl }) => {
  const { isAudioEnabled } = useAudioStore();
  const navigate = useNavigate();

  const handleNavigate = () => {
    if (isAudioEnabled) {
      navigate(ROUTE.AudioBook + `/${id}`);
    } else {
      navigate(ROUTE.Book + `/${id}`);
    }
  };

  const trimmedTitle = () => {
    if (title.length > 20) {
      return title.substring(0, 10) + "...";
    }
    return title;
  };

  return (
    <Card
      onClick={handleNavigate}
      className='w-[120px] h-[200px] md:w-[250px] md:h-[450px] cursor-pointer flex flex-col bg-white shadow-md transition-transform transform hover:scale-105'
    >
      <div
        className='w-full h-full md:h-3/4 bg-cover bg-center'
        style={{ backgroundImage: `url(${imageUrl})` }}
      ></div>
      <CardContent className='hidden md:visible mt-6'>
        <CardTitle className="text-base md:text-2xl">{trimmedTitle()}</CardTitle>
        <h3 className='text-sm md:text-lg font-medium pt-2 text-gray-600'>{author}</h3>
      </CardContent>
    </Card>
  );
};

BookList.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
  imageUrl: PropTypes.string.isRequired,
};

export default BookList;
