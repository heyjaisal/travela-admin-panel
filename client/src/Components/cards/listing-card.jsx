import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";


const ListingCard = ({ listing, type }) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return type === "property" ? (
    <div className="transition-transform duration-300 hover:scale-105 relative border p-2 rounded-lg">
      <Slider {...settings} className="rounded-xl overflow-hidden">
        {listing.images.map((img, index) => (
          <div key={index}>
            <img
              src={img}
              alt={`Property ${index + 1}`}
              className="w-full h-72 object-cover rounded-xl"
            />
          </div>
        ))}
      </Slider>
      <div className="mt-2 px-1">
        <h3 className="text-lg font-semibold truncate">
          {listing.propertyType}
        </h3>
        <p className="text-gray-500 text-sm truncate">
          {listing.city}, {listing.country}
        </p>
        <div className="flex justify-between items-center mt-1 relative">
          <span className="text-lg font-bold">
            ₹{listing.price}/
            <span className="text-red-200 font-thin">night</span>
          </span>
        </div>
      </div>
    </div>
  ) : (
    <div className="transition-transform duration-300 hover:scale-105 relative border p-2 rounded-lg">
      <Slider {...settings} className="rounded-xl overflow-hidden">
        {listing.images.map((img, index) => (
          <div key={index}>
            <img
              src={img}
              alt={`Event ${index + 1}`}
              className="w-full h-72 object-cover rounded-xl"
            />
          </div>
        ))}
      </Slider>

      <div className="mt-2 px-1">
        <h3 className="text-lg font-semibold truncate">{listing.title}</h3>
        <p className="text-gray-500 text-sm truncate">
          {listing.city}, {listing.country}
        </p>
        <span className="text-lg font-bold">
          ₹{listing.ticketPrice}/
          <span className="text-red-200 font-thin">ticket</span>
        </span>
      </div>
    </div>
  );
};

export default ListingCard