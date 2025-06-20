import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import { today, getLocalTimeZone, parseDate } from "@internationalized/date";
import { useLocale } from "@react-aria/i18n";

import ImageGallery from "@/Components/image";
import MapWithDirectionButton from "@/Components/map";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import axiosInstance from "@/utils/axios-instance";

function PropertyPage() {
  const { locale } = useLocale();
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [disabledRanges, setDisabledRanges] = useState([]);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const { data } = await axiosInstance.get(`/user/details/${id}`, {
          params: { type: "property" },
          withCredentials: true,
        });
        const item = data.item || {};
        item.features = Array.isArray(item.features) ? item.features : [];
        item.images = Array.isArray(item.images) ? item.images : [];
        setProperty(item);

        if (item.bookedDates?.length > 0) {
          const ranges = item.bookedDates.map((booking) => {
            const startDate = parseDate(booking.checkIn);
            const endDate = parseDate(booking.checkOut);
            return [startDate, endDate];
          });
          setDisabledRanges(ranges);
        }
      } catch (error) {
        console.error("Error fetching property details:", error);
      }
    };

    const fetchReviews = async () => {
      try {
        const { data } = await axiosInstance.get(`/listing/reviews/Property/${id}`);
        setReviews(data.reviews || []);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    if (id) {
      fetchProperty();
      fetchReviews();
    }
  }, [id]);

  if (!property) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-10">
      <div>
        <h2 className="text-xl font-semibold mb-4">
          {property.title || "Property Details"}
        </h2>
        <ImageGallery images={property.images} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          <h1 className="text-2xl font-bold">
            Barn in {property.state}, {property.country}
          </h1>
          <p className="text-gray-600">
            {property.maxGuests} guests · {property.bedrooms} bedrooms · {property.kitchen} Kitchen · {property.bathrooms} bathrooms
          </p>
          <p className="text-gray-700">
            Location: {property.city}, {property.state}, {property.country}
          </p>

          <Link to={`/host/${property?.host?._id}`} className="border-t pt-4 flex items-center gap-3">
            <Avatar>
              <AvatarImage src={property.host?.image} alt="Host Avatar" />
              <AvatarFallback>
                {property.host?.username?.charAt(0).toUpperCase() || "?"}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold">
                Hosted by {property?.host?.firstName || "Unknown"} {property?.host?.lastName || ""}
              </h3>
              <p className="text-sm text-gray-500">3 years hosting · Verified Host</p>
            </div>
          </Link>

          <p className="py-5">{property.description}</p>

          <h3 className="text-lg font-semibold mb-2">About this place</h3>
          <ul className="space-y-1 text-gray-700 text-sm">
            {property.features.length > 0 ? (
              property.features.map((feature, idx) => (
                <li key={feature._id || idx}>{feature.text}</li>
              ))
            ) : (
              <li>No features listed</li>
            )}
          </ul>

          <h3 className="text-xl font-bold mt-6">Where you'll be</h3>
          <p>{property.street}, {property.city}, {property.state}, {property.country}</p>
          <MapWithDirectionButton lat={property.location?.lat} lng={property.location?.lng} />

          <div className="mt-12 space-y-6">
            <h2 className="text-2xl font-bold">Reviews</h2>
            {reviews.length === 0 && <p className="text-gray-600">No reviews yet.</p>}
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review._id} className="p-4 bg-white rounded-lg shadow">
                  <div className="flex items-center gap-3 mb-2">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={review.user?.image || ""} />
                      <AvatarFallback>
                        {review.user?.username?.charAt(0).toUpperCase() || "?"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{review.user?.username || "User"}</p>
                      <div className="flex gap-1 text-yellow-500">
                        {[...Array(5)].map((_, i) => (
                          <span key={i}>{i < review.rating ? "★" : "☆"}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-700">{review.comment}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PropertyPage;
