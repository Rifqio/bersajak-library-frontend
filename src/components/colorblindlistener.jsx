// components/ColorblindListener.js
import { useEffect } from "react";

const ColorblindListener = () => {
  useEffect(() => {
    const setSelected = (value) => {
      // Simulate Chrome Extension storage functionality (for testing)
      console.log(`Setting selected filter to: ${value}`);
      document.getElementById(value).checked = true; // Simulate setting checked state
    };

    const injectFilter = async (fileName) => {
      // Simulate Chrome Extension executeScript functionality (for testing)
      console.log(`Injecting filter: ${fileName}`);
      // Simulate executing script
    };

    const applyFilter = (filter) => {
      // Simulate applying filter logic (replace with actual logic as needed)
      console.log(`Applying filter: ${filter}`);
    };

    const handleRadioClick = (event) => {
      const radioButton = event.target;
      const filter = radioButton.parentElement.id.replace("option-", "");
      setSelected(radioButton.id);
      injectFilter(`filters/${filter}.js`);
      applyFilter(filter);
    };

    // Attach event listeners to radio buttons
    const radioButtons = document.querySelectorAll('[id^="radio"]');
    radioButtons.forEach((radioButton) => {
      radioButton.addEventListener("click", handleRadioClick);
    });

    return () => {
      // Clean up event listeners on component unmount
      radioButtons.forEach((radioButton) => {
        radioButton.removeEventListener("click", handleRadioClick);
      });
    };
  }, []);

  return null; // This component doesn't render any UI elements
};

export default ColorblindListener;
