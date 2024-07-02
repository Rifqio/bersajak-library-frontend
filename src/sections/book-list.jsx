import { Card, CardContent, CardTitle } from "@/components/card";
import PropTypes from "prop-types";

const BookList = ({ title, author }) => {
  return (
    <Card className="w-[300px] h-[450px] flex flex-col">
      <div
        className="w-full h-3/4 bg-cover bg-center"
        style={{ backgroundImage: `url(https://placehold.co/600x400)` }}
      ></div>
      <CardContent className="mt-6">
        <CardTitle>{title}</CardTitle>
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
