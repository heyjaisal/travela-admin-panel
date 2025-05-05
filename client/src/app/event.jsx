import ImageGallery from "@/Components/image";
import MapWithDirectionButton from "@/Components/map";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axiosInstance from "@/utils/axios-instance";
import { ToastContainer, toast } from "react-toastify";

function Eventpage() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const { data } = await axiosInstance.get(`/user/details/${id}`, {
          params: { type: "event" },
          withCredentials: true,
        });
        const eventData = data.item || {};
        setEvent(eventData);
      } catch (error) {
        console.error("Error fetching event:", error);
        toast.error("Failed to load event details");
      }
    };

    const fetchReviews = async () => {
      try {
        const { data } = await axiosInstance.get(`/listing/reviews/Event/${id}`, {
          withCredentials: true,
        });
        setReviews(data.reviews || []);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    if (id) {
      fetchEvent();
      fetchReviews();
    }
  }, [id]);

  return (
    <>
      <ToastContainer />
      <div className="max-w-6xl mx-auto p-4">
        <h2 className="text-xl font-semibold mb-4">
          {event?.title || "Event Details"}
        </h2>
        <ImageGallery images={event?.images || []} />
      </div>

      <div className="max-w-6xl mx-auto p-4 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Ticket Info Card */}
        <div className="bg-white shadow-lg p-6 rounded-lg border order-1 md:order-2 md:sticky md:top-20 self-start">
          <h2 className="text-xl font-bold">
            ₹{event?.ticketPrice || 0}
            <span className="text-sm font-normal">/Ticket</span>
          </h2>
          <p className="text-gray-600">
            Max Guests: {event?.maxGuests || "N/A"}
          </p>
        </div>

        {/* Event Details */}
        <div className="md:col-span-2 space-y-4 order-2 md:order-1">
          <h1 className="text-2xl font-bold">
            Event in {event?.state || "Unknown"},{" "}
            {event?.country || "Unknown"}
          </h1>
          <p className="text-gray-600">
            Event Type: {event?.eventType || "N/A"}
          </p>
          <p className="text-gray-600">
            Event Venue: {event?.eventVenue || "N/A"}
          </p>
          <p className="text-gray-700">
            Location: {event?.city || "N/A"}, {event?.state || "N/A"},{" "}
            {event?.country || "N/A"}
          </p>

          {/* Host Info */}
          <div className="border-t pt-4 flex items-center gap-3">
            <Link
              to={`/host/${event?.host?._id || ""}`}
              className="flex items-center gap-3 mb-4 cursor-pointer"
            >
              <Avatar>
                <AvatarImage src={event?.host?.image || ""} alt="Host Avatar" />
                <AvatarFallback>
                  {event?.host?.firstName?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold">
                  Hosted by {event?.host?.firstName || "Unknown"}{" "}
                  {event?.host?.lastName || ""}
                </h3>
                <p className="text-sm text-gray-500">
                  3 years hosting{" "}
                  {event?.host?.profileSetup ? "· Verified Host" : ""}
                </p>
              </div>
            </Link>
          </div>

          {/* Description */}
          <p className="py-5">
            {event?.description || "No description available."}
          </p>

          {/* Features */}
          <h3 className="text-lg font-semibold mb-2">About this place</h3>
          <ul className="space-y-1 text-gray-700 text-sm">
            {event?.features && event?.features.length > 0 ? (
              event.features.map((feature) => (
                <li key={feature._id || feature.text}>{feature.text}</li>
              ))
            ) : (
              <li>No features listed</li>
            )}
          </ul>

          {/* Map */}
          <h3 className="text-xl font-bold">Where you'll be</h3>
          <p>
            {event?.street || "N/A"}, {event?.city || "N/A"},{" "}
            {event?.state || "N/A"}, {event?.country || "N/A"}
          </p>
          <MapWithDirectionButton
            lat={event?.location?.lat || 0}
            lng={event?.location?.lng || 0}
          />

          {/* Reviews */}
          <div className="mt-12 space-y-6">
            <h2 className="text-2xl font-bold">Reviews</h2>
            {reviews.length === 0 && (
              <p className="text-gray-600">No reviews yet.</p>
            )}
            <div className="space-y-4">
              {reviews.map((review) => (
                <div
                  key={review._id}
                  className="p-4 bg-white rounded-lg shadow"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={review.user?.image || ""} />
                      <AvatarFallback>
                        {review.user?.username?.charAt(0).toUpperCase() || "?"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">
                        {review.user?.username || "User"}
                      </p>
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
    </>
  );
}

export default Eventpage;
