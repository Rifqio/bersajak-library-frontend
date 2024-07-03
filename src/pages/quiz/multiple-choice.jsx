import { Button } from "@/components";
import { MOCK_QUESTIONS } from "@/lib/mock";
import { CircleCheck } from "lucide-react";
import { useState } from "react";

export const MultipleChoicePage = () => {
  const { question, options, answer } = MOCK_QUESTIONS[0];
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);

  const optionsColors = ["#2971B0", "#63CACA", "#EFAB26", "#D6536D"];
  const hoverColors = ["#14417E", "#318091", "#AC6D13", "#9A2955"];

  const getBackgroundColor = (index, isHovered) => {
    if (selectedIndex === index) {
      return hoverColors[index % hoverColors.length];
    } else if (isHovered) {
      return hoverColors[index % hoverColors.length];
    } else {
      return optionsColors[index % optionsColors.length];
    }
  };

  const onHoverIn = (e, index) => {
    e.currentTarget.style.backgroundColor = getBackgroundColor(index, true);
  };

  const onHoverOut = (e, index) => {
    e.currentTarget.style.backgroundColor = getBackgroundColor(index, false);
  };

  const onSelectedAnswer = (index, option) => {
    setSelectedIndex(index);
    setSelectedOption(option);
  };

  const renderCheckmark = (index) => {
    if (selectedIndex === index) {
      return (
        <div className="absolute top-2 right-2">
          <Button variant="ghost" className="bg-accent" size="icon">
            <CircleCheck />
          </Button>
        </div>
      );
    }
  };

  return (
    <div className="mt-16 h-screen flex flex-col">
      <div className="text-center pb-32">
        <h1 className="text-4xl text-white font-poppins font-medium">
          {question}
        </h1>
      </div>

      <div className="grid grid-cols-4 gap-4 text-center flex-grow">
        {options.map((option, index) => (
          <button
            key={index}
            onClick={() => onSelectedAnswer(index, option)}
            className="relative w-full rounded-lg flex items-center justify-center h-full cursor-pointer transition-colors duration-300"
            style={{
              backgroundColor: getBackgroundColor(index, false),
              backgroundImage:
                "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.2) 100%)",
            }}
            onMouseEnter={(e) => onHoverIn(e, index)}
            onMouseLeave={(e) => onHoverOut(e, index)}
          >
            <h3 className="font-bold text-3xl font-poppins text-white">
              {option.text}
            </h3>

            {renderCheckmark(index)}
            <div className="absolute bottom-0 rounded-b-lg w-full h-4 bg-black opacity-30"></div>
          </button>
        ))}
      </div>
    </div>
  );
};
