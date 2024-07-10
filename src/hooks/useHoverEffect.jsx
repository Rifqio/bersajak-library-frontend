// hooks/useHoverEffects.js
import { useEffect } from "react";

const useHoverEffect = () => {
  useEffect(() => {
    const options = document.querySelectorAll('[id^="option-"]');

    const selectFilter = (evt) => {
      if (!evt) return;
      const filter = evt.target.id.replace("option-", "");
      if (!filter) return;
      applyFilter(filter);
    };

    const removeFilter = (evt) => {
      if (!evt) return;
      const filter = evt.target.id.replace("option-", "");
      if (!filter) return;
      const stylingID = document.getElementById("styleID");
      const filterID = document.getElementById("filterID");
      if (stylingID && filterID) {
        stylingID.remove();
        filterID.remove();
      }
    };

    const applyFilter = (filter) => {
      if (filter === "normal")
        return removeFilter({ target: { id: window.selectedFilter } });

      if (
        document.getElementById("styleID") &&
        document.getElementById("filterID")
      ) {
        document.getElementById("styleID").remove();
        document.getElementById("filterID").remove();
      }
      const stylingID = document.createElement("style");
      stylingID.id = "styleID";
      document.body.appendChild(stylingID);

      const filterID = document.createElement("div");
      filterID.id = "filterID";
      filterID.setAttribute(
        "style",
        "height: 0; padding: 0; margin: 0; line-height: 0;"
      );
      document.body.appendChild(filterID);

      filterID.innerHTML = filter[filter + "SVG"];
      stylingID.innerHTML = filter[filter + "Styles"];

      setTimeout(() => {
        window.scrollBy(1, 1);
        window.scrollBy(-1, -1);
      }, 1);
    };

    options.forEach((option) => {
      option.addEventListener("mouseover", selectFilter);
      option.addEventListener("mouseout", (evt) => {
        removeFilter(evt);
        if (window.selectedFilter) applyFilter(window.selectedFilter);
      });
    });

    return () => {
      options.forEach((option) => {
        option.removeEventListener("mouseover", selectFilter);
        option.removeEventListener("mouseout", () => {});
      });
    };
  }, []);
};

export default useHoverEffect;
