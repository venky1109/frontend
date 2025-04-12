import { useEffect, useRef } from "react";

const ClickOutsideWrapper = ({ children, onOutsideClick, excludeRef }) => {
    const wrapperRef = useRef(null);
  
    useEffect(() => {
      const handleClickOutside = (event) => {
        const clickedOutsideWrapper =
          wrapperRef.current && !wrapperRef.current.contains(event.target);
        const clickedOutsideExclude =
          excludeRef?.current && !excludeRef.current.contains(event.target);
  
        if (clickedOutsideWrapper && clickedOutsideExclude) {
          onOutsideClick();
        }
      };
  
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [onOutsideClick, excludeRef]);
  
    return (
      <div ref={wrapperRef} className="relative">
        {children}
      </div>
    );
  };
  
  export default ClickOutsideWrapper;
  
