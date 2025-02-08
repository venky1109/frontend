import { useEffect, useRef } from "react";

const ClickOutsideWrapper = ({ children, onOutsideClick }) => {
    const wrapperRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                onOutsideClick(); // Call function to close modal when clicking outside
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [onOutsideClick]);

    return (
        <div ref={wrapperRef} className="relative">
            {children}
        </div>
    );
};

export default ClickOutsideWrapper;
