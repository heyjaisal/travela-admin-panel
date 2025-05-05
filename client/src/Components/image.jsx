import React, { useState, useEffect } from "react";
import Slider from "react-slick";

const ImageGallery = ({ images }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div>
      {isMobile ? (
        <Slider dots infinite speed={500} slidesToShow={1} slidesToScroll={1} adaptiveHeight>
          {images.map((img, idx) => (
            <div key={idx}>
              <img src={img} alt={`Slide ${idx + 1}`} className="w-full h-64 object-cover rounded-xl" />
            </div>
          ))}
        </Slider>
      ) : (
        <div className="flex gap-4">
          {images.map((img, idx) => (
            <div
              key={idx}
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
              onClick={() => setSelectedImage(img)}
              className={`h-64 transition-all duration-300 ease-in-out flex-1 cursor-pointer ${
                hoveredIndex === idx ? "flex-[4]" : ""
              }`}
            >
              <img src={img} alt={`Image ${idx + 1}`} className="w-full h-full object-cover rounded-xl" />
            </div>
          ))}
        </div>
      )}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50" onClick={() => setSelectedImage(null)}>
          <button className="absolute top-5 right-5 text-white text-3xl" onClick={(e) => { e.stopPropagation(); setSelectedImage(null); }}>
            &times;
          </button>
          <img src={selectedImage} alt="Selected" className="max-w-3xl max-h-[80vh] rounded-xl" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </div>
  );
};

export default ImageGallery;
