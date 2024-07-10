import { useState, useRef } from "react";
import { Button } from "./button";
import { Pipette } from "lucide-react";
import { Card } from "./card";

const ColorblindPicker = () => {
  const [selectedMode, setSelectedMode] = useState("normal");
  const [isCardVisible, setIsCardVisible] = useState(false);
  const cardRef = useRef(null); // Create a ref to access the Card component

  const handleChange = (e) => {
    setSelectedMode(e.target.id);
  };

  const handleMouseEnter = () => {
    setIsCardVisible(true);
  };

  const handleMouseLeave = () => {
    // Check if the mouse is leaving the button or the card
    if (!cardRef.current.contains(event.relatedTarget)) {
      setIsCardVisible(false);
    }
  };

  const colorBlindMode = [
    {
      id: 1,
      name: "Normal",
      value: "normal"
    },
    {
      id: 2,
      name: "Achromatomaly",
      value: "achromatomaly"
    },
    {
      id: 3,
      name: "Achromatopsia",
      value: "achromatopsia"
    },
    {
      id: 4,
      name: "Deuteranomaly",
      value: "deuteranomaly"
    },
    {
      id: 5,
      name: "Deuteranopia",
      value: "deuteranopia"
    },
    {
      id: 6,
      name: "Protanomaly",
      value: "protanomaly"
    },
    {
      id: 7,
      name: "Protanopia",
      value: "protanopia"
    },
    {
      id: 8,
      name: "Tritanomaly",
      value: "tritanomaly"
    },
    {
      id: 9,
      name: "Tritanopia",
      value: "tritanopia"
    }
  ];

  const renderColorBlindPicker = () => {
    if (isCardVisible) {
      return (
        <Card
          ref={cardRef}
          className='absolute bottom-10 right-20 w-[250px] h-[430px] bg-white rounded-lg shadow-lg p-4'
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className='text-center text-gray-800 font-bold text-lg pb-4'>
            Colorblind Mode
          </div>
          <div className='flex flex-col'>
            {colorBlindMode.map((mode) => (
              <div key={mode.id} className='flex gap-4 items-center pb-4'>
                <input
                  type='radio'
                  id={mode.value}
                  name='colorblind'
                  value={mode.value}
                  onChange={handleChange}
                  checked={selectedMode === mode.value}
                />
                <label htmlFor={mode.value}>{mode.name}</label>
              </div>
            ))}
          </div>
        </Card>
      );
    }
    return null;
  };

  return (
    <div className='fixed bottom-14 right-5 z-30 rounded-full w-14 h-14'>
      <Button
        variant='ghost'
        onMouseEnter={handleMouseEnter}
        // onMouseLeave={handleMouseLeave}
        className='bg-[#EEBE62] text-[#40485A] font-bold font-nunito text-base rounded-full w-14 h-14 hover:bg-[#BF8140]'
      >
        <Pipette size={24} />
      </Button>
      {renderColorBlindPicker()}
    </div>
  );
};

export default ColorblindPicker;
