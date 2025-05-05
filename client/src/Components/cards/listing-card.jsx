import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const ListingCard = ({ listing, type }) => {
  const navigate = useNavigate();

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  const hasMultipleImages = listing.images.length > 1;

  const renderImageSlider = () =>
    hasMultipleImages ? (
      <Slider {...settings} className="rounded-xl overflow-hidden">
        {listing.images.map((img, index) => (
          <div key={index}>
            <img
              src={img}
              alt={`${type === "property" ? "Property" : "Event"} ${index + 1}`}
              className="w-full h-72 object-cover rounded-xl"
            />
          </div>
        ))}
      </Slider>
    ) : (
      <img
        src={listing.images[0]}
        alt={`${type === "property" ? "Property" : "Event"}`}
        className="w-full h-72 object-cover rounded-xl"
      />
    );

  const handleClick = () => {
    navigate(`/${type}/${listing._id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="transition-transform duration-300 hover:scale-105 relative border p-2 rounded-lg cursor-pointer"
    >
      <div className="overflow-hidden">{renderImageSlider()}</div>

      <div className="mt-2 px-1">
        <h3 className="text-lg font-semibold truncate">
          {type === "property" ? listing.propertyType : listing.title}
        </h3>
        <p className="text-gray-500 text-sm truncate">
          {listing.city}, {listing.country}
        </p>
        <div className="flex justify-between items-center mt-1 relative">
          <span className="text-lg font-bold">
            ₹
            {type === "property" ? listing.price : listing.ticketPrice}/
            <span className="text-red-200 font-thin">
              {type === "property" ? "night" : "ticket"}
            </span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default ListingCard;
